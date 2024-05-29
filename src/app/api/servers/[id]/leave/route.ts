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
                profileId: {
                    not: profile.id,
                },
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[LEAVE_SERVER_PATCH]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
