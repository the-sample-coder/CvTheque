import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Field, useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Card, CardHeader, Divider, FormControl, FormHelperText, Grid, InputLabel, Link, MenuItem, Select, Stack, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,Dialog,DialogTitle,DialogContent } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Scrollbar } from 'src/components/scrollbar';
import { useEffect, useState } from 'react';
import { Container } from '@mui/system';
import axios from 'axios';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { SERVER_URL } from './constants';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlusCircleIcon from '@heroicons/react/24/solid/PlusCircleIcon';



const Page = (props) => {
  const { sx } = props;
  const [users, setUsers] = useState([]); // State to store the list of CVs
  const router = useRouter();
  const auth = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const jwtToken = sessionStorage.getItem('jwt');

  const formik = useFormik({
    initialValues: {
      firstname:'',
      lastname:'',
      email: '',
      password: '',
      role:'USER',
      submit: null
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required('Username is required'),
      firstname: Yup
        .string()
        .max(255),
      lastname: Yup
        .string()
        .max(255),
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255),
      password: Yup
        .string()
        .max(255)
        .required('Password is required'),
      role: Yup
        .string()
        .max(255)
        .required('Role is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        // await auth.signUp(values.email, values.name, values.password);
        // const data= {'username':values.username, 'firstname':values.firstname, 'lastname':values.lastname, 'email':values.email, 'password':values.password};
        const data= {'username':values.username, 'password':values.password, 'role':values.role};
        console.log(data);
        const response = await axios.post(SERVER_URL +'users/register', data, {
          headers: {
            'Content-Type': 'application/json', // Set the request content type to JSON
            'Authorization': `Bearer ${jwtToken}`
          }});
        console.log(response.data);
        if(response.data.includes('already exists')){
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: 'This username already exists' });
          helpers.setSubmitting(false);
          toast.error(response.data, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });

        }else{
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
        }

        

        const apiUrl = SERVER_URL + 'users';
        axios
          .get(apiUrl, {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
            }})
          .then((response) => {
            setUsers(response.data); // Met à jour le state avec les données récupérées
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des CVs :', error);
          });

        // router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const apiUrl = SERVER_URL + 'users';
    axios
      .get(apiUrl, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
        }})
      .then((response) => {
        setUsers(response.data); // Met à jour le state avec les données récupérées
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des CVs :', error);
      });
  }, []);

  const handleDelete = (id) => {
    const apiUrl = `${SERVER_URL}users/${id}`;

    axios.delete(apiUrl, {headers: {
        'Authorization': `Bearer ${jwtToken}`
        }})
        .then((response) => {
          toast.error(response.data, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            
          const apiUrl1 = SERVER_URL + 'users';
          axios
            .get(apiUrl1, {headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`
              }})
            .then((response1) => { // Vérifiez les données récupérées dans la console
              setUsers(response1.data); // Met à jour le state avec les données récupérées
            })
            .catch((error) => {
              console.error('Erreur lors de la récupération des CVs :', error);
            });
        })
    
    }

  return (
    <>
      <Head>
        <title>
        Add user | CvTheque
        </title>
      </Head>
      <Box
        // sx={{
        //   flex: '1 1 auto',
        //   alignItems: 'center',
        //   display: 'flex',
        //   justifyContent: 'center'
        // }}
      >
        <Box
          sx={{
            maxWidth: 500,
            px: 5,
            py: '1px',
            width: '100%'
          }}
        >
          <div>
  
             
          <Button  color="inherit" onClick={() => setShowDialog(true)}
         startIcon={(
          <SvgIcon fontSize="small">
            <PlusCircleIcon/>
          </SvgIcon>)}
        >
                 Add Users
        </Button>
          
            <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle>Formulaire Register </DialogTitle>
            <DialogContent>
            <form
              Validate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={formik.errors.username} //{!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.errors.username}
                  label="Username"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <TextField
                  error={!!(formik.touched.firstname && formik.errors.firstname)}
                  fullWidth
                  helperText={formik.touched.firstname && formik.errors.firstname}
                  label="Firstname"
                  name="firstname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstname}
                />
                <TextField
                  error={!!(formik.touched.lastname && formik.errors.lastname)}
                  fullWidth
                  helperText={formik.touched.lastname && formik.errors.lastname}
                  label="Lastname"
                  name="lastname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastname}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!( formik.errors.password)}
                  fullWidth
                  helperText={ formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <FormControl variant="outlined">
                  <InputLabel htmlFor="niveau">Role </InputLabel>
                  <Select
                    id="role"
                    name="role"
                    error={!!( formik.errors.role)}
                    fullWidth
                    helperText={ formik.errors.role}
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    label="Selectionner un rôle"
                  >
                    <MenuItem value="USER" selected={true} >User</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                  {formik.errors.role && <FormHelperText error>{formik.errors.role}</FormHelperText>}
                </FormControl>
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                color="inherit"
              >
                Register
              </Button>
              <Button   fullWidth
                size="large"
                sx={{ mt: 3 }}
               
              variant="outlined" color="error"onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            </form>
            </DialogContent>
            </Dialog>
          </div>
          
        </Box>
        
      </Box>
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={5}
            md={12}
            lg={20}
          >
      <Card sx={sx}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1
        }}
      ></Box>
        <CardHeader title="Liste des utilisateurs" />
        <Scrollbar sx={{ flexGrow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Firstname</TableCell>
                <TableCell>Lastname</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell> {user.username != null ? user.username : 'null'}</TableCell>
                  <TableCell>{user.firstname != null ? user.firstname : 'null'}</TableCell>
                  <TableCell>{user.lastname != null ? user.lastname : 'null'}</TableCell>
                  <TableCell>{user.email != null ? user.email : 'null'}</TableCell> 
                  <TableCell>{user.role != null ? user.role : 'null'}</TableCell> 
                  <TableCell>
                    <Button
                      color="error"
                      startIcon={(
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>)}
                      onClick={() => handleDelete(user.id)}
                      >
                      
                    </Button>
                </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
        <Divider />
      </Card>
      </Grid>
        </Grid>
      </Container>
    </Box>
    <ToastContainer />
    
    </>

  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;