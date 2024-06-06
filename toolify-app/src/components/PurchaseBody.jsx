import * as React from 'react';
import PoBody from "./PoBody"
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export default function PurchaseBody({ order }) {
    return (
        <>
            <Box sx={{ minWidth: 275 }}>
                <Card variant="outlined">

                    <React.Fragment>
                        <CardContent>
                            <Typography variant='h5'>{order.toolName}</Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {formatDate(order.date)}
                            </Typography>
                            <Box sx={{ textAlign: 'center' }}>
                                <PoBody order={order} />
                            </Box>
                        </CardContent>
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}