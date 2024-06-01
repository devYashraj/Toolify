import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PieReport from "../components/PieReport"
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import axios from 'axios'
import {Typography} from '@mui/material';
export default function Reports() {

    const [year, setyear] = React.useState(new Date().getFullYear());
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    let yearArray = [];
    for (let i = 2023; i <= new Date().getFullYear(); i++)
        yearArray.push(i);
    const handleChange = (event) => {
        setyear(event.target.value);
    };

    function loadData(saleData) {
        const newData = saleData.map((item, i) => ({
            id: i,
            value: item.totalOrders,
            label: item.companyName
        }));;
        setLoading(false);
        return newData;
    }

    useEffect(() => {
        async function getChartData() {
            try {
                setLoading(true);
                const token = localStorage.getItem("adminToken");
                const response = await axios.get(`${baseUrl}sint/retrieve/yearlysales/${year}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.status === 200) {
                    const saleData = response.data.saleData;
                    setData(loadData(saleData));
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        getChartData();
    }, [year]);

    return (
        <>
            <Box sx={{ maxWidth: 150, minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={year}
                        label="year"
                        onChange={handleChange}
                    >
                        {yearArray.map((val) => (
                            <MenuItem value={val}> {val}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box >
            {loading ? <CircularProgress /> : <PieReport chartData={data} />
            }
        </>
    )
}