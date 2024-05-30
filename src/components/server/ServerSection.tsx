"use client";

import { ChannelType, MemberRole } from "@prisma/client";
import { Plus, Settings } from "lucide-react";

import {
    ChannelLabel,
    SectionType,
    ServerWithMembersWithProfiles,
} from "@/types";
import ActionTooltip from "@/components/ActionTooltip";
import useModal from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: ChannelLabel | "Members";
    sectionType: SectionType;
    role?: MemberRole;
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
    label,
    sectionType,
    role,
    channelType,
    server,
}: ServerSectionProps) => {
    const modal = useModal();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip label="create channel" side="top">
                    <button
                        onClick={() => modal.onOpen("createChannel")}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="add member" side="top">
                    <button
                        onClick={() => modal.onOpen("members", { server })}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
};

export default ServerSection;
