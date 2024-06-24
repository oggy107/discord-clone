import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const InviteCodePage = async ({ params }: { params: { code: string } }) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn({
            returnBackUrl: "/invite/" + params.code,
        });
    }

    if (!params.code) {
        return redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.code,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.code,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    },
                ],
            },
        },
    });

    if (server) {
        redirect(`/servers/${server.id}`);
    }

    return null;
};

export default InviteCodePage;
