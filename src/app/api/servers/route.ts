import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

import { v4 } from "uuid";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: v4(),
                channels: {
                    create: [
                        {
                            name: "general",
                            profileId: profile.id,
                        },
                    ],
                },
                members: {
                    create: [
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN,
                        },
                    ],
                },
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[SERVERS_POST]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
