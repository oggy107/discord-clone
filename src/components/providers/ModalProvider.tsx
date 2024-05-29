"use client";

import { useEffect, useState } from "react";

import CreateServerModal from "@/components/modals/createServerModal";
import EditServerModal from "@/components/modals/editServerModal";
import InviteModal from "@/components/modals/InviteModal";
import MembersModal from "@/components/modals/membersModal";
import CreateChannelModal from "@/components/modals/createChannelModal";

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
        </>
    );
};

export default ModalProvider;
