import React from 'react';
import { useAuthenticator, View, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react-storage/styles.css';
import '../App.css';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from '@aws-amplify/auth';
import CustomStorageBrowser from '../components/CustomStorageBrowser';
import { ToastContainer } from 'react-toastify';
// import FileUpload from './components/FileUpload';
// import AiConversation from './components/AIConversation';
export const BASE_URL = 'https://vdr.scaleforce.app';

function DataRoom() {
  const [tenant, setTenant] = React.useState<string>('');
  const { user } = useAuthenticator((context) => [context.user]);

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

  return (
    <View overflow="hidden" grow={1} paddingTop="2rem">
      {tenant ? (
        <>
          <CustomStorageBrowser tenant={tenant} />
          {/*  <FileUpload tenant={tenant} />  */}
          <ToastContainer position="bottom-center" />
          {/* <AiConversation /></> */}
        </>
      ) : (
        <Text>You do not have access to a workspace. Please contact support to set up access.</Text>
      )}
    </View>
  );
}

export default DataRoom;
