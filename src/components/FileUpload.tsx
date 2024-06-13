"use client";

import Image from "next/image";
import { File, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import { ExtractProps } from "@/lib/utils";

import "@uploadthing/react/styles.css";

type FileUploadProps = ExtractProps<typeof UploadDropzone> & {
    onChange: (url: string) => void;
    value: string;
};

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
    const fileType = value.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                    src={value}
                    alt="upload"
                    className="rounded-full bg-zinc-100"
                    width={100}
                    height={100}
                />
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    if (value && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-200 dark:text-indigo-400 hover:underline"
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res[0].url);
            }}
            onUploadError={(error) => {
                console.error("[FILE_UPLOAD]", error);
            }}
        />
    );
};

export default FileUpload;
