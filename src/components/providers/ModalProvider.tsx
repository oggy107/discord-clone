"use client";

import { useEffect, useState } from "react";

import CreateServerModal from "@/components/modals/createServerModal";
import EditServerModal from "@/components/modals/editServerModal";
import InviteModal from "@/components/modals/InviteModal";
import MembersModal from "@/components/modals/membersModal";

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
        </>
    );
};

export default ModalProvider;
