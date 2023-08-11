import React, { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography ,  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,Checkbox,} from '@mui/material';
import { useSelection } from 'src/sections/cv/cv-table';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CvSearch } from 'src/sections/cv/cv-search';
import { applyPagination } from 'src/utils/apply-pagination';

const Cv = () => {
  const jwtToken = sessionStorage.getItem('jwt');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchResults, setSearchResults] = useState([]);
  const cvSelection = useSelection([]);
  const [selectedCvs, setSelectedCvs] = useState([]); 

  const handleCheckboxChange = (cvId) => {
    setSelectedCvs((prevSelectedCvs) =>
      prevSelectedCvs.includes(cvId)
        ? prevSelectedCvs.filter((id) => id !== cvId)
        : [...prevSelectedCvs, cvId]
    );
  };

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleDownload = (fileId) => {
    const downloadUrl = `http://localhost:8082/file/download/${fileId}`;
    axios
      .get(downloadUrl, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
        }, responseType: 'blob' })
      .then((response) => {
        if (response.status === 200) {
          const fileName = response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.setAttribute('download', fileName);
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        } else {
          console.log('Error:', response.status, response.statusText);
        }
      })
  };

  const handleDownloadSelected = () => {
    if (selectedCvs.length === 0) {
      toast.error('Veuillez sélectionner au moins un CV pour le télécharger.', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      return;
    }
  
    selectedCvs.forEach((cvId) => {
      handleDownload(cvId);
    });
  };
  const handleViewMetadata = (cvId) =>{
    const selectedCv = cvs.find((cv)=> cv.id === cvId);
    setSelectedCvMetadata(selectedCv);
    setMetadataDialogOpen(true);
  };
  const handleCloseMetadataDialog = () => {
    setMetadataDialogOpen(false);
  };

  const cv = useMemo(() => {
    return applyPagination(searchResults, page, rowsPerPage);
  }, [searchResults, page, rowsPerPage]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
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
                    onClick={ handleDownloadSelected}
                  >
                    Télécharger
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <CvSearch onSearchResults={handleSearchResults} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Selectionner</TableCell> {/* Nouvelle colonne pour la checkbox */}
              <TableCell>Nom du CV</TableCell>
           
            </TableRow>
          </TableHead>
          <TableBody>
            {cv.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell>
                  {/* Utilisez la balise Checkbox de MUI */}
                  <Checkbox
                    checked={selectedCvs.includes(cv.id)}
                    onChange={() => handleCheckboxChange(cv.id)}
                  />
                </TableCell>
                <TableCell>{cv.name}</TableCell>
              
          
              </TableRow>
            ))}
          </TableBody>
        </Table>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Cv.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Cv;
