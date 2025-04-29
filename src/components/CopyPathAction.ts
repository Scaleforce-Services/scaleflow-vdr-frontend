/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionHandler } from '@aws-amplify/ui-react-storage/browser';
import { toast } from 'react-toastify';

type GenerateLink = ActionHandler<{ items: any[]; bucket: string }>;

export const copyPathHandler: GenerateLink = ({
  data,
}: {
  data: { key: string};
  config?: any;
  options?: any;
}) => {
  const handleCopyPath = async () => {
    try {
      const key = data.key
      const filePath = `s3://${key}`
      await navigator.clipboard.writeText(filePath);
      const result = {
        status: 'COMPLETE' as const,
        value: { path: filePath },
        message: 'Path copied to clipboard'
      };
      toast.success('Path copied to clipboard');
      return result;
    } catch (error) {
      const message = 'Unable to copy file path';
      return {
        status: 'FAILED' as const,
        message,
        error: error as Error,
      };
    }
  };

  return { result: handleCopyPath() };
};
