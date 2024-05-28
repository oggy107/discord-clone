"use client";

import { useState } from "react";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal-store";
import useOrigin from "@/hooks/use-origin";

const InviteModal = () => {
    const inviteModal = useModal();
    const origin = useOrigin();

    const isModalOpen = inviteModal.type === "invite" && inviteModal.isOpen;
    const { server } = inviteModal.data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => setCopied(false), 1000);
    };

    const onNew = async () => {
        try {
            setIsLoading(true);

            const resp = await axios.patch(
                `/api/servers/${server?.id}/invite-code`
            );

            inviteModal.onOpen("invite", { server: resp.data });
        } catch (error) {
            console.error("[GENERATE_INVITE]", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={inviteModal.onClose}>
            <DialogContent className="bg-white text-black rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-none focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button
                            disabled={isLoading}
                            size="icon"
                            onClick={onCopy}
                        >
                            {copied ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4"
                    >
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
