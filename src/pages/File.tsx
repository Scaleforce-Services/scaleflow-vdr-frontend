import React from 'react';
import { downloadData, getProperties } from 'aws-amplify/storage';
import { useNavigate, useParams } from 'react-router';
import { Button, Flex, Heading, View, Text, Loader } from '@aws-amplify/ui-react';
import { FcDocument } from 'react-icons/fc';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { TbError404 } from 'react-icons/tb';

export default function File() {
  const { fileName } = useParams();
  const navigate = useNavigate();
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [isDownloading, setDownloading] = React.useState(false);
  const downloadProgressRef = React.useRef<SVGSVGElement>(null);

  const downloadFile = async (fileName: string | undefined) => {
    if (!fileName) return;
    setDownloading(true);
    const progressBarRef = downloadProgressRef.current?.querySelector('svg g line:nth-child(2)');
    progressBarRef?.setAttribute('style', 'stroke: var(--amplify-colors-green-60)');
    try {
      // Download a file from S3 bucket
      const data = await downloadData({
        path: fileName,
        options: {
          onProgress: (progress) => {
            if (!progress.totalBytes) return;
            const completionRate = Math.round(
              (progress.transferredBytes / progress.totalBytes) * 100
            );
            progressBarRef?.setAttribute('x2', `${completionRate}%`);
          },
        },
      }).result;

      // Get blob data from the response
      const blob = await data.body.blob();

      //Create an object url
      const fileUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName.split('/').pop() || 'download';
      document.body.appendChild(link);

      // Trigger the download
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.debug('Error downloading file:', error);
    } finally {
      setDownloading(false);
    }
  };

  const checkIfFileExists = async (fileName: string) => {
    setLoading(true);
    try {
      await getProperties({
        path: fileName,
        options: {},
      });
    } catch (error) {
      console.debug(error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (fileName) {
      checkIfFileExists(fileName);
    }
  }, [fileName]);

  const trimmedFileName = fileName && fileName.split('/').pop();

  return (
    <View>
      <Button variation="link" onClick={() => navigate('/data-room')}>
        <BsFillArrowLeftCircleFill size={20} /> &nbsp;
        <Text>Back to files</Text>
      </Button>
      <Flex direction="column" alignItems="center" justifyContent="center" height="100%">
        {isLoading ? (
          <>
            <Loader size="large" />
            <Text>Loading...</Text>
          </>
        ) : isError ? (
          <>
            <Flex
              border="4px solid red"
              borderRadius="100%"
              padding="0.5rem"
              width="9rem"
              height="9rem"
              alignItems="center"
              justifyContent="center"
            >
              <TbError404 size={100} color="red" />
            </Flex>
            <Heading level={6} color="red.50">
              File not found
            </Heading>
            <Heading level={5}>{trimmedFileName}</Heading>
          </>
        ) : (
          <>
            <FcDocument size={100} />
            <Heading level={5}>{trimmedFileName}</Heading>

            <Button variation="link" onClick={() => downloadFile(fileName)}>
              Click here to download the file
            </Button>

              <Loader
                size="large"
                variation="linear"
                isDeterminate={true}
                percentage={0}
                ref={downloadProgressRef}
                isPercentageTextHidden={true}
                width="200px"
                opacity={isDownloading ? 1 : 0}
              />
          </>
        )}
      </Flex>
    </View>
  );
}
