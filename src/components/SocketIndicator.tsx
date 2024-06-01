"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { Badge } from "@/components/ui/badge";

const SocketIndicator = () => {
    const { isConnected } = useSocket();

    if (!isConnected) {
        return <Badge variant="destructive">Disconnected</Badge>;
    }

    return <Badge variant="outline">connected</Badge>;
};

export default SocketIndicator;
