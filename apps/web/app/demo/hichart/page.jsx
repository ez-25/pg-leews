'use client';
// import { Button } from "@repo/ui/button";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Button as ButtonUI } from '@repo/ui/button';

const options = {
  title: {
    text: 'My First Chart'
  },
  series: [
    {
      data: [1, 3, 2, 4, 3,4,6,8,0]
    }
  ]
};

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);


export default function Demo() {
  return (
  <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
    <h1>hello demo</h1>
    <ButtonUI>John', 'Doe'</ButtonUI>
    <Button>mui button</Button>
    <button>basic button</button>


    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>



  </div>
  );
}


