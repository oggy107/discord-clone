import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";
import { Member, Server, Profile, Message } from "@prisma/client";

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
    | "editChannel"
    | "messageFile"
    | "deleteMessage";

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

export type MessageWithMemberWithProfile = Message & {
    member: Member & { profile: Profile };
};
