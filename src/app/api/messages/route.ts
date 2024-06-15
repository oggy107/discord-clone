import { Message } from "@prisma/client";
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
        const channelId = qs.parseUrl(req.url).query.channelId as string;

        if (!channelId) {
            return new Response("Channel ID is required", { status: 400 });
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId,
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
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                where: {
                    channelId,
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
        console.error("[MESSAGES_GET]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
