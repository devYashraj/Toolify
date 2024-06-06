import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
} from '@mui/x-charts/colorPalettes';


let data = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
  { id: 3, value: 20, label: 'series C' },
  { id: 4, value: 20, label: 'series C' },
  { id: 5, value: 200, label: 'series C' },
];

const categories = {
  blueberryTwilight: blueberryTwilightPalette,
  mangoFusion: mangoFusionPalette,
  cheerfulFiesta: cheerfulFiestaPalette,
};


export default function PieReport({ chartData }) {
  console.log(chartData)
  data = chartData

  const theme = useTheme();
  const [colorScheme, setColorScheme] = React.useState('mangoFusion');
  const [colorMode, setColorMode] = React.useState(theme.palette.mode);
  const newTheme = createTheme({ palette: { mode: colorMode } });
  const colorArray = [
    '#1f77b4',
    '#d62728',
    '#2ca02c',
    '#8c564b',
    '#9467bd',
    '#e377c2',
    '#7f7f7f',
    '#17becf',
    '#ff7f0e',
    '#bcbd22',
  ]
  return (
    <>
      <PieChart
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={200}
        colors={mangoFusionPalette}
      />
    </>
  );
}
