'use client';

import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { useUsdBtcData } from './hooks/useUsdBtcData'; // Changed hook import

const timeframes = [
  { label: '1년', value: '1Y' },
  { label: '10년', value: '10Y' },
  { label: '20년', value: '20Y' } // Changed 100년 to 20년
];

export default function UsdBtcChart() { // Changed component name
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const { data, loading, error } = useUsdBtcData(selectedTimeframe); // Changed hook usage

  const getChartOptions = (data) => ({
    chart: {
      type: 'line',
      zoomType: 'x',
      style: { fontFamily: 'Arial, sans-serif' }
    },
    title: {
      text: `USD/BTC 가격 차트 (${timeframes.find(t => t.value === selectedTimeframe).label})`, // Changed title
      style: { fontSize: '20px', fontWeight: 'bold' }
    },
    subtitle: {
      text: 'Source: Public API', // Changed subtitle
      style: { fontSize: '12px' }
    },
    xAxis: {
      type: 'datetime',
      title: { text: '날짜/연도', style: { fontSize: '14px' } },
      labels: { format: '{value:%Y-%m-%d}', rotation: -45, align: 'right' },
      gridLineWidth: 1,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      title: { text: 'USD/BTC 가격', style: { fontSize: '14px' } }, // Changed yAxis title
      labels: { format: '{value:,.2f}' },
      gridLineWidth: 1
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%Y-%m-%d}<br>가격: {point.y:,.2f}', // Changed tooltip text
      valueDecimals: 2,
      shared: true,
      crosshairs: true
    },
    series: [{
      name: 'USD/BTC', // Changed series name
      data: data,
      color: '#f7931a', // Bitcoin orange color
      lineWidth: 2,
      marker: { enabled: data.length < 100, radius: 4 }
    }],
    plotOptions: {
      series: {
        animation: { duration: 1500 },
        states: { hover: { lineWidth: 3 } }
      }
    },
    legend: { enabled: false },
    credits: {
      enabled: true,
      text: 'Data: Public API', // Changed credits text
      style: { fontSize: '10px' }
    },
    responsive: {
      rules: [{
        condition: { maxWidth: 500 },
        chartOptions: {
          chart: { height: 300 },
          subtitle: { text: null },
          navigator: { enabled: false }
        }
      }]
    }
  });

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Error loading USD/BTC data: {error}</Alert> {/* Changed error message */}
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          USD/BTC 가격 히스토리 {/* Changed title */}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          1년, 10년, 20년치 USD/BTC 가격 데이터 {/* Changed description */}
        </Typography>
        <Box mb={3}>
          <ButtonGroup variant="contained" aria-label="timeframe selection">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                variant={selectedTimeframe === timeframe.value ? 'contained' : 'outlined'}
                color="primary"
              >
                {timeframe.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <Box position="relative" minHeight={400}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" position="absolute" top={0} left={0} right={0} bottom={0}>
              <CircularProgress />
            </Box>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={getChartOptions(data)} />
          )}
        </Box>
      </Paper>
    </Box>
  );
}
