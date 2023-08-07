import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { SERVER_URL } from 'src/pages/auth/constants';

export const SettingsPassword = () => {
  const [values, setValues] = useState({
    id: '',
    password: '',
    confirm: ''
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

  const username = sessionStorage.getItem('username');
  const jwtToken = sessionStorage.getItem('jwt');

  useEffect(() => {
    const data={'username':username};
    const apiUrl = SERVER_URL + 'users/findByUsername';
    
    axios
      .get(apiUrl, {params: data ,headers: {
        'Authorization': `Bearer ${jwtToken}`
        }})
      .then((response) => {
        // setValues(response.data);
        if(response.data != ''){
          values.id = response.data.id;
        }else{
          console.log("User not found");
        }
        
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      });
  }, []);

  const handleSubmit = () => {
    if(values.password === values.confirm){

      axios.put(SERVER_URL + 'users/'+ values.id, {"password" : values.password} , {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }})
      .then((response) => {
        toast.success("Password changed successfully", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du mot de passe :', error);
      });
    }else{
      toast.error("Password does not match", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  }
  ;

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            <TextField
              fullWidth
              label="Password (Confirm)"
              name="confirm"
              onChange={handleChange}
              type="password"
              value={values.confirm}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleSubmit} variant="contained">
            Update
          </Button>
        </CardActions>
      </Card>
      <ToastContainer />
    </form>
  );
};
