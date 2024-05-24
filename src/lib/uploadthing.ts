import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";

// TODO: add functionality to delete server image
// import { UTApi } from "uploadthing/server";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
