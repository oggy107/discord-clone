import UserButton from "./components/UserButton";

export default function Home() {
    return (
        <main>
            <UserButton afterSignOutUrl="/" />
        </main>
    );
}
