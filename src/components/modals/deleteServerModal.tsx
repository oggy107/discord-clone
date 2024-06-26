"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal-store";

const DeleteServerModal = () => {
    const modal = useModal();
    const router = useRouter();

    const isModalOpen = modal.type === "deleteServer" && modal.isOpen;
    const { server } = modal.data;

    const [isLoading, setIsLoading] = useState(false);

    const onConfirm = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/servers/${server?.id}`);

            modal.onClose();
            router.refresh();
            router.push("/");
        } catch (error) {
            console.error("[DELETE_SERVER]", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={modal.onClose}>
            <DialogContent className="bg-white text-black rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="font-semibold text-indigo-500">
                            {server?.name}
                        </span>{" "}
                        will be permanently deleted
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={modal.onClose}
                            variant="ghost"
                            className="transition"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onConfirm}
                            variant="destructive"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Confirm"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteServerModal;
