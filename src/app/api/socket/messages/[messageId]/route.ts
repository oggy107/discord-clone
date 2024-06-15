import qs from "query-string";
import { MemberRole } from "@prisma/client";

import { getPusherInstance } from "@/lib/pusher";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { PusherEvent } from "@/types";
import { generateChannelKeyMessageUpdate } from "@/lib/utils";

const pusher = getPusherInstance();

export async function PATCH(
    req: Request,
    { params }: { params: { messageId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { content } = (await req.json()) as {
            content: string;
        };

        const serverId = qs.parseUrl(req.url).query.serverId as string;
        const channelId = qs.parseUrl(req.url).query.channelId as string;

        if (!serverId) {
            return new Response("Server ID is required", { status: 400 });
        }

        if (!channelId) {
            return new Response("Channel ID is required", { status: 400 });
        }

        const server = await db.server.findUnique({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (!server) {
            return new Response("Server not found", { status: 404 });
        }

        const channel = await db.channel.findUnique({
            where: {
                id: channelId,
                serverId: serverId,
            },
        });

        if (!channel) {
            return new Response("Channel not found", { status: 404 });
        }

        const member = server.members.find(
            (member) => member.profileId === profile.id
        );

        if (!member) {
            return new Response("Member not found", { status: 404 });
        }

        const message = await db.message.findUnique({
            where: {
                id: params.messageId,
                channelId,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!message || message.deleted) {
            return new Response("Message not found", { status: 404 });
        }

        const isMessageOwner = message.memberId === member.id;

        if (!isMessageOwner) {
            return new Response("Unauthorized", { status: 401 });
        }

        const updatedMessage = await db.message.update({
            where: {
                id: params.messageId,
            },
            data: {
                content,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        await pusher.trigger(
            generateChannelKeyMessageUpdate(channelId),
            PusherEvent.MESSAGE,
            updatedMessage
        );

        return Response.json(updatedMessage);
    } catch (error) {
        console.error("[MESSAGES_PATCH]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { messageId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        const serverId = qs.parseUrl(req.url).query.serverId as string;
        const channelId = qs.parseUrl(req.url).query.channelId as string;

        if (!serverId) {
            return new Response("Server ID is required", { status: 400 });
        }

        if (!channelId) {
            return new Response("Channel ID is required", { status: 400 });
        }

        const server = await db.server.findUnique({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (!server) {
            return new Response("Server not found", { status: 404 });
        }

        const channel = await db.channel.findUnique({
            where: {
                id: channelId,
                serverId: serverId,
            },
        });

        if (!channel) {
            return new Response("Channel not found", { status: 404 });
        }

        const member = server.members.find(
            (member) => member.profileId === profile.id
        );

        if (!member) {
            return new Response("Member not found", { status: 404 });
        }

        const message = await db.message.findUnique({
            where: {
                id: params.messageId,
                channelId,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!message || message.deleted) {
            return new Response("Message not found", { status: 404 });
        }

        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return new Response("Unauthorized", { status: 401 });
        }

        const updatedMessage = await db.message.update({
            where: {
                id: params.messageId,
            },
            data: {
                fileUrl: null,
                content: "This message has been deleted",
                deleted: true,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        await pusher.trigger(
            generateChannelKeyMessageUpdate(channelId),
            PusherEvent.MESSAGE,
            updatedMessage
        );

        return Response.json(updatedMessage);
    } catch (error) {
        console.error("[MESSAGES_DELETE]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
