import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import {
  BrowserRouter
} from "react-router";
import AppRoutes from './AppRoutes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Authenticator.Provider>
        <AppRoutes />
      </Authenticator.Provider>
    </BrowserRouter>
  </StrictMode>
);
