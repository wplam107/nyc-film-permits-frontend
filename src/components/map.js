import { React } from 'react';
import { Map, Source, Layer, NavigationControl, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import bbox from "@turf/bbox";
// import { getDefaultNormalizer } from '@testing-library/react';
import { heatmapLayer, streetStyle } from "./map-style";


/* eslint-disable */
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
const sw = new mapboxgl.LngLat(-74.29831402851386, 40.47709759728934);
const ne = new mapboxgl.LngLat(-73.68170635481768, 40.933078683238875);
const initBounds = new mapboxgl.LngLatBounds(sw, ne);

function MapComponent({ streetData, permitId, setPermitId }) {

  function mapSources(streetData) {
    if (streetData) {
      return (
        <Source id="street-data" type="geojson" data={streetData}>
          <Layer {...heatmapLayer} />
          <Layer {...streetStyle} />
        </Source>
      );
    }
  }

  return (
    <div className="map">
      <Map
        initialViewState={{
          bounds: initBounds
        }}
        style={{width: "100%", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={mapboxToken}
      >
        {mapSources(streetData)}
        <NavigationControl position="top-left" />
        {permitId && (
          <PopupMap permitId={permitId} setPermitId={setPermitId} streetData={streetData} />
        )}
      </Map>
    </div>
  );
}

function PopupMap({ permitId, setPermitId, streetData }) {
  let minLng, minLat, maxLng, maxLat;

  function getPopupData(streetData, permitId) {
    let permitGeoms, bounds;
    streetData["features"].forEach(element => {
      if (element["properties"]["eventid"] === permitId) {
        permitGeoms = element;
        [minLng, minLat, maxLng, maxLat] = bbox(element["geometry"]);
        const popsw = new mapboxgl.LngLat(minLng - 0.001, minLat - 0.001);
        const popne = new mapboxgl.LngLat(maxLng + 0.001, maxLat + 0.001);
        bounds = new mapboxgl.LngLatBounds(popsw, popne);
      }
    });
    return [permitGeoms, bounds];
  }

  function mapPermit(permitGeo) {
    return (
      <Source id="popup-data" type="geojson" data={permitGeo}>
        <Layer {...streetStyle} />
      </Source>
    );
  }

  const popupData = getPopupData(streetData, permitId);
  const [permitGeo, popupBounds] = popupData;
  const source = mapPermit(permitGeo);

  return (
    <Popup
      anchor="top"
      longitude={maxLng}
      latitude={maxLat}
      onClose={() => setPermitId(false)}
      style={{
        width: "250px",
        height: "250px",
        "font-size": "16px",
        color: "black"
      }}
    >
      <Map
        initialViewState={{
          bounds: popupBounds
        }}
        style={{width: "200px", height: "200px"}}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={mapboxToken}
      >
        {source}
      </Map>
      {permitId}
    </Popup>
  )
}

export default MapComponent;