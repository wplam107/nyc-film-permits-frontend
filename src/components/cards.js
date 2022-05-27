import dateToString from '../utils/datetostring';

function Cards({ permitData, setInclusive, lastStart, setCursor, setCounter, counter }) {
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
    cardsHeader = `From ${initial} to ${final}`;
    leftButton = "-100";
    rightButton = "+100";
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
        <div className="date-range">
          <strong>{cardsHeader}</strong>
        </div>
        <ul className="card-list">
          {permitData.map((doc) => makeCard(doc))}
        </ul>
      </div>
      <button type="button" className="page-click-right" onClick={rightClick}><strong>{rightButton}</strong></button>
    </div>
  );
}

function makeCard(doc) {
  const key = doc["Event ID"];
  const country = ABBR[doc["Country"]].toUpperCase();
  const flag = country.replace(
    /./g,
    char => String.fromCodePoint(char.charCodeAt(0)+127397)
  );
  
  return (
    <li key={key} className="card-container">
      <ul className="card">
        <li className="card-text"><strong>ID:</strong> {key}</li>
        <li className="card-text"><strong>Country:</strong> {flag}</li>
        <li className="card-text"><strong>Start:</strong> {dateToString(doc["Start Date"])}</li>
        <li className="card-text"><strong>End:</strong> {dateToString(doc["End Date"])}</li>
        <li className="card-text"><strong>Category:</strong> {doc["Category"]}</li>
        <li className="card-text"><strong>Subcategory:</strong> {doc["Subcategory"]}</li>
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