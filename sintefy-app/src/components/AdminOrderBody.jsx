import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { saveAs } from 'file-saver'
import { Link } from 'react-router-dom';
import QuotationBody from './QuotationBody';
import PoBody from "./PoBody"
import { LinearProgress } from '@mui/material';

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

async function downloadFile(filepath) {
  try {
    const token = localStorage.getItem("adminToken");
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

const CardBody = ({ order }) => (
  <React.Fragment>
    <CardContent>
      <Typography variant="h6" component="div">
        {order.toolName + " - " + (order.custId && order.custId.companyName)}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {formatDate(order.date)}
      </Typography>
      <Typography variant="body2">
        Ship to:-
        <br />
        {order.custId.name + " at " + order.address}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => downloadFile(order.filepath)} download>Download Drawing</Button>
      {
        (order.quotation && order.quotation.length === 1 &&
          order.quotation[0].itemName === "empty" &&
          order.quotation[0].qty === 0 &&
          order.quotation[0].price === 0)
          ?
          <Link
            to={`/admin-dash/sendquote/${order._id}`}
            className="sendQuote2"
            sx={{ marginLeft: 'auto' }}>
            Quotation Pending
          </Link>
          :

          order.quotation && <QuotationBody
            quote={
              order.quotation.length === 1 &&
              order.quotation[0].itemName === "empty" &&
              order.quotation[0].qty === 0 &&
              order.quotation[0].price === 0
            }
            quotation={order.quotation}
            toolName={order.toolName}
            flag="admin"
          />

      }

    </CardActions>
  </React.Fragment>
);

const CardBody1 = ({ order, status }) => (
  <React.Fragment>
    <CardContent>
      <Typography variant="h6" component="div">
        {order.toolName + " - " + order.custId.companyName}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {formatDate(order.date)}
      </Typography>
      <Typography variant="body2">
        Ship to:-
        <br />
        {order.custId.name + " at " + order.address}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => downloadFile(order.filepath)} download>Download Drawing</Button>
      {
        (order.quotation.length === 1 &&
          order.quotation[0].itemName === "empty" &&
          order.quotation[0].qty === 0 &&
          order.quotation[0].price === 0)
          ?
          <Link
            to={`/admin-dash/sendquote/${order._id}`}
            className="sendQuote2"
            sx={{ marginLeft: 'auto' }}>
            Quotation Pending
          </Link>
          :

          <QuotationBody
            quote={
              order.quotation.length === 1 &&
              order.quotation[0].itemName === "empty" &&
              order.quotation[0].qty === 0 &&
              order.quotation[0].price === 0
            }
            quotation={order.quotation}
            toolName={order.toolName}
            flag="admin"
          />

      }
    </CardActions>
  </React.Fragment>
);

const CardBody2 = ({ order, status }) => (
  <React.Fragment>
    <CardContent>
      <Typography variant="h6" component="div">
        {"PO for: " + order.toolName + " - " + order.custId.companyName}
      </Typography>
      <Typography variant="body2">
        Purchase Order Sent by
        <br />
        {order.custId.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {formatDate(order.date)}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => downloadFile(order.filepath)} download>Download Drawing</Button>
      <QuotationBody
        quote={
          order.quotation.length === 1 &&
          order.quotation[0].itemName === "empty" &&
          order.quotation[0].qty === 0 &&
          order.quotation[0].price === 0
        }
        quotation={order.quotation}
        toolName={order.toolName}
        flag="admin"
      />
      <PoBody orderId={order._id} delivered={false} admin={true}/>
    </CardActions>
  </React.Fragment>
)

const CardBody3 = ({ order, status }) => (
  <React.Fragment>
    <CardContent>
      <Typography variant="h6" component="div">
        {order.toolName + " - " + order.custId.companyName}
      </Typography>
      <Typography variant="body2">
        Delivered to:-
        <br />
        {order.custId.name + " at " + order.address}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Delivery time:- {formatDate(order.date)}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => downloadFile(order.filepath)} download>Download Drawing</Button>
      <QuotationBody
        quote={
          order.quotation.length === 1 &&
          order.quotation[0].itemName === "empty" &&
          order.quotation[0].qty === 0 &&
          order.quotation[0].price === 0
        }
        quotation={order.quotation}
        toolName={order.toolName}
        flag="admin"
      />
      <PoBody orderId={order._id} delivered={true} admin={true}/>
    </CardActions>
  </React.Fragment>
)

export default function AdminOrderBody({ order, status }) {
  if (!order || !order.toolName || !order.custId) {
    return <LinearProgress />
  }
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        {status === "pending" && <CardBody1 order={order} status={status} />}
        {status === "processing" && <CardBody2 order={order} status={status} />}
        {status === "delivered" && <CardBody3 order={order} status={status} />}
      </Card>
    </Box>
  );
}