import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

import ModalProvider from "@/components/providers/ModalProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { PusherProvider } from "@/components/providers/PusherProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Discord clone",
    description: "A simple discord clone",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={cn(inter.className, "dark:bg-[#313338]")}>
                    <ThemeProvider>
                        <PusherProvider>
                            <ModalProvider />
                            <QueryProvider>{children}</QueryProvider>
                        </PusherProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
