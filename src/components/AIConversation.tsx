import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from '../client';

export default function AiConversation() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');
  // 'chat' is based on the key for the conversation route in your schema.
  console.log(messages)
  return (
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
      />
  );
}