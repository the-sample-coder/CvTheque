import axios from 'axios';
import { useEffect, useState } from 'react'; 
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusCircleIcon from '@heroicons/react/24/solid/PlusCircleIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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
  Checkbox,
  Typography,
  DialogActions,
  TextField,
  Unstable_Grid2 as Grid,
  CardContent
} from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';
import Head from 'next/head';

export const Listcv = (props) => {
  const { sx } = props;
  const [selectedCvs, setSelectedCvs] = useState([]); 
  const [cvs, setCvs] = useState([]); 
  const [file, setFile] = useState(null); 
  const jwtToken = sessionStorage.getItem('jwt');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCvMetadata, setSelectedCvMetadata] = useState(null);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);

  const  initialMetadata =  {
    contrat: '',
    source: '',
    niveau: '',
    disponibilite: '',
    profil: '',
  };
  const handleCheckboxChange = (cvId) => {
    setSelectedCvs((prevSelectedCvs) =>
      prevSelectedCvs.includes(cvId)
        ? prevSelectedCvs.filter((id) => id !== cvId)
        : [...prevSelectedCvs, cvId]
    );
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
        console.log('Données CV récupérées :', response.data); 
        setCvs(response.data); 
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
        toast.success('CV importé avec succès !');       
    axios
      .get('http://localhost:8082/file/list', {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
            }})
      .then((response) => {
            setCvs(response.data); 
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

  const handleDownloadSelected = () => {
    if (selectedCvs.length === 0) {
      alert('Veuillez sélectionner au moins un CV pour le télécharger.');
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
  return (
    <Card sx={sx}>
      <Dialog
            open={metadataDialogOpen}
            onClose={handleCloseMetadataDialog}
            maxWidth="sm"
            fullWidth
          >            
        <DialogContent>
             {selectedCvMetadata && (
                <Card>
                <CardHeader    
          title="Métadonnées"/>
                <CardContent sx={{ pt: 0 }}>
                <Box >
                <Grid
                container
                spacing={3}
                >
                <Grid
                xs={12}
                md={6}>
                <TextField
                  fullWidth
                  label="Contrat"
                  variant="outlined"
                  value={selectedCvMetadata.contrat}
                  InputProps={{
                    readOnly: true,
                  }}
                 
                />
                </Grid>
                <Grid
                xs={12}
                md={6}>
                <TextField
                  fullWidth
                  label="Source Candidat"
                  variant="outlined"
                  value={selectedCvMetadata.source}
                  InputProps={{
                    readOnly: true,
                  }}
                
                />
                </Grid>
                <Grid
                xs={12}
                md={6}>
                <TextField
                  fullWidth
                  label="Niveau d'étude"
                  variant="outlined"
                  value={selectedCvMetadata.niveau}
                  InputProps={{
                    readOnly: true,
                  }}
               
                />
                 </Grid>
                 <Grid
                xs={12}
                md={6}>
                <TextField
                  fullWidth
                  label="Disponibilités"
                  variant="outlined"
                  value={selectedCvMetadata.disponibilite}
                  InputProps={{
                    readOnly: true,
                  }}
          
                />
                 </Grid>
                 <Grid
                xs={12}
                md={12}>
                <TextField
                  fullWidth
                  label="Profil Candidat"
                  variant="outlined"
                  value={selectedCvMetadata.profil}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              </Grid>
              </Box>
              </CardContent>
              </Card>
          )}
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseMetadataDialog} color="primary">
                Fermer
              </Button>
            </DialogActions>
            </Dialog>
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
        <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                    onClick={ handleDownloadSelected}
                  >
                    Télécharger
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
              <TableCell>Selectionner</TableCell> {/* Nouvelle colonne pour la checkbox */}
              <TableCell>Nom du CV</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cvs.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell>
                  {/* Utilisez la balise Checkbox de MUI */}
                  <Checkbox
                    checked={selectedCvs.includes(cv.id)}
                    onChange={() => handleCheckboxChange(cv.id)}
                  />
                </TableCell>
                <TableCell>{cv.name}</TableCell>
                <TableCell>
                  {cv.creationDate
                    ? format(new Date(cv.creationDate), 'dd/MM/yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>

                <Button
                  color="inherit"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <EyeIcon />
                    </SvgIcon>)}
                  onClick={() => handleViewMetadata(cv.id)}  
                 >
                  view
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <Divider />
      <ToastContainer
      position="bottom-left" />
    </Card>

    
  );
};
Listcv.propTypes = {
  sx: PropTypes.object
};
