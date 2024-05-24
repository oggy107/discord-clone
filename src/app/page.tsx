import UserButton from "@/components/auth/UserButton";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
    return (
        <main>
            <UserButton afterSignOutUrl="/" />
            <ThemeToggle />
        </main>
    );
}
