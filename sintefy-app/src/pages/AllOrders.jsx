import Navbar from '../components/Navbar.jsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import SignIn from './SignIn.jsx';
import { testUser } from '../components/utils'
import { LinearProgress, Box } from '@mui/material';
import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import OrderBody from '../components/OrderBody.jsx';
import { Pagination, Typography } from '@mui/material';

export default function AllOrders() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    useEffect(() => {
        const checkUser = async () => {
            const res = await testUser();
            if (res) {
                const userData = JSON.parse(localStorage.getItem("userData"));
                const token = localStorage.getItem("token");
                const response = await axios.get(`${baseUrl}sint/retrieve/allorders/${userData._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    const orderData = response.data.allOrders;
                    setAllOrders(orderData)
                }
            }
            setLoggedIn(res);
            setLoading(false);
        };
        checkUser();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    if (loading) {
        return <LinearProgress />;
    }

    if (!loggedIn) {
        return <SignIn />;
    }

    return (
        <>
            <Navbar action={true} loggedIn={loggedIn} />
            <Box sx={{ flexGrow: 1, m: 3, mt: 12 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
                    {currentOrders.map((order, index) => (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <OrderBody order={order} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{
                textAlign: 'center',
                position: 'sticky',
                backgroundColor: '#fff',
                mt:2,
                bottom:0,
            }}>
                <Pagination
                    count={Math.ceil(allOrders.length / ordersPerPage)}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                />
            </Box>
        </>
    );
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));