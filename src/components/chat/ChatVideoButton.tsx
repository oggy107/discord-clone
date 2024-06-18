"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";

import ActionTooltip from "@/components/ActionTooltip";

const ChatVideoButton = () => {
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isVideo = searchParams?.get("video");

    const Icon = isVideo ? VideoOff : Video;
    const tooltipLable = isVideo ? "End video call" : "Start video call";

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: pathName || "",
                query: {
                    video: isVideo ? undefined : "true",
                },
            },
            { skipNull: true }
        );

        router.push(url);
    };

    return (
        <ActionTooltip label={tooltipLable} side="bottom">
            <button
                onClick={onClick}
                className="flex items-center justify-center hover:opacity-75 transition mr-4"
            >
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTooltip>
    );
};

export default ChatVideoButton;
