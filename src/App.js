import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [countriesList, setCountriesList] = useState([])
  const [filteredCountriesList, setFilteredCountriesList] = useState([])
  const [input, setInput] = useState('')
  const timerId = useRef(null);
  const API_ENDPOINT = "https://restcountries.com/v3.1/all";
  const fetchCountriesData = async () => {
    try {
      const data = await axios.get(API_ENDPOINT);
      setCountriesList(data.data)
      setFilteredCountriesList(data.data)
    } catch (err) {
      console.error('Failed to fetch countries', err)
    }
  }
  const filterCountries = (inputVal) => {
    if (inputVal) {
      const fiteredData = countriesList.filter(country => country.name.common.toLowerCase().includes(inputVal.toLowerCase()))
      setFilteredCountriesList(fiteredData);
    }
  }

  useEffect(() => {
    fetchCountriesData()
  }, [])

  useEffect(() => {
    if (timerId.current) {
      clearTimeout(timerId.current)
    }
    timerId.current = setTimeout(() => {
      filterCountries(input)
    }, 500)
    return () => clearTimeout(timerId.current)
  }, [input])
  return (
    <div className="App">
      <div className='search-bar'>
        <input placeholder='Search for countries' type='text' value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <div className='container'>
        {filteredCountriesList && filteredCountriesList.length > 0 ?
          filteredCountriesList.map(item => {
            return <div key={item.flags.png} className='countryCard'>
              <img src={item.flags.png} alt={item.name.common} />
              <p>{item.name.common}</p>
            </div>
          })
          :
          <div> <h3>No data available</h3>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
