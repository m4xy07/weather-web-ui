import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Button, Card, CardContent, Typography } from '@mui/material';
import './styles.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [dataRange, setDataRange] = useState('lastHour');

  const fetchData = async () => {
    const response = await fetch('http://host:port/data'); //Has to be the same port on which your arduino-server-manager is running
    const data = await response.json();
    setWeatherData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBoxClick = (field) => {
    if (field === 'raining') {
      setSelectedField('raining');
    } else {
      setSelectedField(field);
    }
  };

  const handleDataRangeSelect = (range) => {
    setDataRange(range);
  };

  const filteredWeatherData = weatherData.filter((item) => {
    const itemTime = new Date(item.time);
    switch (dataRange) {
      case 'lastHour':
        return itemTime >= new Date(Date.now() - 60 * 60 * 1000);
      case 'last6Hours':
        return itemTime >= new Date(Date.now() - 6 * 60 * 60 * 1000);
      case 'last24Hours':
        return itemTime >= new Date(Date.now() - 24 * 60 * 60 * 1000);
      case 'lastWeek':
        return itemTime >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case 'lastMonth':
        return itemTime >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      case 'lastYear':
        return itemTime >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      case 'allTime':
        return true;
      default:
        return false;
    }
  });

  const data = {
    labels: filteredWeatherData.map((item) => new Date(item.time).toLocaleTimeString()),
    datasets: [
      selectedField === 'raining'? (
        {
          label: 'Raining',
          data: filteredWeatherData.map((item) => item.raining === 'Yes'? 1 : 0),
          borderColor: '#ffce56',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
        }
      ) : (
        selectedField? (
          {
            label: selectedField,
            data: filteredWeatherData.map((item) => item[selectedField]),
            borderColor: '#2e7d32',
            backgroundColor: 'rgba(46, 125, 50, 0.2)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
          }
        ) : []
      ),
    ],
  };
  const options = {
    plugins: {
      categoryPercentage: {
        backgroundColor: (context) => {
          if (context.datasetIndex === 0) {
            return 'rgba(75, 192, 192, 0.4)';
          }
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => context.dataset.label + ': ' + context.parsed.y + '|' + context.parsed.x, // Display value on hover
      },
    },
  };

  return (
    <div>
      <h1 style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 'bold',
        fontSize: '3rem',
        textAlign: 'center',
        marginTop: '2rem',
        marginBottom: '2rem',
      }}>
        Realtime Weather data from Arduino | Aman Shaikh
      </h1>
      {loading? (
        <p>Loading... Please wait...</p>
      ) : (
        <div>
          <div className="box-container">
            <Card className={`box ${selectedField === 'temperature'? 'selected' : ''}`} onClick={() => handleBoxClick('temperature')}>
              <CardContent>
                <Typography variant="h6" component="p">Temperature</Typography>
                <Typography variant="body1" component="p">{parseFloat(weatherData[weatherData.length - 1].temperature).toFixed(3)}&deg;C</Typography>
              </CardContent>
            </Card>
            <Card className={`box ${selectedField === 'humidity'? 'selected' : ''}`} onClick={() => handleBoxClick('humidity')}>
              <CardContent>
                <Typography variant="h6" component="p">Humidity</Typography>
                <Typography variant="body1" component="p">{parseFloat(weatherData[weatherData.length - 1].humidity).toFixed(3)} %</Typography>
              </CardContent>
            </Card>
            <Card className={`box ${selectedField === 'aqi'? 'selected' : ''}`} onClick={() => handleBoxClick('aqi')}>
              <CardContent>
                <Typography variant="h6" component="p">AQI</Typography>
                <Typography variant="body1" component="p">{weatherData[weatherData.length - 1].aqi}</Typography>
              </CardContent>
            </Card>
           <Card className={`box ${selectedField === 'time'? 'selected' : ''}`} onClick={() => handleBoxClick('time')}>
              <CardContent>
                <Typography variant="h6" component="p">Time (Last Updated)</Typography>
                <Typography variant="body1" component="p">{new Date(weatherData[weatherData.length - 1].time).toLocaleString()}</Typography>
              </CardContent>
            </Card>
            <Card className={`box ${selectedField === 'wifiStrength'? 'selected' : ''}`} onClick={() => handleBoxClick('wifiStrength')}>
              <CardContent>
                <Typography variant="h6" component="p">Wifi Strength</Typography>
                <Typography variant="body1" component="p">{weatherData[weatherData.length -1].wifiStrength}</Typography>
              </CardContent>
            </Card>
            <Card className={`box ${selectedField === 'hi'? 'selected' : ''}`} onClick={() => handleBoxClick('hi')}>
              <CardContent>
                <Typography variant="h6" component="p">Heat Index (Feels Like)</Typography>
                <Typography variant="body1" component="p">{parseFloat(weatherData[weatherData.length - 1].hi).toFixed(3)}&deg;C</Typography>
              </CardContent>
            </Card>
<Card className={`box ${selectedField === 'raining'? 'selected' : ''}`} onClick={() => handleBoxClick('raining')}>
              <CardContent>
                <Typography variant="h6" component="p">Raining</Typography>
                <Typography variant="body1" component="p">{weatherData[weatherData.length - 1].raining}</Typography>
              </CardContent>
            </Card>
          </div>
          <div className="chart-container">
            {selectedField && (
              <Line data={data} options={options} />
            )}
          </div>
          <div className="data-range-buttons">
            <Button variant="contained" color="primary" onClick={() => handleDataRangeSelect('lastHour')}>
              Last Hour
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleDataRangeSelect('last6Hours')}>
              Last 6 Hours
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleDataRangeSelect('last24Hours')}>
              Last 24 Hours
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleDataRangeSelect('lastWeek')}>
              Last Week
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleDataRangeSelect('lastMonth')}>
              Last Month
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleDataRangeSelect('lastYear')}>
              Last Year
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleDataRangeSelect('allTime')}>
              All Time
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const boxStyles = {
  border: '2px solid #000',
  borderRadius: '5px',
  padding: '10px',
  margin: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'font-weight 0.3s ease',
};

const selectedBoxStyles = {
  ...boxStyles,
  backgroundColor: '#f5f5f5',
};

const valueContainerStyles = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '5px',
  margin: '5px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default App;