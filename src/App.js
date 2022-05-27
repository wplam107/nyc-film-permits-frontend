import React, { useState, useEffect } from 'react';
import db from "./utils/firebase";
import bbox from "@turf/bbox";

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
  const [inclusive, setInclusive] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [lastStart, setLastStart] = useState([]);
  const [counter, setCounter] = useState(0);
  const [permitId, setPermitId] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const allData = await getData(db, country, category, sortOrder, inclusive, cursor, lastStart, setLastStart);
      const [sData, pData, n, m] = allData;
      setStreetData(sData);
      setPermitData(pData);
      return [n, m];
    }
    fetchData().then((data) => {
      const newLastStart = lastStart;
      if (inclusive !== "Yes") {
        if (data[0] !== undefined && data[1] !== undefined) {
          newLastStart.push(data[0]);
          newLastStart.push(data[1]);
          setLastStart(newLastStart);
        }
      } else {
        newLastStart.pop();
        newLastStart.pop();
        setLastStart(newLastStart);
      };
    });
  }, [country, category, sortOrder, counter])

  return (
    <div className="App">
      <header>
        <h1>NYC Film Map</h1>
      </header>
      <div className="content">
        <div className="flex-container">
          <Sidebar
            setCountry={setCountry}
            setCategory={setCategory}
            setLastStart={setLastStart}
            setInclusive={setInclusive}
            setCursor={setCursor}
            setCounter={setCounter}
            counter={counter}
          />
          <MapComponent streetData={streetData} permitId={permitId} setPermitId={setPermitId} />
        </div>
        <div className="cards-container">
          <Cards
            permitData={permitData}
            setInclusive={setInclusive}
            lastStart={lastStart}
            setCursor={setCursor}
            setCounter={setCounter}
            counter={counter}
            setPermitId={setPermitId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
