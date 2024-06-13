"use client";

import { Member } from "@prisma/client";

import ChatWelcome from "./ChatWelcome";

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

const ChatMessages = ({
    name,
    apiUrl,
    chatId,
    member,
    paramKey,
    paramValue,
    socketQuery,
    socketUrl,
    type,
}: ChatMessagesProps) => {
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome name={name} type={type} />
        </div>
    );
};

export default ChatMessages;
