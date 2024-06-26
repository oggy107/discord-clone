import { ChannelType, MemberRole } from "@prisma/client";
import qs from "query-string";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const serverId = qs.parseUrl(req.url).query.serverId as string;

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (!params.channelId) {
            return new Response("Channel ID is required", { status: 400 });
        }

        if (!serverId) {
            return new Response("Server ID is required", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[CHANNELS_DELETE]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const serverId = qs.parseUrl(req.url).query.serverId as string;
        const { name, type } = (await req.json()) as {
            name: string;
            type: ChannelType;
        };

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (!params.channelId) {
            return new Response("Channel ID is required", { status: 400 });
        }

        if (!name || !type) {
            return new Response("Channel data is required", { status: 400 });
        }

        if (name === "general") {
            return new Response("Channel name cannot be 'general'", {
                status: 400,
            });
        }

        if (!serverId) {
            return new Response("Server ID is required", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            name: {
                                not: "general",
                            },
                        },
                        data: {
                            name,
                            type,
                        },
                    },
                },
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[CHANNELS_PATCH]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
