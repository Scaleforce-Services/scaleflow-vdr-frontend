/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Heading, View } from '@aws-amplify/ui-react';
import { StorageBrowser, useAction, useView } from '../StorageBrowser';
import React from 'react';
export const BUCKET_NAME = 'scaleforce-app-vdr-storage';

interface Props {
  tenant: string;
}

const UploadView = StorageBrowser.UploadView;
const DeleteView = StorageBrowser.DeleteView

function StorageBrowserViewRenderer({ tenant }: Props) {
  const state: any = useView('LocationDetail');
  const fileDataItems = state.fileDataItems;

  const [, handleCopy] = useAction('copyPath', { items: fileDataItems });

  if (state.actionType === 'delete') {
    return <DeleteView />;
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
            <Button disabled={fileDataItems?.length !== 1} onClick={() => handleCopy()}>
              Copy Path
            </Button>
            <StorageBrowser.LocationDetailView.Refresh />
            <StorageBrowser.LocationDetailView.ActionsList />
          </Flex>
        </Flex>

        <View>
          <StorageBrowser.LocationDetailView.Message />
        </View>

        <View overflow="auto">
          <StorageBrowser.LocationDetailView.DropZone>
            <StorageBrowser.LocationDetailView.LocationItemsTable />
          </StorageBrowser.LocationDetailView.DropZone>
        </View>
      </Flex>
    </StorageBrowser.LocationDetailView.Provider>
  );
}



export default function CustomStorageBrowser({tenant}: {tenant: string}){


  const [currentLocation] = React.useState<string>(tenant === 'admin' ? '' : `${tenant}/`)
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
    <StorageBrowserViewRenderer tenant={tenant}  />
  </StorageBrowser.Provider>
  )
}