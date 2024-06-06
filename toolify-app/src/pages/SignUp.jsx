import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ status: false, message: "" });
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [userData, setUserData] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    phno: ""
  });

  const handleChange = (event) => {
    const fieldName = event.target.name;
    const value = event.target.value;
    setUserData({ ...userData, [fieldName]: value });
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${baseUrl}sint/create/signup`, data);
      if (res.status === 201) {
        console.log("Account Created");
        localStorage.setItem("acMade","yes");
        navigate("/signin");
      }
    }
    catch (error) {
      if (error.response && error.response.status === 400)
        setAlert({ ...alert, status: true, message: error.response.data.error });
      else
        setAlert({ ...alert, status: true, message: "Some error occurred" });
    }
  };


  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {alert.status && <Alert variant="filled" severity="error" onClose={() => setAlert({ ...alert, status: false, message: "" })}>
              {alert.message}
            </Alert>}
            <Avatar sx={{ m: 1, bgcolor: 'black' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('name', { required: true })}
                    value={userData.name}
                    onChange={handleChange}
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    label="Name"
                    autoFocus
                    error={errors.name && true}
                  />
                  {errors.name && errors.name.type === 'required' && (
                    <span className='error'>
                      Name is required
                    </span>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('companyName', { required: true })}
                    value={userData.companyName}
                    onChange={handleChange}
                    required
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    error={errors.companyName && true}
                  />
                  {errors.companyName && errors.companyName.type === 'required' && (
                    <span className='error'>
                      Company Name is required
                    </span>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    value={userData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={(alert.status && alert.message !== "Some error occurred")
                    || (errors.email && true)}
                  />
                  {errors.email && errors.email.type === 'required' && (
                    <span className='error'>
                      Email is required
                    </span>
                  )}
                  {errors.email && errors.email.type === 'pattern' && (
                    <span className='error'>Invalid email address</span>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register('phno', { required: true, pattern: /^\d+$/ })}
                    value={userData.phno}
                    onChange={handleChange}
                    required
                    fullWidth
                    label="Phone Number"
                    name="phno"
                    error={errors.phno && true}
                  />
                  {errors.phno && errors.phno.type === 'required' && (
                    <span className='error'>
                      Phone Number is required
                    </span>
                  )}
                  {errors.phno && errors.phno.type === 'pattern' && (
                    <span className='error'>Invalid phone number</span>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register('password', { required: true, minLength: 8 })}
                    value={userData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    error={errors.password && true}
                  />
                  {errors.password && errors.password.type === 'required' && (
                    <span className='error'>Password is required</span>
                  )}
                  {
                    errors.password && errors.password.type === 'minLength' && (
                      <span className='error'>Password must be atleast 8 characters long</span>
                    )}
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to={"/signin"} style={{ textDecoration: 'none' }}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}