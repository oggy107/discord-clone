import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { usePusherClient } from "@/components/providers/PusherProvider";
import { MessageWithMemberWithProfile, PusherEvent } from "@/types";

interface ChatSocketProps {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

export const useChatSocket = ({
    addKey,
    queryKey,
    updateKey,
}: ChatSocketProps) => {
    const { pusher } = usePusherClient();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!pusher) {
            return;
        }

        const updateChannel = pusher
            .subscribe(updateKey)
            .bind(
                PusherEvent.MESSAGE,
                (message: MessageWithMemberWithProfile) => {
                    queryClient.setQueryData([queryKey], (oldData: any) => {
                        if (
                            !oldData ||
                            !oldData.pages ||
                            oldData.pages.length === 0
                        ) {
                            return oldData;
                        }

                        const newData = oldData.pages.map((page: any) => {
                            return {
                                ...page,
                                items: page.items.map(
                                    (item: MessageWithMemberWithProfile) => {
                                        if (item.id === message.id) {
                                            return message;
                                        }

                                        return item;
                                    }
                                ),
                            };
                        });

                        return {
                            ...oldData,
                            pages: newData,
                        };
                    });
                }
            );

        const addChannel = pusher
            .subscribe(addKey)
            .bind(
                PusherEvent.MESSAGE,
                (message: MessageWithMemberWithProfile) => {
                    queryClient.setQueryData([queryKey], (oldData: any) => {
                        if (
                            !oldData ||
                            !oldData.pages ||
                            oldData.pages.length === 0
                        ) {
                            return {
                                pages: [
                                    {
                                        items: [message],
                                    },
                                ],
                            };
                        }

                        const newData = [...oldData.pages];

                        newData[0] = {
                            ...newData[0],
                            items: [message, ...newData[0].items],
                        };

                        return {
                            ...oldData,
                            pages: newData,
                        };
                    });
                }
            );

        return () => {
            updateChannel.unbind();
            addChannel.unbind();
        };
    }, [queryClient, addKey, queryKey, updateKey, pusher]);
};
