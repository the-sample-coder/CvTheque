import React, { useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  FormControl,
  FormControlLabel,
  Radio,
  Box,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  CardHeader,
  Button,
  ListSubheader
} from '@mui/material';

export const CvSearch = ({ onSearchResults }) => {
  const [searchOption, setSearchOption] = useState('cvName');
  const [showMetaData, setShowMetaData] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // State to store search results


  const handleShowMetaDataChange = (event) => {
    setShowMetaData(event.target.checked);
  };

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const [searchCriteria, setSearchCriteria] = useState({
    contrat: '',
    source: '',
    niveau: '',
    disponibilite: '',
    profil: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value
    }));
  };
  const nonEmptyCriteria = Object.keys(searchCriteria)
  .filter(key => searchCriteria[key] !== '')
  .reduce((result, key) => {
    result[key] = searchCriteria[key];
    return result;
  }, {});
  const handleSubmit = async (event) => {
    event.preventDefault();
  const jwtToken = sessionStorage.getItem('jwt');
  
    try {
      const response = await fetch('http://localhost:8082/file/searchByCriteria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(nonEmptyCriteria)
      });
      const cvList = await response.json();
      console.log('reseultat de recherche ', cvList);
      setSearchResults(cvList);
      onSearchResults(cvList);
    } catch (error) {
      console.error(error);
    }
  };  
  return (
    <Card>
      <Box sx={{ width: 3000 , mb:5  }}>
        <FormControl component="fieldset" sx={{ ml: 4 , width: '15%' }}>
        <ListSubheader> search Method </ListSubheader>
          <RadioGroup
            row
            aria-label="search Method "
            name="search Method"
            value={searchOption}
            onChange={handleSearchOptionChange}
          >
            <FormControlLabel
              value="cvName"
              control={<Radio />}
              label="Direct Search"
            />
            <FormControlLabel
              value="cvCategory"
              control={<Radio />}
              label="Vector Search"
            />
          </RadioGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={showMetaData}
                onChange={handleShowMetaDataChange}
              />
            }
            label="Show Metadata"
          />
          {showMetaData && (
            <Box sx={{ mt: 2 }}>
              <FormControl  fullWidth sx={{ mt: 1, mb: 1 }}>
                <InputLabel htmlFor="contrat">Contrat</InputLabel>
                <Select id="contrat" name="contrat" label="Contrat"   
                value={searchCriteria.contrat}
                onChange={handleChange}>
                  <MenuItem value="CDI">CDI</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel htmlFor="source">Source Candidat</InputLabel>
                <Select id="source" name="source" label="Source Candidat" value={searchCriteria.source}
                 onChange={handleChange}>
                  <MenuItem value="Linkedin">Linkedin</MenuItem>
                  <MenuItem value="Candidature">Candidature</MenuItem>
                  <MenuItem value="Parrainage">Parrainage</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth sx={{ mt: 1, mb: 1 }}>
              <InputLabel htmlFor="niveau">Niveau d'étude</InputLabel>
              <Select id="niveau" name="niveau" label="Niveau d'étude" value={searchCriteria.niveau}
                onChange={handleChange}>
                <MenuItem value="Aucun">Aucun</MenuItem>
                <MenuItem value="BacPlus2">Bac+2</MenuItem>
                <MenuItem value="BacPlus3">Bac+3</MenuItem>
                <MenuItem value="BacPlus4">Bac+4</MenuItem>
                <MenuItem value="Master">Master</MenuItem>
                <MenuItem value="PhD">PhD</MenuItem>
              </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth sx={{ mt: 1, mb: 1 }}>
                <InputLabel htmlFor="disponibilite">Disponibilités</InputLabel>
                <Select
                  id="disponibilite"
                  name="disponibilite"
                  label="Disponibilités"
                  value={searchCriteria.disponibilite}
                  onChange={handleChange}
                >
                  <MenuItem value="Immediat">Immediat</MenuItem>
                  <MenuItem value="UnMois">1 mois</MenuItem>
                  <MenuItem value="DeuxMois">2 mois</MenuItem>
                  <MenuItem value="TroisMois">3 mois</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth sx={{ mt: 1, mb: 1 }}>
                <InputLabel htmlFor="profil">Profil Candidat</InputLabel>
                <Select id="profil" name="profil" label="Profil Candidat" value={searchCriteria.profil}
                  onChange={handleChange}>
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
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Rechercher
              </Button>
              <ListSubheader> search Mode </ListSubheader>
              <RadioGroup
                aria-label="search Mode"
                name="search Mode "
                value={searchOption}
                onChange={handleSearchOptionChange}
              >
                <FormControlLabel
                  value="Match Each Keywords"
                  control={<Radio />}
                  label="Match Each Keywords"
                />
                <FormControlLabel
                  value="Match Whole Query"
                  control={<Radio />}
                  label="Match Whole Query"
                />
              </RadioGroup>
            </Box>
          )}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 1
            }}
          ></Box>
          <OutlinedInput
            defaultValue=""
            fullWidth
            placeholder="Search cv"
            startAdornment={(
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            )}
            sx={{ maxWidth: 500 }}
          />
        </FormControl>
      </Box>
    </Card>
  );
};
