import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    src: string;
    className?: string;
}

const UserAvatar = ({ src, className }: UserAvatarProps) => {
    return (
        <Avatar asChild>
            <AvatarImage
                src={src}
                alt="avatar"
                className={cn("h-7 w-7 md:h-9 md:w-9", className)}
                sizes=""
            />
        </Avatar>
    );
};

export default UserAvatar;
