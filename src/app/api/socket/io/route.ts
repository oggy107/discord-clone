import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
    api: {
        bodyParser: false,
    },
};

export const GET = (req: NextApiRequest, resp: NextApiResponseServerIo) => {
    if (!resp.socket.server.io) {
        const httpServer: NetServer = resp.socket.server as any;
        const io = new ServerIo(httpServer, {
            path: "api/socket/io",
            addTrailingSlash: false,
            cors: {
                origin: "*",
            },
        });
        resp.socket.server.io = io;
    }

    resp.end();
};

const ioHandler = (req: NextApiRequest, resp: NextApiResponseServerIo) => {
    if (!resp.socket.server.io) {
        const httpServer: NetServer = resp.socket.server as any;
        const io = new ServerIo(httpServer, {
            path: "api/socket/io",
            addTrailingSlash: false,
            cors: {
                origin: "*",
            },
        });
        resp.socket.server.io = io;
    }

    resp.end();
};

export default ioHandler;
