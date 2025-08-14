 const map = L.map('map').setView([-23.5371720292331, -46.547303063619374], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    fetch('ecopontos.geojson')
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.nome) {
              layer.bindPopup(`<b>${feature.properties.nome}</b><br>${feature.properties.endereco}`);
            }
          }
        }).addTo(map);
      });