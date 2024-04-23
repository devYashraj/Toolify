import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const CardBody = ({ customer }) => (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div">
        {customer.companyName}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Owner: {customer.name}
      </Typography>
      <Typography variant="body2">
        Email: {customer.email}
      </Typography>
      <Typography variant="body2">
        Ph No: {customer.phno}
      </Typography>
    </CardContent>
  </React.Fragment>
);

export default function OrderBody({ customer }) {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardBody customer={customer} />
      </Card>
    </Box>
  );
}