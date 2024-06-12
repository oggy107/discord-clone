"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";

type PusherContextType = {
    client: Pusher | null;
    isConnected: boolean;
};

const PusherContext = createContext<PusherContextType>({
    client: null,
    isConnected: false,
});

export const usePusherClient = () => {
    return useContext(PusherContext);
};

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
    const [client, setClient] = useState<Pusher | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        pusherClient.bind("connected", () => {
            console.log("yoho");
            setIsConnected(true);
        });

        pusherClient.bind("disconnected", () => {
            setIsConnected(false);
        });

        pusherClient.connection.bind("state_change", function (state: any) {
            if (state.current === "connected") {
                setIsConnected(true);
            } else {
                console.error("[PUSHER_CLIENT_CONNECTION]", state);
            }
        });

        pusherClient.connection.bind("error", function (err: any) {
            console.error("[PUSHER_CLIENT_CONNECTION]", err);
        });

        setClient(pusherClient);

        // return () => {
        //     pusherClient.disconnect();
        // };
    }, []);

    return (
        <PusherContext.Provider value={{ client, isConnected }}>
            {children}
        </PusherContext.Provider>
    );
};
