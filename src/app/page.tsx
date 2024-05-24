import UserButton from "@/components/auth/UserButton";
import ThemeToggle from "@/components/ThemeToggle";
import { db } from "@/lib/db";

import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
    const profile = await initialProfile();

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (server) {
        redirect(`/servers/${server.id}`);
    }

    return <div>Create A Server</div>;
};

export default SetupPage;
