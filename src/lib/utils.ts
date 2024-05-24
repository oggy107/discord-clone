import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type ExtractProps<T> = T extends (props: infer P) => JSX.Element
    ? P
    : never;
