import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Alert } from '@mui/material';

const defaultTheme = createTheme();

export default function SignIn({ admin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ status: false, msg: "" });
  const navigate = useNavigate();
  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setUserData(() => ({ ...userData, [field]: value }));
  }

  const onSubmit = async (data) => {
    try {
      let res;
      if(admin)
        res = await axios.post(`${baseUrl}sint/retrieve/signinadmin`, data);
      else  
        res = await axios.post(`${baseUrl}sint/retrieve/signin`, data);
      if (res.status === 201) {
        console.log("Signed In YAY");
        const token = res.data.token;
        if (admin) {
          localStorage.setItem("adminToken", token);
          navigate("/admin-dash/dashboard");
        }
        else {
          localStorage.setItem("token", token);
          const userData = res.data.userData;
          localStorage.setItem("userData", JSON.stringify(userData));
          navigate("/");
        }
      }
    }
    catch (error) {
      if (error.response && error.response.status === 401)
        setAlert({ ...alert, status: true, msg: error.response.data.error })
      else
        setAlert({ ...alert, status: true, msg: "Some error occurred" })
    }
  };


  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {alert.status &&
              <Alert variant="filled" severity="error" onClose={() => setAlert({ ...alert, status: false, msg: "" })}>
                {alert.msg}
              </Alert>
            }
            <Avatar sx={{ m: 1, bgcolor: 'black' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {admin ? "Welcome Admin" : "Sign in"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 6 }}>
              <TextField
                {...register('email', { required: true, pattern: admin ? null : /^\S+@\S+$/i })}
                error={errors.email && true}
                onChange={handleChange}
                value={userData.email}
                margin="normal"
                required
                fullWidth
                id="email"
                label={admin ? "Admin ID" : "Email Address"}
                type={admin && "password"}
                name="email"
                autoFocus
              />
              {errors.email && errors.email.type === 'required' && (
                <span className='error'>
                  {admin ? "ID is required" : "Email is required"}
                </span>
              )}
              {!admin && errors.email && errors.email.type === 'pattern' && (
                <span className='error'>Invalid email address</span>
              )}
              <TextField
                {...register('password', { required: true })}
                error={errors.password && true}
                onChange={handleChange}
                value={userData.pwd}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {errors.password && errors.password.type === 'required' && (
                <span className='error'>Password is required</span>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                {!admin && <Grid item xs>
                  <Link to={"/admin-portal"} style={{textDecoration:'none'}}>
                    Go to Admin Panel
                  </Link>
                </Grid>}
                <Grid item>
                  {!admin && <Link to={"/signup"} style={{ textDecoration: 'none' }}>
                    {"Sign Up"}
                  </Link>}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}