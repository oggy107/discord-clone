import { Member, Server, Profile } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
};

export type ModalType =
    | "createServer"
    | "invite"
    | "editServer"
    | "members"
    | "createChannel";
