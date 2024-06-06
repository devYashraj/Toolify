import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import SignIn from './SignIn.jsx';
import {testAdmin} from '../components/utils'
import { LinearProgress } from '@mui/material';
import axios from 'axios';
import CustomerBody from '../components/CustomerBody.jsx'
import { Pagination, Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Customers() {
    
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allcustomers, setAllCustomers] = useState([]);
    useEffect(()=>{
        const checkAdmin = async () => {
            const res = await testAdmin();
            if (res) {
                const token = localStorage.getItem("adminToken");
                const response = await axios.get(`${baseUrl}sint/retrieve/allcustomers`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                   const data = response.data.allcustomers;
                   setAllCustomers(data);
                }
            }
            setLoggedIn(res);
            setLoading(false);
        };
        checkAdmin();
    },[]);

    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 6;
    const indexOfLastOrder = currentPage * customersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - customersPerPage;
    const currentCustomers = allcustomers.slice(indexOfFirstOrder, indexOfLastOrder);
    
    if(loading){
        return <LinearProgress />;
    }
    
    if(!loggedIn){
        return <SignIn admin={true}/>;
    }
    
    return (
        <>
            <Box sx={{ flexGrow: 1}}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
                    {currentCustomers.map((customer, index) => (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <CustomerBody customer={customer}/>
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
                    count={Math.ceil(allcustomers.length / customersPerPage)}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                />
            </Box>
        </>
    );
}