
import axios from 'axios';
import { useDebugValue, useEffect, useState } from 'react';
import './App.css';

const HandleFiltering = ({filteredData, setFilteredData, searchTerm, setSearchTerm}) => {

  const [weatherData, setWeather] = useState([]);
  const [newSearchTerm, setTerm] = useState('San jose')

  useEffect(() => {
    axios.get(`http://api.weatherstack.com/current?access_key=c38b3a5ac0f1e41189afeebd496454cc&query=${newSearchTerm}`)
    .then(response => setWeather(response.data));
  },[newSearchTerm])


  if(filteredData.length <= 10 && filteredData.length > 1 ){
   return filteredData.map((country) => {
     return(
      <>
      <p key={country.name.common}>{country.name.common} <button key={country.name.common} onClick={() => setFilteredData([country])}>show</button></p>
      </>
     ) 
    })
  } else if(filteredData.length === 1) {
    var newArrayDataOfOjbect = Object.values(filteredData[0].languages);

    setTerm(filteredData[0].name.common);
  
    console.log(weatherData)

    return(
      <>
      <h1>{filteredData[0].name.official}</h1>
      <p>Capital: {filteredData[0].capital}</p>
      <p>Area: {filteredData[0].area}</p>
      <h4>Languages</h4>
      <ul>
      {
        newArrayDataOfOjbect.map((language) => {
          return(
            <li key={language}>{language}</li>
          )
        })
      }
      </ul>
      <img src={filteredData[0].flags.png}/>
      <h1>Current weather in {filteredData[0].capital}</h1>

       {weatherData.length !== 0 ? <p>{weatherData.current.temperature} degrees</p> : <p></p>}

      </>
    ) 
  } else {
    return <p>Too many results, filter further</p>
  }
} 

function App() {

  const [searchTerm,setSearchTerm] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const filters = [];

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then(response => setCountryData(response.data))
  },[]);

  const checkSearchTerm = (country) => {
   return  country.name.common.toLowerCase().startsWith(searchTerm.substring(0,4).toLowerCase())
    ?
    (filters.push(country), setFilteredData(filters))
    : null
  }

  useEffect(() => {
    countryData.map((country) => {
      checkSearchTerm(country)
    });
  },[searchTerm]);


  return (
    <div>
   Find Countries:  <input onChange={handleChange} value={searchTerm}/>
    <HandleFiltering filteredData={filteredData} setFilteredData={setFilteredData} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
   </div>
  );
}

export default App;

//country.name.common.toLowerCase().startsWith(props.searchTerm.substring(0,3).toLowerCase())