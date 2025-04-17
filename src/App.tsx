import React from 'react';
import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
  StorageBrowserEventValue,
} from '@aws-amplify/ui-react-storage/browser';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import { Authenticator, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react-storage/styles.css';
import './App.css';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(config);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

function App() {
  const [currentFolder, setCurrentFolder] = React.useState<string>('public/');

  const handleValueChange = (value: StorageBrowserEventValue) => {
    setCurrentFolder(() => {
      if (value.location?.path === undefined) return 'public/';
      return value.location?.path;
    });
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <div className="header">
            <h1>{`Hello ${user?.username}`}</h1>
            <Button onClick={signOut}>Sign out</Button>
          </div>
          <StorageBrowser
            onValueChange={handleValueChange}
            displayText={{
              LocationsView: {
                searchPlaceholder: 'Search files and folders',
                // Some display texts are a string
                title: 'Select a location',
                // Some are a function that return a string
                getPermissionName: (permissions: string[]) => permissions.join('/'),
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
            path={currentFolder}
            maxFileCount={10}
            isResumable
          />
        </>
      )}
    </Authenticator>
  );
}

export default App;
