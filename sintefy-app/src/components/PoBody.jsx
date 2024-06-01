import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { LinearProgress } from '@mui/material';

export default function PoBody({ orderId, delivered, admin }) {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const handleSubmit = async () => {
        try {
            console.log("F here")
            const token = localStorage.getItem("adminToken");
            const formData = new FormData();
            formData.append('orderId', order.orderId);
            const res = await axios.post(`${baseUrl}sint/update/purchase`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                navigate("../delivered");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        let response;
        const getOrder = async () => {
            try {
                
                if(admin){
                    let adminToken = localStorage.getItem("adminToken");
                    response = await axios.get(`${baseUrl}sint/retrieve/purchase/${orderId}`, {
                        headers: {
                            'Authorization': `Bearer ${adminToken}`
                        }
                    });
                }
                else{
                    let token = localStorage.getItem("token");
                    response = await axios.get(`${baseUrl}sint/retrieve/cust-purchase/${orderId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
                if (response.status === 200) {
                    console.log(response.data.order)
                    setOrder(response.data.order);
                }
            } 
            catch (error) {
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        }
        getOrder();
    }, [orderId])

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const navigate = useNavigate();

    if (loading || !order) {
        return <LinearProgress />;
    }

    return (
        <React.Fragment>
            <Button disabled={false} sx={{ marginLeft: 'auto', color: 'purple' }} onClick={handleClickOpen('paper')}>View Purchase Order</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullScreen={fullScreen}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <DialogTitle id="scroll-dialog-title">Purchase order for {order.toolName}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        component={'span'}
                    >
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
                                                {order.address}
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
                                            <TableCell>{order.toolName}</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell>{order.total}/-</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">Total</TableCell>
                                            <TableCell>{order.total}/-</TableCell>
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
                                                    disabled
                                                    value={order.tc}
                                                    sx={{ color: 'black' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {admin && !delivered && <Button
                                sx={{ m: 2, borderRadius: 30 }}
                                variant="contained"
                                color='warning'
                                onClick={handleSubmit}>
                                Mark As Delivered
                            </Button>}
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}