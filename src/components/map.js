import React from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
// import { getDefaultNormalizer } from '@testing-library/react';
import { heatmapLayer, streetStyle } from "./map-style";


/* eslint-disable */
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;

function MapComponent({ streetData }) {
  const sw = new mapboxgl.LngLat(-74.29831402851386, 40.47709759728934);
  const ne = new mapboxgl.LngLat(-73.68170635481768, 40.933078683238875);
  const initBounds = new mapboxgl.LngLatBounds(sw, ne);

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
      </Map>
    </div>
  );
}

export default MapComponent;