import { FileUploader } from "@aws-amplify/ui-react-storage";
import { BUCKET_NAME } from "./CustomStorageBrowser";

export default function FileUpload({tenant}: {tenant: string}) {
  return (
    <FileUploader
      acceptedFileTypes={[
        'image/*',
        'video/*',
        'audio/*',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-zip-compressed',
        '.csv',
        'text/plain',
        'text/markdown',
        '.txt',
        '.md',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.ppt',
        '.pptx',
      ]}
      path={`${tenant}/`}
      bucket={BUCKET_NAME}
      maxFileCount={10}
      isResumable
    />
  );
}
