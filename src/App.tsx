import React from 'react';
import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
  StorageBrowserEventValue,
} from '@aws-amplify/ui-react-storage/browser';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import { Button, Heading, Text, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react-storage/styles.css';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession, signInWithRedirect } from '@aws-amplify/auth';


Amplify.configure(config);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
  components:{
    Navigation: ({items, ...props})=>{
      const filteredLinks = items.filter(item=>item.name !== 'Home')
      const linkElements =  filteredLinks.map((item, index)=><>
      <Button variation='link' disabled={item.isCurrent} onClick={item.onNavigate} padding={'0 10px'} {...props}>
        {item.name}
      </Button> 
      {index !== filteredLinks.length - 1 && '|'} 
      </>);
      return <View display={'flex'} alignSelf={'center'} >{linkElements}</View>
    },
  },
  // actions: {
  //   custom: {
  //     copyFileLocation: {
  //       handler: (...args)=>{
  //         console.log(args)
  //         return {
  //          result: Promise.resolve({
  //           status: 'COMPLETE',
  //           value: 'hello'
  //         })
  //         }
  //       },
  //       viewName: 'CopyFileLocationView',
  //       actionListItem: {
  //         label: 'Copy file path',
  //         icon: 'info',
  //         disable: () => false,
  //         hide: () => false
  //       }
  //     }
  //   }
  // }
});

const BUCKET_NAME = 'scaleforce-app-vdr-storage';

function App() {
  const [tenant, setTenant] = React.useState<string>('');
  // const [folder, setFolder] = React.useState<string>('');
  const { user, signOut, authStatus } = useAuthenticator((context) => [context.user]);
  const handleValueChange = (value: StorageBrowserEventValue) => {
    console.debug(value);
  };

  const setUserTenant = async () => {
    const session = await fetchAuthSession();
    const groups = session?.tokens?.accessToken?.payload['cognito:groups'] || [];
    const group = (groups as string[])[0];
    if (!group) {
      console.warn('User is not part of any group');
    }
    setTenant(group === 'admin' ? '' : group);
  };

  React.useEffect(() => {
    if(user) setUserTenant()
  }, [user]);


  const Loading = ()=> <p>Loading VDR...</p>

  if(authStatus === 'configuring') return <Loading />
  if (authStatus === 'authenticated' && tenant) {
    return (
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
              path: tenant === 'admin' ? '' :  `${tenant}/`,
              bucket: BUCKET_NAME,
              permissions: ['get', 'list', 'write', 'delete'],
              prefix: '',
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
      </>
    );
  } 
  if(authStatus === 'unauthenticated') {
    return (
      <button type="button" onClick={() => signInWithRedirect()}>
        Login
      </button>
    );
  }
  return <Loading />
}

export default App;
