import Box from "@mui/material/Box";
import Navbar from '../components/Navbar.jsx';
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline, Typography } from "@mui/material";
import { Button, Checkbox, Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { styled } from '@mui/system';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TermsConditions from "../components/TermsConditions.jsx";
import FormControlLabel from '@mui/material/FormControlLabel';
import SignIn from './SignIn.jsx';
import { testUser } from '../components/utils'
import { LinearProgress } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});



function FileUploadButton({ setFile }) {
    const [fileSelected, setFileSelected] = useState(false);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        if (file) {
            setFileSelected(true);
        }
        else {
            setFileSelected(false);
        }
    };

    return (
        <Button
            margin="normal"
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={fileSelected ? <CheckCircleOutlineIcon /> : <CloudUploadIcon />}
        >
            Upload file (pdf/dwg)
            <VisuallyHiddenInput type="file" name="file" onChange={handleFileChange} />
        </Button>
    );
}



export default function SendOrder() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkUser = async () => {
            const res = await testUser();
            setLoggedIn(res);
            setLoading(false);
        };
        checkUser();
    }, []);


    const defaultTheme = createTheme();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedFile, setSelectedFile] = useState(null);
    const [toolData, setToolData] = useState({ toolName: "", address: "" });
    const [tc, setTc] = useState(false);
    const [fileError, setFileError] = useState(false);
    const [tcError, setTcError] = useState(false);
    const handleChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        setToolData({ ...toolData, [field]: value });
    }

    const submit = async (data) => {
        if (selectedFile && tc) {
            setFileError(false);
            const formData = new FormData();
            const token = localStorage.getItem("token");
            const userData = JSON.parse(localStorage.getItem("userData"));
            formData.append('toolName', toolData.toolName);
            formData.append('address', toolData.address);
            formData.append('drawing', selectedFile);
            formData.append('date', new Date());
            formData.append('custId', userData._id);

            try {
                const res = await axios.post(`${baseUrl}sint/create/sendorder`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.status === 200) {
                    navigate('/orders/pending-quotes');
                }
            }
            catch (error) {
                console.log(error);
            }

        }
        else {
            if (!selectedFile) {
                setTcError(false);
                setFileError(true);
            }
            else {
                setTcError(true);
                setFileError(false);
            }
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    if (!loggedIn) {
        return <SignIn />;
    }

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 3,
                            marginBottom: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h4" variant="h6">
                            Place New Order
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(submit)} noValidate sx={{ mt: 2 }}>
                            <TextField
                                {...register('toolName', { required: true })}
                                error={errors.toolName && true}
                                onChange={handleChange}
                                margin="normal"
                                required
                                fullWidth
                                id="toolName"
                                label="Tool Name"
                                name="toolName"
                                autoFocus
                                value={toolData.toolName}
                            />
                            {errors.toolName && errors.toolName.type === 'required' && (
                                <span className='error'>
                                    Tool name is required
                                </span>
                            )}
                            <TextField
                                {...register('address', { required: true })}
                                error={errors.address && true}
                                onChange={handleChange}
                                margin="normal"
                                required
                                fullWidth
                                name="address"
                                label="Delivery Address"
                                multiline
                                rows={2}
                                value={toolData.address}
                                sx={{ mb: 3 }}
                            />
                            <FileUploadButton setFile={setSelectedFile} />
                            {fileError && <span className='error' style={{ fontSize: 'medium' }}> Select a valid file</span>}
                            <Divider />
                            <FormControlLabel sx={{ mt: 3 }}
                                control={
                                    <Checkbox
                                        onChange={(e) => {
                                            console.log("Checkbox clicked", e.target.checked);
                                            setTc(() => e.target.checked);
                                        }}
                                        color="primary"
                                        name="tc"
                                    />}
                                label={<>
                                    I've read the <TermsConditions />
                                </>}
                            />
                            <Divider />
                            {tcError && <span className="error">Please read the Terms & Conditions</span>}
                            <Button
                                margin="normal"
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1, mb: 2 }}
                            >
                                Send Order
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}