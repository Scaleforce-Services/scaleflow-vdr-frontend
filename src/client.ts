import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';


Amplify.configure(config);

export const client = generateClient<Schema>({ authMode: "userPool" });
export const { useAIConversation, useAIGeneration } = createAIHooks(client);

export type Conversation = Schema["chat"]["type"];