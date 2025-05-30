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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useUsdKrwCsvData } from './hooks/useUsdKrwCsvData';

const timeframes = [
  { label: '1년', value: '1Y' },
  { label: '10년', value: '10Y' },
  { label: '100년', value: '100Y' }
];

function formatDate(ts, timeframe) {
  const d = new Date(ts);
  if (timeframe === '1Y') {
    return d.toISOString().slice(0, 10);
  } else {
    return d.getFullYear();
  }
}

export default function UsdKrwChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const { data, loading, error } = useUsdKrwCsvData(selectedTimeframe);
  const [selectedPoints, setSelectedPoints] = useState([]); // [{x, y}]

  // Reset selection on timeframe change
  function handleTimeframeChange(tf) {
    setSelectedTimeframe(tf);
    setSelectedPoints([]);
  }

  // Highcharts options with point click event
  const getChartOptions = (data) => ({
    chart: {
      type: 'line',
      zoomType: 'x',
      style: { fontFamily: 'Arial, sans-serif' }
    },
    title: {
      text: `USD/KRW 환율 차트 (${timeframes.find(t => t.value === selectedTimeframe).label})`,
      style: { fontSize: '20px', fontWeight: 'bold' }
    },
    subtitle: {
      text: 'Source: @data/usd_krw_*.csv',
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
      title: { text: 'USD/KRW 환율', style: { fontSize: '14px' } },
      labels: { format: '{value:,.2f}' },
      gridLineWidth: 1
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%Y-%m-%d}<br>환율: {point.y:,.2f}',
      valueDecimals: 2,
      shared: true,
      crosshairs: true
    },
    series: [{
      name: 'USD/KRW',
      data: data,
      color: '#1976d2',
      lineWidth: 2,
      marker: {
        enabled: data.length < 100,
        radius: 4,
        states: {
          select: {
            fillColor: '#ff9800',
            lineColor: '#ff9800',
            radius: 7
          }
        }
      },
      states: {
        select: {
          color: '#ff9800',
          lineWidth: 4
        }
      },
      point: {
        events: {
          click: function () {
            const { x, y } = this;
            // Use global setSelectedPoints
            if (typeof window !== 'undefined' && window.setUsdKrwSelectedPoints) {
              window.setUsdKrwSelectedPoints({ x, y });
            }
          }
        }
      }
    }],
    plotOptions: {
      series: {
        allowPointSelect: true,
        animation: { duration: 1500 },
        states: { hover: { lineWidth: 3 } }
      }
    },
    legend: { enabled: false },
    credits: {
      enabled: true,
      text: 'Data: usd_krw_*.csv',
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

  // Bridge for Highcharts point click to React state
  if (typeof window !== 'undefined') {
    window.setUsdKrwSelectedPoints = (point) => {
      setSelectedPoints((prev) => {
        // 이미 선택된 점이면 무시
        if (prev.find(p => p.x === point.x && p.y === point.y)) return prev;
        // 두 점 선택되면 초기화 후 새로 시작
        if (prev.length >= 2) return [point];
        return [...prev, point];
      });
    };
  }

  // 비교 결과 계산
  let compareTable = null;
  if (selectedPoints.length === 2) {
    const [a, b] = selectedPoints;
    const dateA = formatDate(a.x, selectedTimeframe);
    const dateB = formatDate(b.x, selectedTimeframe);
    const valueA = a.y;
    const valueB = b.y;
    // 퍼센트 변화율 계산
    const percentChange = valueA !== 0 ? ((valueB - valueA) / valueA) * 100 : 0;
    let diffPeriod;
    if (selectedTimeframe === '1Y') {
      const days = Math.round((b.x - a.x) / (1000 * 60 * 60 * 24));
      diffPeriod = `${days}일`;
    } else {
      diffPeriod = `${Math.abs(new Date(b.x).getFullYear() - new Date(a.x).getFullYear())}년`;
    }
    compareTable = (
      <TableContainer component={Paper} sx={{ mt: 4, maxWidth: 500 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">구분</TableCell>
              <TableCell align="center">첫 번째 점</TableCell>
              <TableCell align="center">두 번째 점</TableCell>
              <TableCell align="center">변화율(%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">날짜/연도</TableCell>
              <TableCell align="center">{dateA}</TableCell>
              <TableCell align="center">{dateB}</TableCell>
              <TableCell align="center">{diffPeriod}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">환율</TableCell>
              <TableCell align="center">{valueA.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              <TableCell align="center">{valueB.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              <TableCell align="center">{percentChange > 0 ? '+' : ''}{percentChange.toLocaleString(undefined, { maximumFractionDigits: 2 })}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Error loading USD/KRW data: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          USD/KRW 환율 히스토리
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          1년, 10년, 100년치 실제 원/달러 환율 데이터
        </Typography>
        <Box mb={3}>
          <ButtonGroup variant="contained" aria-label="timeframe selection">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.value}
                onClick={() => handleTimeframeChange(timeframe.value)}
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
        {compareTable}
      </Paper>
    </Box>
  );
} 
