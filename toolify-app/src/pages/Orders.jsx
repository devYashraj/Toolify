import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import SignIn from './SignIn.jsx';
import { testAdmin } from '../components/utils'
import { LinearProgress } from '@mui/material';
import axios from 'axios';
import AdminOrderBody from '../components/AdminOrderBody.jsx'
import { Pagination, Typography } from '@mui/material';
import PurchaseBody from '../components/PurchaseBody.jsx';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
            {'Copyright © '}
            Sintefy
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function Orders({ status }) {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    useEffect(() => {
        const checkAdmin = async () => {
            const res = await testAdmin();
            if (res) {
                const token = localStorage.getItem("adminToken");
                const response = await axios.get(`${baseUrl}sint/retrieve/allorders/${status}`, {
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
        checkAdmin();
    }, [status]);


    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    if (loading) {
        return <LinearProgress />;
    }

    if (!loggedIn) {
        return <SignIn admin={true} />;
    }



    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
                    {currentOrders.map((order, index) => (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            {/* {status === "processing" 
                            ? <PurchaseBody order={order}/>
                            : <AdminOrderBody order={order} status={status}/>   
                            } */}
                             <AdminOrderBody order={order} status={status}/>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{
                textAlign: 'center',
                position: 'sticky',
                backgroundColor: '#fff',
                mt: 2,
                bottom: 0,
            }}>
                {allOrders.length === 0
                    ? <Typography variant='h4'>OOPS! Nothing here</Typography>
                    : <Pagination
                        count={Math.ceil(allOrders.length / ordersPerPage)}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                    />}
            </Box>
        </>
    );
}