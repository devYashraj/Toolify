import { Navigate, useParams} from "react-router-dom";
import * as React from 'react';
import { Box, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function CreatePo() {
    const { id } = useParams();
    const location = useLocation();
    const { address, total, toolName } = location.state;
    const [tc, setTc] = React.useState("");
    const defaultTc =
        "1. If material is not as per specification it will be replaced by party.\n2. If any deviation in quality is observed it will be resolved.\n3. Material Certificate is required."
    const [checked, setChecked] = React.useState(false);
    const [err, setErr] = React.useState(false);
    const navigate = useNavigate();
    const loadTc = (c) => {
        if (c)
            setTc(defaultTc);
        else
            setTc("");
        return c;
    }

    const handleChange = (event) => {
        setChecked(() => loadTc(event.target.checked));
    };

    const handleTcChange = (event) => {
        setErr(false);
        setTc(event.target.value)
    }

    const handleSubmit = async () => {
        if (tc !== "") {
            setErr(false);
            const formData = new FormData();
            formData.append('address',address);
            formData.append("total",total);
            formData.append("toolName",toolName);
            formData.append("tc",tc);
            formData.append("orderId",id)
            const token = localStorage.getItem("token");

            try{
                
                const res = await axios.post(`${baseUrl}sint/create/sendpo`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if(res.status === 200){
                    navigate("../in-production");
                }
            }
            catch(error){
                console.log(error);
            }
        }
        else
            setErr(true);
    }

    return (
        <>
            <Box sx={{
                flexGrow: 1, p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
                    <Table aria-label="simple table" >
                        <TableHead>
                            <TableRow >
                                <TableCell sx={{ textAlign: 'center' }} colSpan={4}>
                                    <Typography variant="h5">
                                        Purchase Order
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            <TableRow >
                                <TableCell align="center">
                                    <Typography variant="h5">
                                        {companyName}
                                    </Typography>
                                    {companyAddr}
                                </TableCell>
                                <TableCell align="center" colSpan={3}>
                                    <Typography variant="h5">
                                        Delivery Address
                                    </Typography>
                                    {address}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sr No</TableCell>
                                <TableCell>Item Description</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>{toolName}</TableCell>
                                <TableCell>1</TableCell>
                                <TableCell>{total}/-</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} align="center">Total</TableCell>
                                <TableCell>{total}/-</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" colSpan={4}>
                                    <Typography variant="h6">
                                        Terms & Conditions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <TextField
                                        autoFocus
                                        multiline
                                        fullWidth
                                        value={tc}
                                        onChange={handleTcChange}
                                        sx={{ color: 'black' }}
                                        error={err}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <FormControlLabel control={<Checkbox onChange={handleChange} />}
                                        label="Use default" />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                    sx={{ m: 2, borderRadius: 30 }}
                    variant="contained"
                    onClick={handleSubmit}>
                    Send Purchase Order
                </Button>
            </Box>
        </>
    );
}