import React from 'react';
import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
  StorageBrowserEventValue,
} from '@aws-amplify/ui-react-storage/browser';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import { Authenticator, Button, Heading, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react-storage/styles.css';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';

Amplify.configure(config);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

const BUCKET_NAME = 'scaleforce-app-vdr-storage';

function App() {
  const [storageBrowserValue, setStorageBrowserValue] = React.useState<StorageBrowserEventValue | undefined>(undefined);
  const [tenant, setTenant] = React.useState<string>('');
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const handleValueChange = (value: StorageBrowserEventValue) => {
    setStorageBrowserValue(value);
  };

  console.log(storageBrowserValue)

  const getUserSession = async () => {
    const session = await fetchAuthSession();
    const groups = session?.tokens?.accessToken?.payload['cognito:groups'] || [];
    const group = (groups as string[])[0];
    if (!group) {
      console.warn('User is not part of any group');
    }
    setTenant(group === 'admin' ? '' : group);
    console.log('User session:', session);
    console.log('User groups:', groups);
  };

  React.useEffect(() => {
    getUserSession().then(() => setLoaded(true));
  }, []);

  if (!loaded) return <p>Loading...</p>;
  if (loaded) {
    return (
      <Authenticator>
        {({ signOut, user }) => (
          <>
            <div className="header p-2">
              <Heading level={3} margin={'0'}>
                Welcome to Scaleforce VDR
              </Heading>
              <Button onClick={signOut}>Sign out</Button>
            </div>
            <Text textAlign={'left'} padding={'0rem 0.75rem'}>
              {user?.signInDetails?.loginId}
            </Text>
            <StorageBrowser
              defaultValue={{
                location: {
                  path: '',
                  bucket: BUCKET_NAME,
                  permissions: ['get', 'list', 'write', 'delete'],
                  prefix: `${tenant}/`,
                },
              }}
              onValueChange={handleValueChange}
              displayText={{
                LocationsView: {
                  searchPlaceholder: 'Search files and folders',
                  // Some display texts are a string
                  title: 'Select a location',
                  // Some are a function that return a string
                  // getPermissionName: (permissions: string[]) => permissions.join('/'),
                },
              }}
            />
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
              ]}
              path={`${tenant}/`}
              bucket={BUCKET_NAME}
              
              maxFileCount={10}
              isResumable
            />
          </>
        )}
      </Authenticator>
    );
  }
}

export default App;
