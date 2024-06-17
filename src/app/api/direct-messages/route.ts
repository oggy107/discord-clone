import { DirectMessage } from "@prisma/client";
import qs from "query-string";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }

        const cursor = qs.parseUrl(req.url).query.cursor as string;
        const conversationId = qs.parseUrl(req.url).query
            .conversationId as string;

        if (!conversationId) {
            return new Response("conversation ID is required", { status: 400 });
        }

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                where: {
                    conversationId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        let nextCursor = null;

        if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[messages.length - 1].id;
        }

        return Response.json({
            items: messages,
            nextCursor,
        });
    } catch (error) {
        console.error("[DIRECT_MESSAGES_GET]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
