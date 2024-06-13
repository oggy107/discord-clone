"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import qs from "query-string";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import useModal from "@/hooks/use-modal-store";

const formSchema = z.object({
    fileUrl: z.string().min(1, "Attachment is required"),
});

const MessageFileModal = () => {
    const modal = useModal();
    const router = useRouter();

    const isModalOpen = modal.isOpen && modal.type === "messageFile";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        },
    });

    const handleClose = () => {
        form.reset();
        modal.onClose();
    };

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: modal.data.apiUrl || "",
                query: modal.data.query,
            });

            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });

            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.error("[MESSAGE_FILE]", error);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="flex justify-center pt-4">
                            <FormField
                                control={form.control}
                                name="fileUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                                endpoint="messageFile"
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Send"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default MessageFileModal;
