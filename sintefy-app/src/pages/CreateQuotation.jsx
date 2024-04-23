import * as React from 'react';
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useState } from "react";
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { TextField, Grid, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function CreateQuotation() {
    const { id } = useParams();
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(() => items.reduce((t, c) => t + (c.price * c.qty), 0));
    const navigate = useNavigate();
    const handleDelete = (id) => {
        setItems((prevItems) => {
            const updatedItems = prevItems.filter((item, i) => i !== id);
            const newTotal = updatedItems.reduce((t, c) => t + (c.price * c.qty), 0);
            setTotal(newTotal);
            return updatedItems
        });
    }

    const handleIncrease = (id) => {
        setItems((prevItems) => {
            const updatedItems = prevItems.map((item, i) => {
                if (i === id && item.qty !== 10)
                    return { ...item, qty: item.qty + 1 };
                return { ...item };
            })
            const newTotal = updatedItems.reduce((t, c) => t + (c.price * c.qty), 0);
            setTotal(newTotal);
            return updatedItems;
        })
    }

    const handleDecrease = (id) => {
        setItems((prevItems) => {
            const updatedItems = prevItems.map((item, i) => {
                if (i === id && item.qty !== 1)
                    return { ...item, qty: item.qty - 1 };
                return { ...item };
            })
            const newTotal = updatedItems.reduce((t, c) => t + (c.price * c.qty), 0);
            setTotal(newTotal);
            return updatedItems;
        })
    }

    const [newItem, setNewItem] = useState({ itemName: "", qty: 1, price: "" });

    const handleChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        setNewItem({ ...newItem, [field]: value })
    }

    const handleSubmit = () => {
        if (!isNaN(newItem.price)) {
            setItems((prevItems) => {
                const newItems = [...prevItems, { ...newItem }];
                const newTotal = newItems.reduce((t, c) => t + (c.price * c.qty), 0);
                setTotal(newTotal);
                return newItems;
            });
            setNewItem({ itemName: "", qty: 1, price: "" })
        }
    }

    const sendQuote = async (quotation) => {
        console.log(quotation);
        const data = { quotation, id, total }
        console.log(data);
        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.post(`${baseUrl}sint/update/quotation`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.status === 200) {
                navigate("/admin-dash/orders")
            }
        }
        catch (error) {

        }
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                m: 3
            }}>
                {items.length !== 0 &&
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sr No</TableCell>
                                    <TableCell align="left">Item</TableCell>
                                    <TableCell align="left">Quantity</TableCell>
                                    <TableCell align="left">Price (₹)</TableCell>
                                    <TableCell align="center">Remove Item</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, i) => (
                                    <TableRow
                                        key={i}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {i + 1}
                                        </TableCell>
                                        <TableCell align="left">{item.itemName}</TableCell>
                                        <TableCell align="left">
                                            <AddIcon onClick={() => handleIncrease(i)} sx={{ fontSize: 20, mr: 2 }} />
                                            {item.qty}
                                            <RemoveIcon onClick={() => handleDecrease(i)} sx={{ fontSize: 20, ml: 2 }} />
                                        </TableCell>
                                        <TableCell align="left">{item.price * item.qty + "/-"}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleDelete(i)}>
                                                <DeleteOutlinedIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableCell colSpan={3} align="center">Total</TableCell>
                                <TableCell >{"₹ " + total + " /-"}</TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => sendQuote(items)} variant='contained' color='success'>Send Quotation</Button>
                                </TableCell>
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
                <Box sx={{ mt: 3 }}>


                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 6, md: 12 }} sx={{ textAlign: 'center' }}>
                        <Grid item xs={2} sm={4} md={4}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Item Name"
                                name="itemName"
                                value={newItem.itemName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={2} sm={4} md={4}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Price ₹"
                                name='price'
                                value={newItem.price}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} sx={{ textAlign: 'center' }}>
                            <Button onClick={handleSubmit} variant="outlined" sx={{ m: 1 }}>Add Item</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}