/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Heading, View } from '@aws-amplify/ui-react';
import { StorageBrowser, useView } from '../StorageBrowser';
import React from 'react';
import CustomLocationItemsTable from './CustomLocationItemsTable';

export const BUCKET_NAME = 'scaleforce-app-vdr-storage';

interface Props {
  tenant: string;
}

const UploadView = StorageBrowser.UploadView;

function StorageBrowserViewRenderer({ tenant }: Props) {
  const state: any = useView('LocationDetail');


  /**
   * This is a workaround to handle the action exit event from the delete view
   * and trigger the onSelect function to de-select all items otherwise the table shows no items selected
   * but the delete button is still active and navigating to it shows the items that were previously selected
   * This is needed because the delete view does not trigger the onSelect function
   * when the delete action is exited. 
   */ 
  const handleActionExit = () => {
    state.fileDataItems.forEach((item:any)=>{
      state.onSelect(true, item)
    })
    state.onActionSelect('');
  }

  if (state.actionType === 'delete') {
    return <StorageBrowser.DeleteView onActionExit={handleActionExit}/>;
  }

  if (state.actionType === 'upload') {
    return <UploadView />;
  }

  return (
    <StorageBrowser.LocationDetailView.Provider {...state}>
      <Flex direction="column" height="100%">
        {tenant === 'admin' && <StorageBrowser.LocationDetailView.Navigation />}
        <Heading level={4} textAlign="left">
          {state.location.path}
        </Heading>
        <Flex direction="row" justifyContent="space-between" marginTop="1rem">
          <Flex direction="row">
            <StorageBrowser.LocationDetailView.Search />
            <StorageBrowser.LocationDetailView.SearchSubfoldersToggle />
            <StorageBrowser.LocationDetailView.LoadingIndicator />
          </Flex>
          <StorageBrowser.LocationDetailView.Pagination />
          <Flex direction="row">
            <StorageBrowser.LocationDetailView.Refresh />
            <StorageBrowser.LocationDetailView.ActionsList />
          </Flex>
        </Flex>

        {/* <View>
          <StorageBrowser.LocationDetailView.Message />
        </View> */}

        <View overflow="auto">
          <StorageBrowser.LocationDetailView.DropZone>
            <CustomLocationItemsTable />
          </StorageBrowser.LocationDetailView.DropZone>
        </View>
      </Flex>
    </StorageBrowser.LocationDetailView.Provider>
  );
}

export default function CustomStorageBrowser({ tenant }: { tenant: string }) {
  const [currentLocation] = React.useState<string>(tenant === 'admin' ? '' : `${tenant}/`);
  return (
    <StorageBrowser.Provider
      defaultValue={{
        location: {
          path: currentLocation,
          bucket: BUCKET_NAME,
          permissions: ['get', 'list', 'write', 'delete'],
          prefix: '',
        },
      }}
    >
      <StorageBrowserViewRenderer tenant={tenant} />
    </StorageBrowser.Provider>
  );
}
