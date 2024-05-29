"use client";

import { useState } from "react";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Check,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuPortal,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ServerWithMembersWithProfiles } from "@/types";
import useModal from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "../UserAvatar";

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

const MembersModal = () => {
    const router = useRouter();
    const modal = useModal();
    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = modal.type === "members" && modal.isOpen;
    const { server } = modal.data as { server: ServerWithMembersWithProfiles };

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);

            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });

            const resp = await axios.patch(url, { role });

            router.refresh();
            modal.onOpen("members", { server: resp.data });
        } catch (error) {
            console.error("[MEMBERS_MODAL_ROLE_CHANGE]", error);
        } finally {
            setLoadingId("");
        }
    };

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);

            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });

            const resp = await axios.delete(url);

            router.refresh();
            modal.onOpen("members", { server: resp.data });
        } catch (error) {
            console.error("[MEMBERS_MODAL_KICK]", error);
        } finally {
            setLoadingId("");
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={modal.onClose}>
            <DialogContent className="bg-white text-black rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length == 1
                            ? "1 Member"
                            : `${server?.members?.length} Members`}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-x-2 mb-6"
                        >
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId &&
                                loadingId !== member.id && (
                                    <div className="ml-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreVertical className="h-4 w-4 text-zinc-500" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="flex items-center">
                                                        <ShieldQuestion className="w-4 h-4 mr-2" />
                                                        <span>Role</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onRoleChange(
                                                                        member.id,
                                                                        MemberRole.GUEST
                                                                    )
                                                                }
                                                                className="min-w-36"
                                                            >
                                                                <Shield className="w-4 h-4 mr-2" />
                                                                Guest
                                                                {member.role ===
                                                                    MemberRole.GUEST && (
                                                                    <Check className="w-4 h-4 ml-auto" />
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onRoleChange(
                                                                        member.id,
                                                                        MemberRole.MODERATOR
                                                                    )
                                                                }
                                                            >
                                                                <ShieldCheck className="w-4 h-4 mr-2" />
                                                                Moderator
                                                                {member.role ===
                                                                    MemberRole.MODERATOR && (
                                                                    <Check className="w-4 h-4 ml-auto" />
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onKick(member.id)
                                                    }
                                                    className="text-rose-500"
                                                >
                                                    <Gavel className="w-4 h-4 mr-2" />
                                                    Kick
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default MembersModal;
