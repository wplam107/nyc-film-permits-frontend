import React, { useState, useEffect } from 'react';
import db from "./utils/firebase";

import './stylesheets/App.css';

import Sidebar from './components/sidebar';
import MapComponent from './components/map';
import Cards from './components/cards';
import getData from './utils/getdata';


function App() {
  const [country, setCountry] = useState(null);
  const [category, setCategory] = useState(null);
  const [streetData, setStreetData] = useState(null);
  const [permitData, setPermitData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    async function fetchData() {
      const allData = await getData(db, country, category, sortOrder);
      const [sData, pData] = allData;
      setStreetData(sData);
      setPermitData(pData);
    }
    fetchData();
  }, [country, category, sortOrder])

  return (
    <div className="App">
      <header>
        <h1>NYC Film Map</h1>
      </header>
      <div className="content">
        <div className="flex-container">
          <Sidebar setCountry={setCountry} setCategory={setCategory} />
          <MapComponent streetData={streetData} />
        </div>
        <div className="cards-container">
          <Cards permitData={permitData} />
        </div>
      </div>
    </div>
  );
}

export default App;
