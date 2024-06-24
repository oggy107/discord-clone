import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { usePusherClient } from "@/components/providers/PusherProvider";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}

export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
}: ChatQueryProps) => {
    const { isConnected } = usePusherClient();

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl(
            {
                url: apiUrl,
                query: {
                    cursor: pageParam,
                    [paramKey]: paramValue,
                },
            },
            { skipNull: true }
        );

        const res = await fetch(url);
        return res.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        // @ts-ignore
        queryFn: fetchMessages,
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
    };
};
