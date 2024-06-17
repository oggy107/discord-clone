import qs from "query-string";

import { getPusherInstance } from "@/lib/pusher";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { PusherEvent } from "@/types";
import { generateChannelKeyMessage } from "@/lib/utils";

const pusher = getPusherInstance();

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { content, fileUrl } = (await req.json()) as {
            content: string;
            fileUrl: string;
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

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId,
                memberId: member.id,
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
            generateChannelKeyMessage(conversationId),
            PusherEvent.MESSAGE,
            message
        );

        return Response.json(message);
    } catch (error) {
        console.error("[DIRECT_MESSAGES_POST]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
