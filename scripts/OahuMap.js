
// Input GeoJSON
const reefData = {
  "type": "FeatureCollection",
  "features": [
        {
     "type": "Feature",
     "properties": {
       "marker-color": "#b50916",
       "name": "Maunalua Beach Bay"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-157.7256809877041, 21.26149342810224]
      }
    },
    {
      "type": "Feature",
      "properties": {
            "name": "Maunalua Beach Bay",
            "dilemma": "TEST DILEMMA",
            "choices": [
              { "label": "choice1"},
              { "label": "choice2"},
              { "label": "choice3"}
            ],
            "stroke": "#e17f2a",
            "fill": "#e08e45"
      },
      "geometry": {
            "type": "Polygon",
            "coordinates": [
            [
                  [-157.70466051284626, 21.259299602174437],
                  [-157.70943129395155, 21.2592998046281],
                  [-157.7115511829742, 21.261110849675532],
                  [-157.71119879484337, 21.264075130235724],
                  [-157.70872806820267, 21.268685670008495],
                  [-157.70925624703327, 21.272636504574393],
                  [-157.70854769942153, 21.277411130884573],
                  [-157.70996000078696, 21.279222548204785],
                  [-157.71279149082807, 21.281525241117365],
                  [-157.7149131769268, 21.282676122130894],
                  [-157.71667990089654, 21.283004888310188],
                  [-157.71897771196478, 21.28448402290074],
                  [-157.72198486665084, 21.28414705322882],
                  [-157.72180636180843, 21.282340864451314],
                  [-157.72392317155928, 21.280862569229058],
                  [-157.7278076818471, 21.281190316341025],
                  [-157.73345360091142, 21.282005344674104],
                  [-157.73310563345342, 21.27971400994167],
                  [-157.73593239508898, 21.279550127826795],
                  [-157.73610244087166, 21.28118745039386],
                  [-157.73752063971762, 21.27987785872709],
                  [-157.73999324328682, 21.27987785872709],
                  [-157.743174972091, 21.280373109207048],
                  [-157.7440619971232, 21.278399366972963],
                  [-157.75006963613524, 21.277411465968854],
                  [-157.75482608815432, 21.276256806817713],
                  [-157.7539487764978, 21.27411789154742],
                  [-157.75851482765228, 21.27329421525816],
                  [-157.76113095003296, 21.276743504503145],
                  [-157.77020277886072, 21.27230726660234],
                  [-157.77639424972497, 21.269837510875305],
                  [-157.77904622109077, 21.266050316826707],
                  [-157.786464413383, 21.261111036470837],
                  [-157.7908680715161, 21.258314964432813],
                  [-157.79033996403393, 21.25568046266376],
                  [-157.79351160576394, 21.254859525789797],
                  [-157.7963289128544, 21.257001487801944],
                  [-157.79563575895975, 21.25370591721108],
                  [-157.70466051284626, 21.259299602174437]
            ]

                           ]
    } 
    }
  ]
};

let geojson; // Declare outside for scope

document.addEventListener("DOMContentLoaded", function () {
  // Initalize the map
      var OahuMap = L.map('main-map').setView([21.255651, -157.791476], 10);
      
      // Add OpenStreetMap tiles
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             maxZoom: 19,
             attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(OahuMap);
  
    // Replace manual markers
    geojson = L.geoJSON(reefData, {
            pointToLayer: function (feature, latlng) {
                  // No popup
                  return L.circleMarker(latlng, {
                        radius: 8,
                        fillColor: feature.properties["marker-color"] || "#3388ff",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                  });
            },
            style: function (feature) {
                  // Applies only to polygons
                  return {
                        color: feature.properties.stroke || "#3388ff",
                        fillColor: feature.properties.fill || "#3388ff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.5
                  };
            },
      
            onEachFeature: function (feature, layer) {
              // Only bind popup if not a Point
              if (feature.geometry.type !== "Point") {
                const props = feature.properties;
                const index = reefData.features.indexOf(feature);
              
            // Popup Setup
            // Delete first popupContent to condense
                // Shows summary & button
                const popupContent = `<strong>${props.name}</strong><br>${props.dilemma || ""}<br><br><button onclick="openDilemmaPanel(${index})">Take Action</button>`;
              
                layer.bindPopup(popupContent);
                
                  layer.on({
                      mouseover: highlightFeature,
                      mouseout: resetHighlight
                });
              }
            }
      }).addTo(OahuMap);

});

// Highlight on polygon when hovered
function highlightFeature(e) {
      const layer = e.target;
      layer.setStyle({
            weight: 3,
            color: '#ffcc00',
            fillOpacity: 0.7            
      });
}

function resetHighlight(e) {
      geojson.resetStyle(e.target);
}


// Dilemma Panel Logic
function openDilemmaPanel(index) {
  const feature = reefData.features[index];
  const props = feature.properties;

  // Panel HTML
  const panel = document.getElementById('dilemma-panel');
  panel.innerHTML = `
    <div class="decision-header">
      <button class="close-btn" onclick="closeDilemmaPanel()"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
      <h2>${props.name}</h2>
     </div>
     <div class="choices">
      ${props.choices.map((choice, i) => `
        <div class="choice-card">
        <h3>${choice.title || `[POLICY TITLE]`}</h3>
        <p>${choice.description || `Policy Description`}</p>
        <button class="authorize-btn" onclick="handleChoice(${i})">Authorize</button>
       </div>
      `).join('')}
     </div>
  `;
  panel.style.display = 'block';
}

function closeDilemmaPanel() {
  document.getElementById('dilemma-panel').style.display = 'none';
}

// Feedback