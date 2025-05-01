import { Button, Flex, View } from '@aws-amplify/ui-react';
import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
  defaultActionConfigs,
} from '@aws-amplify/ui-react-storage/browser';
import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import { copyPathHandler } from './components/CopyPathAction';

Amplify.configure(config);

export const { StorageBrowser, useView, useAction } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
  components: {
    Navigation: ({ items, ...props }) => {
      const filteredLinks = items.filter((item) => item.name !== 'Home');
      const linkElements = filteredLinks.map((item, index) => (
        <Flex direction="row" key={item.name} gap="4px">
          <Button
            variation="link"
            disabled={item.isCurrent}
            onClick={item.onNavigate}
            padding={'0 10px'}
            {...props}
          >
            {item.name}
          </Button>
          {index !== filteredLinks.length - 1 && <span>|</span>}
        </Flex>
      ));
      return (
        <View display={'flex'} alignSelf={'center'}>
          {linkElements}
        </View>
      );
    },
  },
  actions: {
    default: {
      copy: {
        ...defaultActionConfigs.copy,
        actionListItem: {
          ...defaultActionConfigs.copy.actionListItem,
          hide: () => true,
        },
      },
      createFolder: {
        ...defaultActionConfigs.createFolder,
        actionListItem: {
          ...defaultActionConfigs.createFolder.actionListItem,
          hide: () => true,
        },
      },
      upload: {
        ...defaultActionConfigs.upload,
      },
    },
    custom: {
      copyPath: {
        actionListItem: {
          icon: 'info',
          label: 'Copy File Path(s)',
          disable: (selected) => !selected?.length,
          hide: () => true,
        },
        handler: copyPathHandler,
        viewName: 'LocationDetailView',
      },
    },
  },
});

