import { useState, useEffect, useMemo } from 'react';
import SaleChart from '../components/SaleChart.jsx'
import SignIn from './SignIn.jsx';
import { testAdmin } from '../components/utils'
import { LinearProgress } from '@mui/material';
import Deposits from '../components/Deposits.jsx'
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function AdminDash() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saleData, setSaleData] = useState({ year: 0, month: 0 });
    const [monthdataFromApi, setMonthdataFromApi] = useState(null); 

    const initialDataset = [
        { monthlyorders: 0, month: 'Jan' },
        { monthlyorders: 0, month: 'Feb' },
        { monthlyorders: 0, month: 'Mar' },
        { monthlyorders: 0, month: 'Apr' },
        { monthlyorders: 0, month: 'May' },
        { monthlyorders: 9, month: 'June' },
        { monthlyorders: 0, month: 'July' },
        { monthlyorders: 0, month: 'Aug' },
        { monthlyorders: 0, month: 'Sept' },
        { monthlyorders: 0, month: 'Oct' },
        { monthlyorders: 0, month: 'Nov' },
        { monthlyorders: 0, month: 'Dec' },
    ];

    const dataset = useMemo(() => { 
        if (!monthdataFromApi) return initialDataset; 

        return monthdataFromApi.map((item, index) => ({
            ...initialDataset[index],
            monthlyorders: item,
        }));
    }, [monthdataFromApi, initialDataset]); 


    useEffect(() => {
        const checkAdmin = async () => {
            const res = await testAdmin();
            if (res) {
                const token = localStorage.getItem("adminToken");
                try {
                    const response = await axios.get(`${baseUrl}sint/retrieve/monthdata`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const response2 = await axios.get(`${baseUrl}sint/retrieve/salesdata`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.status === 200 && response2.status === 200) {
                        setMonthdataFromApi(response.data.monthdata); 
                        setSaleData(response2.data.saleData);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false); 
                }
            } else {
                setLoading(false); 
            }
            setLoggedIn(res);
        };
        checkAdmin();
    }, []);

    if (loading) {
        return <LinearProgress />;
    }

    if (!loggedIn) {
        return <SignIn admin={true} />;
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 6, md: 12 }} sx={{ textAlign: 'center' }}>
                    <Grid item xs={12} sm={12} md={12}>
                    <SaleChart monthlyOrders={dataset} />
                    </Grid>
                    <Grid item xs={2} sm={6} md={6}>
                        <Deposits text={"Sales this year"} sale={saleData.year} sx={{ m: 4 }} />
                    </Grid>
                    <Grid item xs={2} sm={6} md={6}>
                        <Deposits text={"Sales this month"} sale={saleData.month} sx={{ m: 4 }} />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}