import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';

export default function Deposits({text, sale}) {
  return (
    <React.Fragment>
      <Title>{text}</Title>
      <Typography component="p" variant="h4">
        ₹ {sale} /-
      </Typography>
    </React.Fragment>
  );
}