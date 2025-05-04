window.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.querySelector("video"); // Seleccionamos el video

  // Creamos un observador para detectar cuando el video entra o sale de la pantalla
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si el video está en pantalla, lo ponemos en play
        entry.target.play();
      } else {
        // Si el video no está en pantalla, lo pausamos
        entry.target.pause();
      }
    });
  }, { threshold: 0.5 }); // Umbral del 50%, es decir, el video debe estar al menos a la mitad visible

  // Observamos el video
  observer.observe(videoElement);

  const videos = [
    { title: "Destino 1: Tarragona", url: "https://www.youtube.com/embed/VID1" },
    { title: "Destino 2: Barcelona", url: "https://www.youtube.com/embed/VID2" },
    { title: "Destino 3: Andorra", url: "https://www.youtube.com/embed/VID2" }
  ];

  const videoContainer = document.getElementById("video-lista");
  videos.forEach(video => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${video.title}</h3>
      <iframe src="${video.url}" frameborder="0" allowfullscreen></iframe>
    `;
    videoContainer.appendChild(div);
  });

  const form = document.getElementById("form-pregunta");
  const lista = document.getElementById("lista-preguntas");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = form.nombre.value;
    const pregunta = form.pregunta.value;
    const p = document.createElement("p");
    p.innerHTML = `<strong>${nombre}:</strong> ${pregunta}`;
    lista.appendChild(p);
    form.reset();
  });

  // Mapa Leaflet
const map = L.map('map').setView([40.416775, -3.703790], 7);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Lista de ciudades con coordenadas
const ciudades = [
  { nombre: "Madrid", coords: [40.416775, -3.703790] },
  { nombre: "Ávila", coords: [40.6566, -4.6818] },
  { nombre: "Salamanca", coords: [40.9701, -5.6635] },
  { nombre: "Valladolid", coords: [41.6529, -4.7286] },
  { nombre: "Vigo", coords: [42.2406, -8.7207] },
  { nombre: "Santiago de Compostela", coords: [42.8782, -8.5448] },
  { nombre: "A Coruña", coords: [43.3623, -8.4115] },
  { nombre: "Oviedo", coords: [43.3619, -5.8494] },
  { nombre: "Gijón", coords: [43.5453, -5.6619] },
  { nombre: "Santander", coords: [43.4623, -3.8099] },
  { nombre: "Bilbao", coords: [43.2630, -2.9350] },
  { nombre: "Donostia", coords: [43.3183, -1.9812] },
  { nombre: "Pamplona", coords: [42.8125, -1.6458] },
  { nombre: "Logroño", coords: [42.4650, -2.4456] },
  { nombre: "Zaragoza", coords: [41.6488, -0.8891] },
  { nombre: "Lleida", coords: [41.6176, 0.6200] },
  { nombre: "Girona", coords: [41.9794, 2.8214] },
  { nombre: "Barcelona", coords: [41.3874, 2.1686] },
  { nombre: "Tarragona", coords: [41.1189, 1.2445] },
  { nombre: "Valencia", coords: [39.4699, -0.3763] },
  { nombre: "Cartagena", coords: [37.6257, -0.9966] },
  { nombre: "Granada", coords: [37.1773, -3.5986] },
  { nombre: "Málaga", coords: [36.7213, -4.4214] },
  { nombre: "Marbella", coords: [36.5101, -4.8825] },
  { nombre: "Gibraltar", coords: [36.1408, -5.3536] },
  { nombre: "Cádiz", coords: [36.5271, -6.2886] },
  { nombre: "Sevilla", coords: [37.3891, -5.9845] },
  { nombre: "Mérida", coords: [38.9170, -6.3455] },
  { nombre: "Cáceres", coords: [39.4760, -6.3722] },
  { nombre: "Toledo", coords: [39.8628, -4.0273] }
];

// Dividir la ruta
const indiceActual = 1; // Índice de la ciudad actual
const ciudadesVisitadas = ciudades.slice(0, indiceActual + 1);
const ciudadesPendientes = ciudades.slice(indiceActual +1);

// Iconos personalizados
const iconoRojo = L.icon({
  iconUrl: 'Resources/imgs/ping.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});
const iconoGris = L.icon({
  iconUrl: 'Resources/imgs/ping gris.png',
  iconSize: [20, 20],
  iconAnchor: [8, 18],
  popupAnchor: [0, -32]
});

// Marcadores para visitadas
ciudadesVisitadas.forEach((ciudad, index) => {
  L.marker(ciudad.coords, { icon: iconoRojo }).addTo(map)
    .bindPopup(`✅ Parada ${index + 1}: ${ciudad.nombre}`);
});

// Marcadores para pendientes
ciudadesPendientes.forEach((ciudad, index) => {
  L.marker(ciudad.coords, { icon: iconoGris }).addTo(map)
    .bindPopup(`🕒 Pendiente ${indiceActual + 1 + index + 1}: ${ciudad.nombre}`);
});

// Dibujar rutas
const rutaVisitada = ciudadesVisitadas.map(ciudad => ciudad.coords);
const rutaPendiente = ciudadesPendientes.map(ciudad => ciudad.coords);

// Línea roja (recorrido)
L.polyline(rutaVisitada, { color: 'red', weight: 4 }).addTo(map);

// Línea gris (pendiente)
L.polyline([ciudadesVisitadas[ciudadesVisitadas.length - 1].coords, ...rutaPendiente], {
  color: 'gray',
  weight: 2,
  dashArray: '5, 5'
}).addTo(map);

// Ajustar vista
map.fitBounds(L.polyline(ciudades.map(c => c.coords)).getBounds());




});
