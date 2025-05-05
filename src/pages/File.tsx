import React from 'react';
import { getUrl } from 'aws-amplify/storage';
import { useNavigate, useParams } from 'react-router';
import { BUCKET_NAME } from '../components/CustomStorageBrowser';
import { Button, Flex, Heading, View, Text } from '@aws-amplify/ui-react';
import { FcDocument } from 'react-icons/fc';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

export default function File() {
  const { fileName } = useParams();
  const [fileLink, setFileLink] = React.useState('');
  const navigate = useNavigate();

  const getFileLink = (fileName: string) => {
    getUrl({
      path: fileName,
      options: {
        bucket: BUCKET_NAME,
      },
    })
      .then((result) => {
        setFileLink(result.url.toString());
      })
      .catch((error) => {
        console.error('Error getting file link:', error);
      });
  };

  React.useEffect(() => {
    if (fileName) {
      getFileLink(fileName);
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
        <FcDocument size={100} />
        <Heading level={5}>{trimmedFileName}</Heading>
        {fileLink && (
          <a href={fileLink} target="_blank" rel="noopener noreferrer">
            <h3>Click here to download the file</h3>
          </a>
        )}
        {!fileLink && <h3>Loading...</h3>}
      </Flex>
    </View>
  );
}
