"use client";

import { useEffect, useState } from "react";

import CreateServerModal from "@/components/modals/createServerModal";
import EditServerModal from "@/components/modals/editServerModal";
import InviteModal from "@/components/modals/InviteModal";
import MembersModal from "@/components/modals/membersModal";
import CreateChannelModal from "@/components/modals/createChannelModal";
import LeaveServerModal from "@/components/modals/leaveServerModal";
import DeleteServerModal from "@/components/modals/deleteServerModal";
import DeleteChannelModal from "@/components/modals/deleteChannelModal";
import EditChannelModal from "@/components/modals/editChannelModal";
import MessageFileModal from "@/components/modals/messageFileModal";
import DeleteMessageModal from "@/components/modals/deleteMessageModal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModal />
            <DeleteMessageModal />
        </>
    );
};

export default ModalProvider;
