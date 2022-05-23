// const MAX_ZOOM_LEVEL = 20;

export const heatmapLayer = {
  'id': 'streets-heat',
  'type': 'heatmap',
  'source': 'streets-data',
  'maxzoom': 12.5,
  'paint': {
    // Increase the heatmap weight based on frequency
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'mag'],
      0,
      0,
      12,
      1
    ],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1.5,
      12,
      3
    ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      1,
      'rgb(178,24,43)'
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      2,
      9,
      12
    ],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      8,
      1,
      12,
      0
    ]
  }
};

export const streetStyle = {
  id: "streets",
  source: "street-data",
  type: "line",
  minzoom: 9.5,
  paint: {
    "line-width": 3,
    "line-color": [
      "interpolate",
      ["linear"],
      ["zoom"],
      9.5,
      'rgb(253,219,199)',
      10.5,
      "rgb(239,138,98)",
      13,
      "rgb(178,24,43)"
    ],
    "line-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      10,
      0,
      14,
      1
    ]
  }
};