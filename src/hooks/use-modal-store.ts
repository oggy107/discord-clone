import { create } from "zustand";

import { Channel, ChannelType, Server } from "@prisma/client";
import { ModalType } from "@/types";

interface ModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));

export default useModal;
