import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { Box, Button, Container, Stack, SvgIcon,Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CvTable } from 'src/sections/cv/cv-table';
import { CvSearch } from 'src/sections/cv/cv-search';
import { applyPagination } from 'src/utils/apply-pagination';

const now = new Date();

const data = []; // Your CV data goes here

const useCv = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useCvIds = (cv) => {
  return useMemo(() => {
    return cv.map((cv) => cv.id);
  }, [cv]);
};

const Page = () => {
  const jwtToken = sessionStorage.getItem('jwt');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const cv = useCv(page, rowsPerPage);
  const cvIds = useCvIds(cv);
  const cvSelection = useSelection(cvIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleImport = (selectedCvIds) => {
    selectedCvIds.forEach((cvId) => {
      const downloadUrl = `http://localhost:8082/file/download/${cvId}`;
      axios
      .get(downloadUrl, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
        }, responseType: 'blob' })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.headers)
          const filename= response.headers['content-disposition'].split('filename=')[1].trim().replace(/"/g, '');
          console.log(filename);
          // Create a blob object from the response data
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          // window.open(url, '_blank');
          // window.URL.revokeObjectURL(url);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.setAttribute('download', filename);
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        } else {
          console.log('Error:', response.status, response.statusText);
        }
      })
    });
  };

  return (
    <>
      <Head>
        <title>Lister | CvTheque</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">CV Liste</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="primary"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                    onClick={() => handleImport(cvSelection.selected)}
                  >
                    Télécharger
                  </Button>
                  
                  {/* <Button color="primary" startIcon={<ArchiveBoxIcon />}>
                    Delete
                  </Button> */}
                </Stack>
              </Stack>
              <div></div>
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

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;