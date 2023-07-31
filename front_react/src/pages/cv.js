import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';

import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CvTable } from 'src/sections/cv/cv-table';
import { CvSearch } from 'src/sections/cv/cv-search';
import { applyPagination } from 'src/utils/apply-pagination';

const now = new Date();

const data = [
  
];

const useCv = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useCvIds = (cv) => {
  return useMemo(
    () => {
      return cv.map((cv) => cv.id);
    },
    [cv]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const cv = useCv(page, rowsPerPage);
  const cvIds = useCvIds(cv);
  const cvSelection = useSelection(cvIds);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );
  const handleImport = (selectedCvIds) => {
    selectedCvIds.forEach((cvId) => {
      const downloadUrl = `http://localhost:8085/file/download/${cvId}`;
      window.open(downloadUrl, '_blank');
    });
  };
  return (
    <>
      <Head>
        <title>
          Lister | CvTheque
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  CV Liste
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                <Button
                  color="inherit"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <ArrowDownOnSquareIcon />
                    </SvgIcon>
                  )}
                  onClick={handleImport}
                >
                  Télécharger 
                </Button>
                <Button
                color="inherit"
                startIcon={(
                  <SvgIcon fontSize="small">
                    <ArchiveBoxIcon />
                  </SvgIcon>
                )}
              >
                Delete
              </Button>
              
         
                </Stack>
              </Stack>
              <div>

              </div>
            </Stack>
            <CvSearch />
            <CvTable
              count={data.length}
              items={cv}
              onDeselectAll={cvSelection.handleDeselectAll}
              onDeselectOne={cvSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={cvSelection.handleSelectAll}
              onSelectOne={cvSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={cvSelection.selected}
              onImport={handleImport}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;