"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ChannelType } from "@prisma/client";
import qs from "query-string";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal-store";

const formSchema = z.object({
    name: z
        .string()
        .min(1, "Channel name is required")
        .refine((name) => name !== "general", {
            message: "Channel name cannot be 'general'",
        }),
    type: z.nativeEnum(ChannelType),
});

const CreateChannelModal = () => {
    const modal = useModal();
    const router = useRouter();
    const params = useParams();

    const isModalOpen = modal.type === "createChannel" && modal.isOpen;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params?.id,
                },
            });

            await axios.post(url, values);

            form.reset();
            router.refresh();
            modal.onClose();
        } catch (error) {
            console.error("[CREATE_CHANNEL_SUBMIT]", error);
        }
    };

    const handleClose = () => {
        form.reset();
        modal.onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Create Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter channel name"
                                            className="bg-zinc-300/50 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Channel Type
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isLoading}
                                            defaultValue={
                                                modal.data.channelType ||
                                                field.value
                                            }
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="bg-zinc-300/50 border-none focus:ring-0 text-black focus:ring-offset-0 ring-offset-0 capitalize outline-none">
                                                <SelectValue placeholder="Select a channel type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(ChannelType).map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className="capitalize"
                                                        >
                                                            {type.toLowerCase()}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChannelModal;
