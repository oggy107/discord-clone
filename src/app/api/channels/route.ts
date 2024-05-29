import { ChannelType, MemberRole } from "@prisma/client";
import qs from "query-string";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { name, type } = (await req.json()) as {
            name: string;
            type: ChannelType;
        };
        const serverId = qs.parseUrl(req.url).query.serverId as string;

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new Response("Server ID is required", { status: 400 });
        }

        if (!name || !type) {
            return new Response("Channel data is required", { status: 400 });
        }

        if (name === "general") {
            return new Response("Channel name cannot be 'general'", {
                status: 400,
            });
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
                    create: {
                        name,
                        type,
                        profileId: profile.id,
                    },
                },
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[CHANNELS_POST]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
