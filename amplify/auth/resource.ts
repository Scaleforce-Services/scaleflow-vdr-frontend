import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders:{
        callbackUrls: ['http://localhost:5173', 'https://vdr.scaleforce.app'],
        logoutUrls: ['http://localhost:5173', 'https://vdr.scaleforce.app'],
        scopes: ['OPENID', 'PROFILE', 'EMAIL'],
    },
  },
  groups: ['admin', 'meet5', 'lleverage', 'nofence', 'dev-dolly'],
});