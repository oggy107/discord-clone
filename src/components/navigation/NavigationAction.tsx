"use client";

import { Plus } from "lucide-react";

import ActionTooltip from "@/components/ActionTooltip";
import useModal from "@/hooks/use-modal-store";

const NavigationAction = () => {
    const serverModal = useModal();

    return (
        <div>
            <ActionTooltip label="Add a server" side="right">
                <div
                    className="group flex items-center"
                    onClick={() => serverModal.onOpen("createServer")}
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] items-center justify-center bg-neutral-300 dark:bg-neutral-700 group-hover:rounded-[16px] group-hover:bg-emerald-500 transition-all overflow-hidden">
                        <Plus
                            className="group-hover:text-white transition text-emerald-500"
                            size={25}
                        />
                    </div>
                </div>
            </ActionTooltip>
        </div>
    );
};

export default NavigationAction;
