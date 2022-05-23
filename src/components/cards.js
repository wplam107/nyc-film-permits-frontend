import dateToString from '../utils/datetostring';

function Cards({ permitData }) {
  if (permitData.length !== 0) {
    const first = new Date(permitData[0]["Start Date"]);
    const last = new Date(permitData[permitData.length - 1]["Start Date"]);
    let initial, final;
    if (first <= last) {
      initial = permitData[0]["Start Date"];
      final = permitData[permitData.length - 1]["Start Date"];
    } else {
      final = permitData[0]["Start Date"];
      initial = permitData[permitData.length - 1]["Start Date"];
    }
    return (
      <div className="cards-outer">
        <button type="button" className="page-click-left"></button>
        <div className="cards-inner">
          <div className="date-range">
            From <strong>{dateToString(initial)}</strong> To <strong>{dateToString(final)}</strong>
          </div>
          <ul className="card-list">
            {permitData.map((doc) => makeCard(doc))}
          </ul>
        </div>
        <button type="button" className="page-click-right"></button>
      </div>
    );
  }
}

function makeCard(doc) {
  const key = doc["Event ID"];
  const flag = ABBR[doc["Country"]].toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0)+127397));
  
  return (
    <li key={key} className="card-container">
      <ul className="card">
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
  "United Kingdom": "UK",
  "United States of America": "US"
};

export default Cards;