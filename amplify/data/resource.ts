import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
    // This will add a new conversation route to your Amplify Data backend.
    chat: a.conversation({
      aiModel: a.ai.model('Claude 3.5 Haiku'),
      systemPrompt: 'You are a helpful assistant',
    })
    .authorization((allow) => allow.owner()),
  
    // This adds a new generation route to your Amplify Data backend.
    // generateRecipe: a.generation({
    //   aiModel: a.ai.model('Claude 3.5 Haiku'),
    //   systemPrompt: 'You are a helpful assistant that generates recipes.',
    // })
    // .arguments({
    //   description: a.string(),
    // })
    // .returns(
    //   a.customType({
    //     name: a.string(),
    //     ingredients: a.string().array(),
    //     instructions: a.string(),
    //   })
    // )
    // .authorization((allow) => allow.authenticated()),
  });
  

  export type Schema = ClientSchema<typeof schema>;

  export const data = defineData({
    schema,
    authorizationModes: {
      defaultAuthorizationMode: "userPool",
    },
  });