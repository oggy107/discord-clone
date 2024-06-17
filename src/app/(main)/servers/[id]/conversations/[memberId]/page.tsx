import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/ChatHeader";
import { db } from "@/lib/db";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

interface MemberIdPageProps {
    params: { id: string; memberId: string };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.id,
            profileId: profile.id,
        },
        include: {
            profile: true,
        },
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(
        currentMember.id,
        params.memberId
    );

    if (!conversation) {
        return redirect(`/servers/${params.id}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember =
        memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={otherMember.profile.name}
                serverId={params.id}
                type="conversation"
                imageUrl={otherMember.profile.imageUrl}
            />
            <ChatMessages
                member={currentMember}
                name={otherMember.profile.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id,
                }}
                paramKey="conversationId"
                paramValue={conversation.id}
            />
            <ChatInput
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                    conversationId: conversation.id,
                }}
            />
        </div>
    );
};

export default MemberIdPage;
