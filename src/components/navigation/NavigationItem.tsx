"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/ActionTooltip";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
}

const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const navigate = () => {
        params.id !== id && router.push(`/servers/${id}`);
    };

    return (
        <ActionTooltip label={name} side="right">
            <div
                className="group relative flex items-center"
                onClick={navigate}
            >
                <div
                    className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                        params.id !== id && "group-hover:h-[20px]",
                        params.id == id ? "h-[36px]" : "h-[8px]"
                    )}
                />
                <div
                    className={cn(
                        "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                        params.id == id &&
                            "bg-primary/10 text-primary rounded-[16px]"
                    )}
                >
                    <Image
                        priority
                        fill
                        src={imageUrl}
                        alt={name}
                        sizes="5vw"
                    />
                </div>
            </div>
        </ActionTooltip>
    );
};

export default NavigationItem;
