import axios from 'axios';
import { useEffect, useState } from 'react'; 
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';
import Head from 'next/head';

export const Listcv = (props) => {
  const { sx } = props;

  const [cvs, setCvs] = useState([]); // State to store the list of CVs
  const jwtToken = sessionStorage.getItem('jwt');


  useEffect(() => {
    const apiUrl = 'http://localhost:8082/file/list';
    
    axios
      .get(apiUrl, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
        }})
      .then((response) => {
        console.log('Données CV récupérées :', response.data); // Vérifiez les données récupérées dans la console
        setCvs(response.data); // Met à jour le state avec les données récupérées
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des CVs :', error);
      });
  }, []);
  const handleImport = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const apiUrl = 'http://localhost:8082/file/upload';
    const formData = new FormData();
    formData.append('file', file);
    axios
      .post(apiUrl, formData, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
        }})
      .then((response) => {
        console.log('CV importé avec succès !', response.data);
        // After successful upload, refresh the list of CVs by making the API call again
        axios
          .get('http://localhost:8082/file/list', {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
            }})
          .then((response) => {
            setCvs(response.data); // Update the state with the new list of CVs
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des CVs :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'importation du CV :', error);
      });
  };

  const handleDownload = (fileId) => {
    // Trigger the download of the CV using the provided fileId
    // const downloadUrl = `http://localhost:8082/file/download/${fileId}`;
    // window.open(downloadUrl, '_blank'); // Open the download URL in a new tab

    const downloadUrl = `http://localhost:8082/file/download/${fileId}`;

    axios
      .get(downloadUrl, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
        }, responseType: 'blob' })
      .then((response) => {
        if (response.status === 200) {
          // Create a blob object from the response data
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          window.URL.revokeObjectURL(url);
        } else {
          console.log('Error:', response.status, response.statusText);
        }
      })
  };

  return (
    <Card sx={sx}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1
        }}
      ></Box>
      {/* Ajoutez le gestionnaire handleImport au bouton "Importer" */}
      <label>
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <Button
          color="inherit"
          startIcon={(
            <SvgIcon fontSize="small">
              <ArrowUpOnSquareIcon />
            </SvgIcon>
          )}
          component="span"
        >
          Importer
        </Button>
      </label>
      <CardHeader title="Latest Orders" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du CV</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cvs.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell>{cv.name}</TableCell>
                <TableCell>
                {cv.creationDate ? format(new Date(cv.creationDate), 'dd/MM/yyyy') : 'N/A'}
                </TableCell>                
                <TableCell>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                    onClick={() => handleDownload(cv.id)}
                  >
                    Télécharger
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <Divider />
    </Card>
  );
};

Listcv.propTypes = {
  sx: PropTypes.object
};