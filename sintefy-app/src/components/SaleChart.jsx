import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const dataset = [
  {
    seoul: 10,
    month: 'Jan',
  },
  {
    seoul: 28,
    month: 'Fev',
  },
  {
    seoul: 21,
    month: 'Mar',
  },
  {
    seoul: 11,
    month: 'Apr',
  },
  {
    seoul: 12,
    month: 'May',
  },
  {
    seoul: 13,
    month: 'June',
  },
  {
    seoul: 7,
    month: 'July',
  },
  {
    seoul: 24,
    month: 'Aug',
  },
  {
    seoul: 6,
    month: 'Sept',
  },
  {
    seoul: 4,
    month: 'Oct',
  },
  {
    seoul: 7,
    month: 'Nov',
  },
  {
    seoul: 24,
    month: 'Dec',
  },
];

const valueFormatter = (value) => `${value}`;

const chartSetting = {
  yAxis: [
    {
      label: 'Orders',
    },
  ],
  series: [{ dataKey: 'monthlyorders', label: 'Monthly Orders 2024', valueFormatter }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

export default function SaleChart({monthlyOrders}) {
  const tickPlacement = "middle";
  const tickLabelPlacement = "middle";

  return (
    <div style={{ width: '100%' }}>
      <BarChart
        dataset={monthlyOrders}
        xAxis={[
          { scaleType: 'band', dataKey: 'month', tickPlacement, tickLabelPlacement },
        ]}
        {...chartSetting}
      />
    </div>
  );
}