import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import db from "../utils/firebase";

import '../stylesheets/sidebar.css';
// import { getDefaultNormalizer } from '@testing-library/react';

function Sidebar({ setCountry, setCategory }) {
  const [sidebarCountry, setSidebarCountry] = useState(0);
  const [sidebarCategory, setSidebarCategory] = useState(0);
  const [countryOptions, setCountryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const docRef = doc(db, "metadata", "metadata");
    const docSnap = await getDoc(docRef);
    const countries = ["ALL"].concat(docSnap.data()["countries"].sort());
    const categories = docSnap.data()["categories"];
    const catKeys = ["ALL"].concat(Object.keys(categories).sort());
    setCountryOptions(countries);
    setCategoryOptions(catKeys);
    setSidebarCountry(countries[0]);
    setSidebarCategory(catKeys[0]);
  }

  const handleClick = useCallback(() => {
    setCountry(sidebarCountry);
    setCategory(sidebarCategory);
  }, [setCountry, setCategory, sidebarCountry, sidebarCategory]);

  return(
    <div className="sidebar">
      <div className="filter-title">FILTERS</div>
      <MapFilters
        options={countryOptions}
        onOptionChange={setSidebarCountry}
        defaultSelection={sidebarCountry}
      />
      <MapFilters
        options={categoryOptions}
        onOptionChange={setSidebarCategory}
        defaultSelection={sidebarCategory}
      />
      <button type="button" className="retrieve" onClick={handleClick}>Retrieve</button>
    </div>
  );
}

function MapFilters({ options, onOptionChange, defaultSelection }) {
  const [selected, setSelected] = useState(defaultSelection);

  const handleClick = useCallback(event => {
    const idx = event.target.value;
    const opt_idx = options[idx];
    onOptionChange(opt_idx);
    setSelected(idx);
  }, [options, onOptionChange]);

  function Option(ele, idx, selected) {
    const isSelected = idx === selected ? "selected side-item" : "side-item";
    return (
      <li key={ele} className={isSelected} onClick={handleClick} value={idx}>
        {ele}
      </li>
    );
  }

  return (
    <ul className="side-list">
      {options.map((ele, idx) => Option(ele, idx, selected))}
    </ul>
  );
}

export default Sidebar;