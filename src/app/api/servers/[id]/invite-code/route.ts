import { v4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (!params.id) {
            return new Response("Server ID is required", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.id,
                profileId: profile.id,
            },
            data: {
                inviteCode: v4(),
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[SERVERS_PATCH]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
