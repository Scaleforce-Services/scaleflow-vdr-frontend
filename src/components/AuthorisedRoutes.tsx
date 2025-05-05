import { Button, Flex, Heading, useAuthenticator, View } from '@aws-amplify/ui-react';
import { Outlet, useNavigate } from 'react-router';

export default function AuthorisedRoutes() {
  const { authStatus, signOut } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  if (authStatus === 'unauthenticated') navigate('/');
  if (authStatus === 'configuring') return <div>Loading...</div>;
  return (
    <Flex direction="column" height="100vh" overflow="hidden" padding="2rem">
      <View className="header" shrink={0}>
        <Heading level={3} margin={'0'}>
          Welcome to Scaleforce VDR
        </Heading>
        <Button onClick={signOut}>Sign out</Button>
      </View>
      <Outlet />
    </Flex>
  );
}
