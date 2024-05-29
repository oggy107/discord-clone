import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (!name || !imageUrl) {
            return new Response("Server data is required", { status: 400 });
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
                name,
                imageUrl,
            },
        });

        return Response.json(server);
    } catch (error) {
        console.error("[EDIT_SERVER_PATCH]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
