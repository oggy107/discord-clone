"use client";

import { usePusherClient } from "@/components/providers/PusherProvider";
import { Badge } from "@/components/ui/badge";

const SocketIndicator = () => {
    const { isConnected } = usePusherClient();

    if (!isConnected) {
        return (
            <Badge
                variant="outline"
                className="bg-yellow-600 text-white border-none"
            >
                Disconnected
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="bg-emerald-600 text-white border-none"
        >
            connected
        </Badge>
    );
};

export default SocketIndicator;
