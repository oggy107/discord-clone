import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

export const getPusherInstance = () => {
    if (!pusherInstance) {
        pusherInstance = new Pusher({
            appId: process.env.PUSHER_APP_ID as string,
            key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
            secret: process.env.PUSHER_SECRET as string,
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
            useTLS: true,
        });
    }

    return pusherInstance;
};
