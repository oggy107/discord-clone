"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";

type PusherContextType = {
    pusher: Pusher | null;
    isConnected: boolean;
};

const PusherContext = createContext<PusherContextType>({
    pusher: null,
    isConnected: false,
});

export const usePusherClient = () => {
    return useContext(PusherContext);
};

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
    const [pusher, setPusher] = useState<Pusher | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        pusher.connection.bind("state_change", function (state: any) {
            if (state.current === "connected") {
                setIsConnected(true);
            } else {
                console.info("[PUSHER_CLIENT_CONNECTION]", state);
            }
        });

        pusher.connection.bind("error", function (err: any) {
            console.error("[PUSHER_CLIENT_CONNECTION]", err);
        });

        setPusher(pusher);

        // return () => {
        //     pusherClient.disconnect();
        // };
    }, []);

    return (
        <PusherContext.Provider value={{ pusher, isConnected }}>
            {children}
        </PusherContext.Provider>
    );
};
