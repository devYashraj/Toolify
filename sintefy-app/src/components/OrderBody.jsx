import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { saveAs } from 'file-saver'
import QuotationBody from './QuotationBody.jsx';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import { LinearProgress } from '@mui/material';
import PoBody from './PoBody.jsx';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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

function ProcessList({ order }) {
  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Item>
        <ListItem>
          <ListItemIcon>
            <PrecisionManufacturingIcon className="iconButton" sx={{ color: 'green' }} />
          </ListItemIcon>

          <ListItemText
            primary={order.toolName}
            secondary={formatDate(order.date)}
            sx={{color:'black'}}
          />
        </ListItem>
      </Item>
    </Box>
  );
}

async function downloadFile(filepath) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}sint/retrieve/download/${encodeURIComponent(filepath)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob'
    });

    saveAs(new Blob([response.data]), "drawing.pdf");
  }
  catch (error) {
    console.log(error);
  }
}

const CardBody = ({ order, status }) => (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div">
        {order.toolName}
      </Typography>

      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {formatDate(order.date)}
      </Typography>
      <Typography variant="body2">
        Delivery Address
        <br />
        {order.address}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => downloadFile(order.filepath)} download>Download Drawing</Button>
      {status === "ready" && <QuotationBody
        quote={
          order.quotation.length === 1 &&
          order.quotation[0].itemName === "empty" &&
          order.quotation[0].qty === 0 &&
          order.quotation[0].price === 0
        }
        quotation={order.quotation}
        toolName={order.toolName}
        orderId={order._id}
        order={order}
      />}
      <PoBody orderId={order._id} delivered={false} admin={false}/>
    </CardActions>
  </React.Fragment>
);

export default function OrderBody({ order, status }) {
  if (!order || !order.toolName || !order.custId) {
    return <LinearProgress />
  }
  console.log("Here",order)
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        {status === "pending" && <CardBody order={order} status={status} />}
        {status === "ready" && <CardBody order={order} status={status} />}
        {status === "processing" && <ProcessList order={order} />}
        {status === "delivered" && <CardBody order={order} status={status} />}
      </Card>
    </Box>
  );
}