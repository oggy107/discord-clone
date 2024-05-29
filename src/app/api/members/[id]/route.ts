import { MemberRole } from "@prisma/client";
import qs from "query-string";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const profile = await currentProfile();
        const memberId = params.id;
        const { role } = (await req.json()) as { role: MemberRole };
        const serverId = qs.parseUrl(req.url).query.serverId as string;

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (!role) {
            return new Response("Member role is required", { status: 400 });
        }

        if (!memberId) {
            return new Response("Member ID is required", { status: 400 });
        }

        if (!serverId) {
            return new Response("Server ID is required", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id,
                            },
                        },
                        data: {
                            role,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[MEMBERS_ROLE_PATCH]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const profile = await currentProfile();
        const memberId = params.id;
        const serverId = qs.parseUrl(req.url).query.serverId as string;

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (!memberId) {
            return new Response("Member ID is required", { status: 400 });
        }

        if (!serverId) {
            return new Response("Server ID is required", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    delete: {
                        id: memberId,
                        profileId: {
                            not: profile.id,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[MEMBERS_DELETE]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
