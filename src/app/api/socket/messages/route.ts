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

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId,
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
            generateChannelKeyMessage(channelId),
            PusherEvent.MESSAGE,
            message
        );

        return Response.json(message);
    } catch (error) {
        console.error("[MESSAGES_POST]", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
