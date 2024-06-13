import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";
import { Member, Server, Profile } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
};

export type ModalType =
    | "createServer"
    | "invite"
    | "editServer"
    | "members"
    | "createChannel"
    | "leaveServer"
    | "deleteServer"
    | "deleteChannel"
    | "editChannel";

export type SearchType = "member" | "channel";
export type SectionType = "members" | "channels";

export type ChannelLabel =
    | "Text Channels"
    | "Voice Channels"
    | "Video Channels";

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIoServer;
        };
    };
};

export enum PusherEvent {
    MESSAGE = "message",
}
