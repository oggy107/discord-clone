import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

import ModalProvider from "@/components/providers/ModalProvider";
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
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        disableTransitionOnChange
                    >
                        <PusherProvider>
                            <ModalProvider />
                            {children}
                        </PusherProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
