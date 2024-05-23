"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { UserButtonProps } from "@clerk/types";

const UserButton = ({ ...props }: UserButtonProps) => {
    const { resolvedTheme } = useTheme();

    return (
        <ClerkUserButton
            userProfileProps={{
                appearance: {
                    baseTheme: resolvedTheme === "dark" ? dark : undefined,
                },
            }}
            appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}
            {...props}
        />
    );
};

export default UserButton;
