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
import { useGoldData } from './hooks/useGoldData';

const timeframes = [
  { label: '1 Month', value: 'MONTH' },
  { label: '1 Year', value: 'YEAR' },
  { label: '10 Years', value: 'TEN_YEARS' },
  { label: '100 Years', value: 'HUNDRED_YEARS' }
];

export default function GoldChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('MONTH');
  const { data, loading, error } = useGoldData(selectedTimeframe);

  const getChartOptions = (data) => ({
    chart: {
      type: 'line',
      zoomType: 'x',
      style: {
        fontFamily: 'Arial, sans-serif'
      }
    },
    title: {
      text: `Gold Price Chart (${timeframes.find(t => t.value === selectedTimeframe).label})`,
      style: {
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },
    subtitle: {
      text: 'Simulated Gold Price Data',
      style: {
        fontSize: '12px'
      }
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date',
        style: {
          fontSize: '14px'
        }
      },
      labels: {
        format: '{value:%Y-%m-%d}',
        rotation: -45,
        align: 'right'
      },
      gridLineWidth: 1,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      title: {
        text: 'Gold Price (USD per Troy Ounce)',
        style: {
          fontSize: '14px'
        }
      },
      labels: {
        format: '${value:,.2f}'
      },
      gridLineWidth: 1
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%Y-%m-%d}<br>Price: ${point.y:,.2f} per troy ounce',
      valueDecimals: 2,
      shared: true,
      crosshairs: true
    },
    series: [{
      name: 'Gold Price',
      data: data,
      color: '#FFD700',
      lineWidth: 2,
      marker: {
        enabled: data.length < 100,
        radius: 4
      }
    }],
    plotOptions: {
      series: {
        animation: {
          duration: 1500
        },
        states: {
          hover: {
            lineWidth: 3
          }
        }
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: true,
      text: 'Simulated Data',
      style: {
        fontSize: '10px'
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          chart: {
            height: 300
          },
          subtitle: {
            text: null
          },
          navigator: {
            enabled: false
          }
        }
      }]
    }
  });

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Error loading gold price data: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gold Price History
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Simulated historical gold prices (USD per troy ounce) with realistic price movements and volatility patterns.
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
            >
              <CircularProgress />
            </Box>
          ) : (
            <HighchartsReact
              highcharts={Highcharts}
              options={getChartOptions(data)}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}
