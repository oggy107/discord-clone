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
    { params }: { params: { directMessageId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { content } = (await req.json()) as {
            content: string;
        };

        const conversationId = qs.parseUrl(req.url).query
            .conversationId as string;

        if (!conversationId) {
            return new Response("conversation ID is required", { status: 400 });
        }

        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        },
                    },
                    {
                        memberTwo: {
                            profileId: profile.id,
                        },
                    },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!conversation) {
            return new Response("Conversation not found", { status: 404 });
        }

        const member =
            conversation.memberOne.profileId === profile.id
                ? conversation.memberOne
                : conversation.memberTwo;

        if (!member) {
            return new Response("Member not found", { status: 404 });
        }

        const directMessage = await db.directMessage.findUnique({
            where: {
                id: params.directMessageId,
                conversationId,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!directMessage || directMessage.deleted) {
            return new Response("Message not found", { status: 404 });
        }

        const isMessageOwner = directMessage.memberId === member.id;

        if (!isMessageOwner) {
            return new Response("Unauthorized", { status: 401 });
        }

        const updatedMessage = await db.directMessage.update({
            where: {
                id: params.directMessageId,
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
            generateChannelKeyMessageUpdate(conversationId),
            PusherEvent.MESSAGE,
            updatedMessage
        );

        return Response.json(updatedMessage);
    } catch (error) {
        console.error("[DIRECT_MESSAGES_PATCH]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { directMessageId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        const conversationId = qs.parseUrl(req.url).query
            .conversationId as string;

        if (!conversationId) {
            return new Response("conversation ID is required", { status: 400 });
        }

        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        },
                    },
                    {
                        memberTwo: {
                            profileId: profile.id,
                        },
                    },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!conversation) {
            return new Response("Conversation not found", { status: 404 });
        }

        const member =
            conversation.memberOne.profileId === profile.id
                ? conversation.memberOne
                : conversation.memberTwo;

        if (!member) {
            return new Response("Member not found", { status: 404 });
        }

        const directMessage = await db.directMessage.findUnique({
            where: {
                id: params.directMessageId,
                conversationId,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!directMessage || directMessage.deleted) {
            return new Response("Message not found", { status: 404 });
        }

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return new Response("Unauthorized", { status: 401 });
        }

        const updatedMessage = await db.directMessage.update({
            where: {
                id: params.directMessageId,
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
            generateChannelKeyMessageUpdate(conversationId),
            PusherEvent.MESSAGE,
            updatedMessage
        );

        return Response.json(updatedMessage);
    } catch (error) {
        console.error("[DIRECT_MESSAGES_DELETE]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
