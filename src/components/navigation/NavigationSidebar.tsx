import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import NavigationAction from "@/components/navigation/NavigationAction";
import NavigationItem from "@/components/navigation/NavigationItem";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import ThemeToggle from "@/components/ThemeToggle";
import UserButton from "@/components/auth/UserButton";

const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    return (
        <nav className="space-y-4 py-3 flex flex-col items-center h-full text-primary w-full bg-[#e3e5e8] dark:bg-[#1e1f22]">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <NavigationItem
                        key={server.id}
                        id={server.id}
                        name={server.name}
                        imageUrl={server.imageUrl}
                    />
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ThemeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: { avatarBox: "h-[48px] w-[48px]" },
                    }}
                />
            </div>
        </nav>
    );
};

export default NavigationSidebar;
