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
