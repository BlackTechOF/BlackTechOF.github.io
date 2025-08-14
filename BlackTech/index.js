 function calcularDistancia(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 +
                Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
                Math.sin(dLon/2)**2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    // Criar mapa
    const map = L.map('map').setView([-23.55052, -46.633308], 12); // SP como centro
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    // Obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        map.setView([userLat, userLng], 13);

        L.marker([userLat, userLng]).addTo(map)
          .bindPopup("📍 Você está aqui")
          .openPopup();

        try {
          const resp = await fetch(
            "https://metadados.geosampa.prefeitura.sp.gov.br/geonetwork/srv/api/records/ab117be9-ad7f-41a2-a3ee-cba5709d04b2.json"
          );
          const data = await resp.json();
          const matches = data.records || [];

          const raio = 5; // km
          let cont = 0;

          matches.forEach(rec => {
            const coords = rec.geometry && rec.geometry.coordinates;
            const props = rec.fields;
            if (!coords || !props.nome) return;

            const [lng, lat] = coords;
            const dist = calcularDistancia(userLat, userLng, lat, lng);

            if (dist <= raio) {
              cont++;
              L.marker([lat, lng]).addTo(map)
                .bindPopup(`<b>${props.nome}</b><br>${dist.toFixed(2)} km`)
            }
          });

          if (!cont) {
            alert("Nenhum ecoponto encontrado dentro de " + raio + " km.");
          }

        } catch (err) {
          console.error("Erro ao buscar ecopontos:", err);
        }

      }, (err) => {
        console.error("Erro ao obter localização:", err);
        alert("Não foi possível obter sua localização.");
      });
    } else {
      alert("Seu navegador não suporta geolocalização.");
    }