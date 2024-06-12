"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { ChannelLabel, SearchType } from "@/types";

interface ServerSearchProps {
    data: {
        label: ChannelLabel | "Members";
        type: SearchType;
        data?: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[];
    }[];
}

const ServerSearch = ({ data }: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        window.addEventListener("keydown", down);
        return () => window.removeEventListener("keydown", down);
    });

    const onClick = (id: string, type: SearchType) => {
        setOpen(false);

        if (type === "member") {
            return router.push(`/servers/${params?.id}/conversations/${id}`);
        }

        if (type === "channel") {
            return router.push(`/servers/${params?.id}/channels/${id}`);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    <span className="text-xs">ctrl</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;

                        return (
                            <div key={label}>
                                <CommandGroup heading={label}>
                                    {data.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            onSelect={() =>
                                                onClick(item.id, type)
                                            }
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandSeparator />
                            </div>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default ServerSearch;
