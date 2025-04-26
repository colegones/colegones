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
    { title: "Destino 1: Tenerife", url: "https://www.youtube.com/watch?v=athp282l2BA" },
    { title: "Destono 2: Por la costa", url: "https://www.youtube.com/embed/VID2" }
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
  const map = L.map('map').setView([40.416775, -3.703790], 6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Ruta base (afegeix més punts tu mateix)
  const ruta = [
    [41.3874, 2.1686], // Barcelona
    [43.2627, -2.9253], // Bilbao
    [43.37135, -8.396]
  ];

  ruta.forEach((coord, index) => {
    L.marker(coord).addTo(map)
      .bindPopup(`Parada número ${index + 1}`)
      .openPopup();
  });

  const polyline = L.polyline(ruta, { color: 'red' }).addTo(map);
  map.fitBounds(polyline.getBounds());
});
