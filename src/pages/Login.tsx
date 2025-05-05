import { useAuthenticator } from '@aws-amplify/ui-react';
import LoginComponent from '../components/Login';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function Login() {
  const { authStatus } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/data-room');
    }
  }, [authStatus, navigate]);

  if (authStatus === 'configuring') return <Loading />;
  if (authStatus === 'unauthenticated') return <LoginComponent />;
}
