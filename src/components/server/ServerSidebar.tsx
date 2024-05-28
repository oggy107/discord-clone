import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { ChannelType } from "@prisma/client";
import { db } from "@/lib/db";
import ServerHeader from "./ServerHeader";

interface ServerSidebarProps {
    serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
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

    if (!server) {
        return redirect("/");
    }

    const textChannels = server.channels.filter(
        (channel) => channel.type === ChannelType.TEXT
    );
    const audioChannels = server.channels.filter(
        (channel) => channel.type === ChannelType.AUDIO
    );
    const videoChannels = server.channels.filter(
        (channel) => channel.type === ChannelType.VIDEO
    );
    const members = server.members.filter(
        (member) => member.profileId !== profile.id
    );

    const role = server.members.find(
        (member) => member.profileId === profile.id
    )?.role;

    console.log(server);

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
            <ServerHeader role={role} server={server} />
        </div>
    );
};

export default ServerSidebar;
