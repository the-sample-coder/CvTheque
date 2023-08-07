import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { SERVER_URL } from 'src/pages/auth/constants';
import { set } from 'nprogress';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const roles = [
  {
    value: ' USER',
    label: 'User'
  },
  {
    value: 'ADMIN',
    label: 'Admin'
  }
];




export const AccountProfileDetails = () => {

  const username1 = sessionStorage.getItem('username');

  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: username1,
    role: '',
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

   const handleSubmit = () => {
    axios.put(SERVER_URL + 'users/'+ values.id, values, {headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    }})
    .then((response) => {
      sessionStorage.setItem('username', values.username);

      toast.success(response.data, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })};

  const jwtToken = sessionStorage.getItem('jwt');

  useEffect(() => {
    const data={'username':username1};
    const apiUrl = SERVER_URL + 'users/findByUsername';
    
    axios
      .get(apiUrl, {params: data ,headers: {
        'Authorization': `Bearer ${jwtToken}`
        }})
      .then((response) => {
        // setValues(response.data);
        if(response.data != ''){
          setValues(response.data);
        }else{
          console.log("User not found");
        }
        
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      });
  }, []);

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  value={values.username}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="firstname"
                  onChange={handleChange}
                  required
                  value={values.firstname}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastname"
                  onChange={handleChange}
                  required
                  value={values.lastname}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Select Role"
                  name="role"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.role}
                >
                  {roles.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            onClick={handleSubmit}
            variant="contained">
              Save details
          </Button>
        </CardActions>
      </Card>
      <ToastContainer />
    </form>
    
  );
};
