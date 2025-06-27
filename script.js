// Busca os ecopontos reais via API da Prefeitura

const botaogeo = document.getElementById('geolocal');
const inputlocal = document.getElementById('inputlocal')

async function obterLocalizacao() {
  if ("geolocation" in navigator) {
navigator.geolocation.getCurrentPosition(
  (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log(`Latitude: ${latitude}`);
    console.log(`Longitude: ${longitude}`);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
.then(response => response.json())
.then(data => {
  const cidade1 = data.address.city || data.address.town || data.address.village;
  console.log("Cidade detectada:", cidade1);


botaogeo.addEventListener('click', function(){
  inputlocal.value = cidade1
})
  

})
.catch(error => {
  console.error("Erro ao converter localização:", error.message);
});

  },
  (error) => {
    console.error("Erro ao obter localização:", error.message);
  }
);
} else {
console.log("Geolocalização não é suportada.");
}
}


async function fetchEcopontos() {
  const res = await fetch('https://metadados.geosampa.prefeitura.sp.gov.br/geonetwork/geoprodam/api/records/ab117be9-ad7f-41a2-a3ee-cba5709d04b2');
  const json = await res.json();
  return json.records.map(r => ({
    nome: r.title,
    endereco: r.fields.endereco,
    latitude: r.geometry.coordinates[1],
    longitude: r.geometry.coordinates[0],
    descricao: r.fields.tipo,
    horario: r.fields.horario || 'Não informado'
  }));
}

async function initMap() {
  const map = L.map('map').setView([-23.5505, -46.6333], 8);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const ecopontos = await fetchEcopontos();
  console.log('Ecopontos:', ecopontos);
  ecopontos.forEach(ponto => {
    L.marker([-23.5505, -46.6333])
      .addTo(map)
      .bindPopup(`
        <b>${ponto.nome}</b><br>
        ${ponto.endereco}<br>
        ${ponto.descricao}<br>
        <i>${ponto.horario}</i>
      `);
  });
}

initMap();
obterLocalizacao()
