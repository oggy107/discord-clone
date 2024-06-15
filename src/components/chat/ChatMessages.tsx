"use client";

import { Member } from "@prisma/client";
import { Fragment } from "react";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";

import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { MessageWithMemberWithProfile } from "@/types";
import ChatItem from "./ChatItem";
import { useChatSocket } from "@/hooks/use-chat-socket";
import {
    generateChannelKeyMessage,
    generateChannelKeyMessageUpdate,
} from "@/lib/utils";

const DATE_FORMAT = "dd MMM yyyy, HH:mm";

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
    const queryKey = `chat:${chatId}`;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    });

    useChatSocket({
        addKey: generateChannelKeyMessage(chatId),
        queryKey,
        updateKey: generateChannelKeyMessageUpdate(chatId),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something Went wrong!
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome name={name} type={type} />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map(
                            (message: MessageWithMemberWithProfile) => (
                                <ChatItem
                                    key={message.id}
                                    id={message.id}
                                    currentMember={member}
                                    content={message.content}
                                    fileUrl={message.fileUrl}
                                    deleted={message.deleted}
                                    timestamp={format(
                                        new Date(message.createdAt),
                                        DATE_FORMAT
                                    )}
                                    isUpdated={
                                        message.updatedAt !== message.createdAt
                                    }
                                    socketUrl={socketUrl}
                                    socketQuery={socketQuery}
                                    member={message.member}
                                />
                            )
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default ChatMessages;
