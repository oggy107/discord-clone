import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";

interface ChannelIdPageProps {
    params: { id: string; channelId: string };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.id,
            profileId: profile.id,
        },
    });

    if (!channel || !member) {
        return redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            <div className="flex-1">future messages</div>
            <ChatInput
                name={channel.name}
                type="channel"
                apiUrl="/api/messages"
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
            />
        </div>
    );
};

export default ChannelIdPage;
