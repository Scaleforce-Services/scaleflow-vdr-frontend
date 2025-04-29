import { Button, Flex, Heading, Image, Text } from '@aws-amplify/ui-react';
import { signInWithRedirect } from '@aws-amplify/auth';
import BGImage from '../assets/bg.png';
import React from 'react';

export default function Login() {
  React.useEffect(() => {
    window.setTimeout(() => signInWithRedirect(), 1000);
  }, []);

  return (
    <Flex
      direction="column"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(90deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)',
      }}
      height="100%"
    >
      <Heading level={3} color="white">
        Welcome to Scaleforce VDR
      </Heading>
      <Text color="white">Redirecting to login...</Text>
      <Button type="button" backgroundColor="white" onClick={() => signInWithRedirect()}>
        Login
      </Button>

      <Image
        src={BGImage}
        alt="Background"
        width={100}
        height={100}
        borderRadius="50%"
        position="absolute"
        bottom="10px"
        right="10px"
      />
    </Flex>
  );
}
