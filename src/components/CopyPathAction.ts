/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionHandler } from '@aws-amplify/ui-react-storage/browser';
import { toast } from 'react-toastify';
import { BASE_URL } from '../App';

type CopyPathHandler = ActionHandler<{ items: any[]; bucket: string }>;

export const copyPathHandler: CopyPathHandler = ({
  data,
}: {
  data: { key: string};
  config?: any;
  options?: any;
}) => {
  const handleCopyPath = async () => {
    console.log('Copying path to clipboard', data);
    try {
      const key = data.key
      const filePath = `${BASE_URL}/file/${encodeURI(key)}`
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
