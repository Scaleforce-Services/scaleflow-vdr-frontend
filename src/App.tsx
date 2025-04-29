import React from 'react';
import { Button, Flex, Heading, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react-storage/styles.css';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from '@aws-amplify/auth';
import CustomStorageBrowser from './components/CustomStorageBrowser';
import { StorageBrowser } from './components/StorageBrowser';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';

const BUCKET_NAME = 'scaleforce-app-vdr-storage';

function App() {
  const [tenant, setTenant] = React.useState<string>('');
  const { user, signOut, authStatus } = useAuthenticator((context) => [context.user]);

  const setUserTenant = async () => {
    const session = await fetchAuthSession();
    const groups = session?.tokens?.accessToken?.payload['cognito:groups'] || [];
    const group = (groups as string[])[0];
    if (!group) {
      console.warn('User is not part of any group');
    }
    setTenant(group);
  };

  React.useEffect(() => {
    if (user) setUserTenant();
  }, [user]);

  const Loading = () => <p>Loading VDR...</p>;

  if (authStatus === 'configuring') return <Loading />;
  if (authStatus === 'authenticated' && tenant) {
    return (
      <Flex direction="column" height="100vh" overflow="hidden" padding="2rem">
        <View className="header" shrink={0}>
          <Heading level={3} margin={'0'}>
            Welcome to Scaleforce VDR
          </Heading>
          <Button onClick={signOut}>Sign out</Button>
        </View>

        <View overflow='hidden' grow={1} paddingTop='2rem'>
          <StorageBrowser.Provider
            defaultValue={{
              location: {
                path: tenant === 'admin' ? '' : `${tenant}/`,
                bucket: BUCKET_NAME,
                permissions: ['get', 'list', 'write', 'delete'],
                prefix: '',
              },
            }}
          >
            <CustomStorageBrowser tenant={tenant} />
          </StorageBrowser.Provider>
        </View>
        {/* <FileUploader
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
        /> */}
       <ToastContainer position='bottom-center' />
      </Flex>
    );
  }

  if (authStatus === 'unauthenticated') {
   return <Login />
  }
  return <Loading />;
}

export default App;
