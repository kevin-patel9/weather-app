import React from 'react'
import { useLocation } from 'react-router-dom';

const WeatherDetail = () => {
    const location = useLocation();
    console.log(location);
    // const { data } = location?.state;

    // console.log(data);

  return (
    <div>WeatherDetail</div>
  )
}

export default WeatherDetail;