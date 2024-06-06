import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Typography } from '@mui/material';
const valueFormatter = (value) => `${value}`;

const chartSetting = {
  series: [{ dataKey: 'monthlyorders', valueFormatter }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

export default function SaleChart({ monthlyOrders }) {
  const tickPlacement = "middle";
  const tickLabelPlacement = "middle";
  const monthlyOrdersValues = monthlyOrders.map(item => item.monthlyorders);
  const maxMonthlyOrders = Math.max(...monthlyOrdersValues);
  return (

    <div style={{ width: '100%' }}>
      <Typography variant="h5" component="h2">
        Monthly Orders of {new Date().getFullYear()}
      </Typography>

      <BarChart
        dataset={monthlyOrders}
        xAxis={[
          { scaleType: 'band', dataKey: 'month', tickPlacement, tickLabelPlacement },
        ]}
        yAxis={[
          {
            label: 'Orders',
            colorMap: {
              type: 'continuous',
              min: 0,
              max: maxMonthlyOrders,
              color: ['red', 'green'],
            }
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
}