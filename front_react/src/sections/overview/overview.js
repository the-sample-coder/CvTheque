import axios from 'axios';
import { useEffect, useState } from 'react'; 
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusCircleIcon from '@heroicons/react/24/solid/PlusCircleIcon';

import {
  Box,
  Button,
  Stack,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Input,
  MenuItem,
  DialogTitle,
  DialogContent,
  Dialog,
  Select,
} from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';
import Head from 'next/head';

export const Listcv = (props) => {
  const { sx } = props;

  const [cvs, setCvs] = useState([]); // State to store the list of CVs
  const [file, setFile] = useState(null); // State to store the selected file
  const jwtToken = sessionStorage.getItem('jwt');
  const [showDialog, setShowDialog] = useState(false);
  
  const  initialMetadata =  {
    contrat: '',
    source: '',
    niveau: '',
    disponibilite: '',
    profil: '',
  };

  const [metadata, setMetadata] = useState(initialMetadata);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log('Fichier sélectionné :', e.target.files[0]);
  };
  const handleMetadataChange = (event) => {
    const { name, value } = event.target;
    setMetadata({
      ...metadata,
      [name]: value,
    });
    console.log('Selected Metadata:', {
      ...metadata,
      [name]: value,
    });
  };

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

  const handleImport = () => {
    const apiUrl = 'http://localhost:8082/file/upload';
    const formData = new FormData();
    formData.append('file', file);
    metadata.contrat != '' ? formData.append('contrat', metadata.contrat) : null;
    metadata.source != '' ? formData.append('source', metadata.source) : null;
    metadata.niveau != '' ? formData.append('niveau', metadata.niveau) : null;
    metadata.disponibilite != '' ? formData.append('disponibilite', metadata.disponibilite) : null;
    metadata.profil != '' ? formData.append('profil', metadata.profil) : null;
    console.log(formData);
   
    axios
      .post(apiUrl, formData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      })
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
      setMetadata(initialMetadata);
  };

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
  return (
    <Card sx={sx}>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 1
      }}
    ></Box>
    <Stack  alignItems="center" direction="row"spacing={1}>
    
        <Button  color="inherit" onClick={() => setShowDialog(true)}
         startIcon={(
          <SvgIcon fontSize="small">
            <PlusCircleIcon/>
          </SvgIcon>)}
        >
                 Add CV
        </Button>
        </Stack>
    <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth maxWidth="sm">
    <DialogTitle>Formulaire d'importation</DialogTitle>
    <DialogContent>
    <form >
      <Stack spacing={3} >
        <FormControl variant="outlined">
          <InputLabel htmlFor="contrat">Contrat</InputLabel>
          <Select
            id="contrat"
            name="contrat"
            value={metadata.contrat}
            onChange={handleMetadataChange}
            label="Contrat"
          >
            <MenuItem value="CDI">CDI</MenuItem>
            <MenuItem value="Freelance">Freelance</MenuItem>
          </Select>
          </FormControl>
          <FormControl variant="outlined">
          <InputLabel htmlFor="source">Source Candidat</InputLabel>
          <Select
            id="source"
            name="source"
            value={metadata.source}
            onChange={handleMetadataChange}
            label="Source Candidat"
          >
            <MenuItem value="Linkedin">Linkedin</MenuItem>
            <MenuItem value="Candidature">Candidature</MenuItem>
            <MenuItem value="Parrainage">Parrainage</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="niveau">Niveau d'étude</InputLabel>
          <Select
            id="niveau"
            name="niveau"
            value={metadata.niveau}
            onChange={handleMetadataChange}
            label="Niveau d'étude"
          >
            <MenuItem value="Aucun">Aucun</MenuItem>
            <MenuItem value="BacPlus2">Bac+2</MenuItem>
            <MenuItem value="BacPlus3">Bac+3</MenuItem>
            <MenuItem value="BacPlus4">Bac+4</MenuItem>
            <MenuItem value="Master">Master</MenuItem>
            <MenuItem value="PhD">PhD</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="disponibilite">Disponibilités</InputLabel>
          <Select
            id="disponibilite"
            name="disponibilite"
            value={metadata.disponibilite}
            onChange={handleMetadataChange}
            label="Disponibilités"
          >
            <MenuItem value="Immediat">Immediat</MenuItem>
            <MenuItem value="UnMois">1 mois</MenuItem>
            <MenuItem value="DeuxMois">2 mois</MenuItem>
            <MenuItem value="TroisMois">3 mois</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="profil">Profil Candidat</InputLabel>
          <Select
            id="profil"
            name="profil"
            value={metadata.profil}
            onChange={handleMetadataChange}
            label="Profil Candidat"
          >
            <MenuItem value="Comptabilite">Comptabilité</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="Administration">Administration</MenuItem>
            <MenuItem value="ArtEtDesign">Art et design</MenuItem>
            <MenuItem value="Commercial">Commercial</MenuItem>
            <MenuItem value="Conseil">Conseil</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="Ingenierie">Ingénierie</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="RH">RH</MenuItem>
            <MenuItem value="MediaEtCommunication">Media et Communication</MenuItem>
            <MenuItem value="Achat">Achat</MenuItem>
            <MenuItem value="ControleQualite">Contrôle qualité</MenuItem>
            <MenuItem value="Autre">Autre</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
        <input type="file" onChange={handleFileChange}  />  

        </FormControl>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1
        }}
      ></Box>
        <Button
          type="submit"
          color="inherit"
          startIcon={(
            <SvgIcon fontSize="small">
              <ArrowUpOnSquareIcon />
            </SvgIcon>)}
            onClick={handleImport}
          component="span">
          Importer
        </Button>

        <Button variant="outlined" color="error"onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
      </Stack>
      </form>
      </DialogContent>
      </Dialog>
     
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
