import dateToString from '../utils/datetostring';
import { LIMIT } from "../configurations";
import { useCallback } from 'react';

function Cards({ permitData, setInclusive, lastStart, setCursor, setCounter, counter, setPermitId }) {
  let cardsHeader, leftButton, rightButton;
  if (permitData.length !== 0) {
    let initial, final;
    const first = new Date(permitData[0]["Start Date"]);
    const last = new Date(permitData[permitData.length - 1]["Start Date"]);
    if (first <= last) {
      initial = permitData[0]["Start Date"];
      final = permitData[permitData.length - 1]["Start Date"];
    } else {
      final = permitData[0]["Start Date"];
      initial = permitData[permitData.length - 1]["Start Date"];
    };
    initial = dateToString(initial);
    final = dateToString(final);
    cardsHeader = `From ${initial} to ${final} - Ordered by latest 100`;
    leftButton = "<" + LIMIT;
    rightButton = LIMIT + ">";
  } else {
    cardsHeader = "Select Filters";
  };

  function leftClick() {
    if (lastStart.length >= 4) {
      setInclusive("Yes");
      setCursor(lastStart[lastStart.length-4]);
      setCounter(counter + 1);
    }
  }
  function rightClick() {
    setInclusive("No");
    setCursor(lastStart[lastStart.length-1]);
    setCounter(counter + 1);
  }
  return (
    <div className="cards-outer">
      <button type="button" className="page-click-left" onClick={leftClick}><strong>{leftButton}</strong></button>
      <div className="cards-inner">
        <div className="cards-header">
          {cardsHeader}
        </div>
        <ul className="card-list">
          {permitData.map((doc) => <Card doc={doc} setPermitId={setPermitId} />)}
        </ul>
      </div>
      <button type="button" className="page-click-right" onClick={rightClick}><strong>{rightButton}</strong></button>
    </div>
  );
}

function Card({ doc, setPermitId }) {
  const key = doc["Event ID"];
  const country = ABBR[doc["Country"]].toUpperCase();
  const flag = country.replace(
    /./g,
    char => String.fromCodePoint(char.charCodeAt(0)+127397)
  );

  function handleClick() {
    setPermitId(false);
    setPermitId(key);
  }
  
  return (
    <li key={key} className="card-container" onClick={handleClick}>
      <ul className="card">
        <li className="card-text" key={`id-${key}`}><strong>ID:</strong> {key}</li>
        <li className="card-text" key={`country-${key}`}><strong>Country:</strong> {flag}</li>
        <li className="card-text" key={`sd-${key}`}><strong>Start:</strong> {dateToString(doc["Start Date"])}</li>
        <li className="card-text" key={`ed-${key}`}><strong>End:</strong> {dateToString(doc["End Date"])}</li>
        <li className="card-text" key={`cat-${key}`}><strong>Category:</strong> {doc["Category"]}</li>
        <li className="card-text" key={`subcat-${key}`}><strong>Subcategory:</strong> {doc["Subcategory"]}</li>
      </ul>
    </li>
  );
}

const ABBR = {
  "Australia": "AU",
  "Canada": "CA",
  "France": "FR",
  "Germany": "DE",
  "Ireland": "IE",
  "Japan": "JP",
  "Netherlands": "NL",
  "Panama": "PA",
  "United Kingdom": "GB",
  "United States of America": "US"
};

export default Cards;