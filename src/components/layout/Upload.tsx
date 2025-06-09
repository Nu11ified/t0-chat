'use client';

import { UploadDropzone } from "@/utils/uploadthing";

type UploadFileResponse = {
  url: string;
  key: string;
  name: string;
  size: number;
}[];

export function Upload() {
  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={(res?: UploadFileResponse) => {
        // Do something with the response
        console.log("Files: ", res);
        alert("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
} 