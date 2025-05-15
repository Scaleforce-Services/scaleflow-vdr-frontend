/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useView } from '../StorageBrowser';
import DataTable from 'react-data-table-component';
import { Button, Flex, Text } from '@aws-amplify/ui-react';
import { FcFolder } from 'react-icons/fc';
import { FcFile } from 'react-icons/fc';
import { GrDownload } from "react-icons/gr";
import { format } from 'date-fns/format';
import { BASE_URL } from '../pages/DataRoom';
import { toast } from 'react-toastify';

type Row = {
  key: string;
  type: string;
  id: string;
  lastModified: Date;
};

type HandleRowSelectEvent = {
  allSelected: boolean;
  selectedCount: number;
  selectedRows: Row[];
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const extractFileNameFromKey = (key: string) => {
  const parts = key.split('/');
  if (key.endsWith('/')) {
    return parts[parts.length - 2];
  } else {
    return parts.pop();
  }
};

export default function CustomLocationItemsTable() {
  // const [, handleAction] = useAction('copyPath');

  const state: any = useView('LocationDetail');
  const pageItems = state.pageItems;

  const columns = React.useMemo(
    () => [
      {
        name: 'Title',
        cell: (row: Row) => {
          if (row.type === 'FOLDER') {
            return (
              <Button
                variation="link"
                textAlign="left"
                padding="0 0.25rem"
                onClick={() => handleFolderClick(row)}
                size="small"
              >
                <FcFolder size={20} style={{flexShrink: 0}} />
                &nbsp;{extractFileNameFromKey(row.key)}
              </Button>
            );
          } else
            return (
              <Flex
                display="flex"
                alignItems="center"
                padding="0 0.25rem"
                textAlign="left"
                width="100%"
              >
                <FcFile size={20} style={{ flexShrink: 0 }} />
                <Text whiteSpace="nowrap" isTruncated={true}>
                  {extractFileNameFromKey(row.key)}
                </Text>
              </Flex>
            );
        },
      },
      {
        name: 'Type',
        selector: (row: Row) => capitalize(row.type),
        sortable: true,
      },
      {
        name: 'Last modified',
        selector: (row: Row) => {
          if (row.type !== 'FILE') return '';
          const date = row.lastModified;
          return format(date, 'dd MMM, yyyy HH:mm:ss');
        },
        sortable: true,
      },
      {
        name: '',
        cell: (row: Row) => {
          if (row.type !== 'FILE') return '';
          return (
            <Button
              variation="primary"
              textAlign="left"
              padding="0 0.5rem"
              onClick={async () => {
                const key = row.key;
                const filePath = `${BASE_URL}/file/${encodeURIComponent(key)}`;
                await navigator.clipboard.writeText(filePath);
                toast.success('File URL copied to clipboard');
              }}
              size="small"
            >
              Copy link
            </Button>
          );
        },
      },
      {
        name: '',
        cell: (row: Row) => {
          if (row.type !== 'FILE') return '';
          return (
            <Button
              variation="primary"
              textAlign="left"
              padding="0 0.5rem"
              onClick={async () => {
                await state.onDownload(row)
              }}
              size="small"
            >
              <Flex alignItems="center" justifyContent="center" gap="0.5rem">
                <GrDownload size={14} color='white' stroke='white' fill='white'/><Text color="white">Download</Text>
              </Flex>
            </Button>
          );
        },
      },
    ],
    []
  );

  console.log(state);

  const handleFolderClick = (row: Row) => {
    const location = state.location.current;
    state.onNavigate(location, row.key);
  };

  const handleRowSelected = (event: HandleRowSelectEvent) => {
    const selectedKeys = new Set(event.selectedRows.map((row) => row.key));

    pageItems.forEach((row: Row) => {
      if (row.type !== 'FOLDER') {
        const isSelected = selectedKeys.has(row.key);
        state.onSelect(!isSelected, row);
      }
    });
  };

  return (
    <DataTable
      columns={columns}
      data={pageItems}
      selectableRows
      onSelectedRowsChange={(event) => handleRowSelected(event)}
      selectableRowDisabled={(row) => row.type === 'FOLDER'}
    />
  );
}
