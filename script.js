window.addEventListener("DOMContentLoaded", () => {
  // === 🎥 VIDEO OBSERVER ===
  const videoElement = document.querySelector("video");
  if (videoElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.play();
        else entry.target.pause();
      });
    }, { threshold: 0.5 });
    observer.observe(videoElement);
  }

  // === 📼 LISTA DE VIDEOS ===
  const videos = [
    { title: "Destino 1: Tarragona", url: "https://www.youtube.com/embed/VID1" },
    { title: "Destino 2: Barcelona", url: "https://www.youtube.com/embed/VID2" },
    { title: "Destino 3: Andorra", url: "https://www.youtube.com/embed/VID3" }
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

  // === ❓ FORMULARIO DE PREGUNTAS ===
  const form = document.getElementById("form-pregunta");
  const lista = document.getElementById("lista-preguntas");

  // Función para cargar las preguntas guardadas
  function cargarPreguntas() {
    const preguntasGuardadas = JSON.parse(localStorage.getItem("preguntes")) || [];
    lista.innerHTML = ''; // Limpiar la lista antes de volver a cargar

    preguntasGuardadas.forEach((p, index) => {
      const parrafo = document.createElement("p");
      parrafo.innerHTML = `<strong>${p.nom}:</strong> ${p.text}`;

      // Crear el botón de eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";

      // Asignar la acción de eliminación al botón
      btnEliminar.onclick = () => eliminarPregunta(index);

      // Agregar el botón de eliminar al párrafo
      parrafo.appendChild(btnEliminar);

      lista.appendChild(parrafo);
    });
  }

  // Función para eliminar una pregunta específica (requiere la contraseña)
  function eliminarPregunta(index) {
    const claveSecreta = prompt("Introduce la clave secreta para eliminar esta pregunta:");

    // Validar la clave secreta
    if (claveSecreta === "LosColegones123*") { // Cambia "secreta123" por tu clave secreta
      const preguntasGuardadas = JSON.parse(localStorage.getItem("preguntes")) || [];

      // Eliminar la pregunta del array usando el índice
      preguntasGuardadas.splice(index, 1);

      // Guardar el array actualizado en localStorage
      localStorage.setItem("preguntes", JSON.stringify(preguntasGuardadas));

      // Recargar las preguntas
      cargarPreguntas();
    } else {
      alert("Clave incorrecta. No tienes permiso para eliminar esta pregunta.");
    }
  }


  cargarPreguntas();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = form.nombre.value;
    const pregunta = form.pregunta.value;

    // Crear elemento visual
    const p = document.createElement("p");
    p.innerHTML = `<strong>${nombre}:</strong> ${pregunta}`;
    lista.appendChild(p);

    /// Guardar en localStorage
    const preguntes = JSON.parse(localStorage.getItem("preguntes")) || [];
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 7); // 7 días después
    preguntes.push({ nom: nombre, text: pregunta, vencimiento: fechaVencimiento });
    localStorage.setItem("preguntes", JSON.stringify(preguntes));


    form.reset();
  });

  // === 🗺️ MAPA LEAFLET ===
  const map = L.map('map').setView([40.416775, -3.703790], 7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

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

  const indiceActual = 1;
  const ciudadesVisitadas = ciudades.slice(0, indiceActual + 1);
  const ciudadesPendientes = ciudades.slice(indiceActual + 1);

  const iconoRojo = L.icon({
    iconUrl: 'Resources/imgs/ping.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const iconoGris = L.icon({
    iconUrl: 'Resources/imgs/ping gris.png',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -32]
  });

  // Marcadores
ciudadesVisitadas.forEach((ciudad, i) => {
  L.marker(ciudad.coords, { icon: iconoRojo })
    .addTo(map)
    .bindPopup(`✅ Parada ${i + 1}: ${ciudad.nombre}`);
});

ciudadesPendientes.forEach((ciudad, i) => {
  L.marker(ciudad.coords, { icon: iconoGris })
    .addTo(map)
    .bindPopup(`🕒 Pendiente ${i + 1 + indiceActual + 1}: ${ciudad.nombre}`);
});

// Líneas de ruta
const rutaVisitada = ciudadesVisitadas.map(c => c.coords);
const rutaPendiente = ciudadesPendientes.map(c => c.coords);
L.polyline(rutaVisitada, { color: 'red', weight: 4 }).addTo(map);
if (rutaPendiente.length > 0) {
  L.polyline([ciudadesVisitadas.at(-1).coords, ...rutaPendiente], {
    color: 'gray',
    weight: 2,
    dashArray: '5, 5'
  }).addTo(map);
}

map.fitBounds(L.polyline(ciudades.map(c => c.coords)).getBounds());
});
