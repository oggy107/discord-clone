// "use client";

import { Plus } from "lucide-react";

import ActionTooltip from "@/components/ActionTooltip";

const NavigationAction = () => {
    return (
        <div>
            <ActionTooltip label="Add a server" side="right">
                <button className="group flex items-center">
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-full items-center justify-center bg-background dark:bg-neutral-700 group-hover:rounded-[16px] group-hover:bg-emerald-500 transition-all overflow-hidden">
                        <Plus
                            className="group-hover:text-white transition text-emerald-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
};

export default NavigationAction;
