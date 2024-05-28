import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import ServerSidebar from "@/components/server/ServerSidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdlayoutProps {
    children: React.ReactNode;
    params: { id: string };
}

const ServerIdlayout = async ({ children, params }: ServerIdlayoutProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.id,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (!server) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={params.id} />
            </div>
            <main className="h-full md:pl-60">{children}</main>
        </div>
    );
};

export default ServerIdlayout;
