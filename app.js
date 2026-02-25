let movies = [];
let series = [];

async function init() {
  await loadMovies();
  await loadChannels();
}

async function loadMovies() {
  const res = await fetch("movies.json");
  const data = await res.json();
  movies = data.movies;
  series = data.series;

  renderHero(movies[0]);
  renderMovies(movies);
  renderSeries(series);
}

function renderHero(movie) {
  const hero = document.getElementById("hero");
  hero.style.backgroundImage = `url(${movie.poster})`;
  hero.innerHTML = `
    <div class="hero-content">
      <h1>${movie.title}</h1>
      <button onclick="play('${movie.video}')">▶ צפייה</button>
    </div>
  `;
}

function renderMovies(list) {
  const container = document.getElementById("movies");
  container.innerHTML = "";
  list.forEach(m => {
    container.innerHTML += `
      <div class="card">
        <img src="${m.poster}" onclick="play('${m.video}')">
      </div>`;
  });
}

function renderSeries(list) {
  const container = document.getElementById("series");
  container.innerHTML = "";
  list.forEach(s => {
    container.innerHTML += `
      <div class="card">
        <img src="${s.poster}" onclick="openSeries('${s.title}')">
      </div>`;
  });
}

function openSeries(title) {
  localStorage.setItem("selectedSeries", title);
  window.location.href = "series.html";
}

async function loadChannels() {
  const res = await fetch("channels.m3u");
  const text = await res.text();
  const lines = text.split("\n");

  let groups = {};

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#EXTINF")) {
      const name = lines[i].split(",")[1];
      const groupMatch = lines[i].match(/group-title="(.*?)"/);
      const group = groupMatch ? groupMatch[1] : "אחר";
      const url = lines[i + 1]?.trim();

      if (!groups[group]) groups[group] = [];
      groups[group].push({ name, url });
    }
  }

  renderChannels(groups);
}

function renderChannels(groups) {
  const container = document.getElementById("channelsContainer");
  container.innerHTML = "";

  Object.keys(groups).forEach(group => {
    container.innerHTML += `
      <div class="channel-group">
        <div class="channel-title">${group}</div>
        <div class="channel-grid">
          ${groups[group].map(ch => 
            `<div class="channel-card" onclick="play('${ch.url}')">${ch.name}</div>`
          ).join("")}
        </div>
      </div>`;
  });
}

function play(url) {
  const modal = document.getElementById("playerModal");
  const video = document.getElementById("videoPlayer");
  modal.style.display = "flex";

  if (Hls.isSupported() && url.includes(".m3u8")) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }

  video.play();
}

function closePlayer() {
  document.getElementById("playerModal").style.display = "none";
  document.getElementById("videoPlayer").pause();
}

function searchAll() {
  const q = document.getElementById("search").value.toLowerCase();
  renderMovies(movies.filter(m => m.title.toLowerCase().includes(q)));
  renderSeries(series.filter(s => s.title.toLowerCase().includes(q)));
}