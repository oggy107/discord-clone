"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import { ExtractProps } from "@/lib/utils";

import "@uploadthing/react/styles.css";

type FileUploadProps = ExtractProps<typeof UploadDropzone> & {
    onChange: (url: string) => void;
    value: string;
};

const FileUpload = (props: FileUploadProps) => {
    const fileType = props.value.split(".").pop();

    if (props.value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                    src={props.value}
                    alt="upload"
                    className="rounded-full bg-zinc-100"
                    width={100}
                    height={100}
                />
                <button
                    onClick={() => props.onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }
    return (
        <UploadDropzone
            {...props}
            onClientUploadComplete={(res) => {
                props.onChange(res[0].url);
            }}
            onUploadError={(error) => {
                console.error(error);
            }}
        />
    );
};

export default FileUpload;
