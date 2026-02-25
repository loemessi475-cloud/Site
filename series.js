async function loadSeriesPage() {
  const res = await fetch("movies.json");
  const data = await res.json();

  const title = localStorage.getItem("selectedSeries");
  const serie = data.series.find(s => s.title === title);

  document.getElementById("seriesTitle").innerText = serie.title;

  serie.seasons.forEach(season => {
    const btn = document.createElement("button");
    btn.innerText = "עונה " + season.season;
    btn.onclick = () => renderEpisodes(season.episodes);
    document.getElementById("seasons").appendChild(btn);
  });
}

function renderEpisodes(episodes) {
  const container = document.getElementById("episodes");
  container.innerHTML = "";
  episodes.forEach(ep => {
    const btn = document.createElement("button");
    btn.innerText = ep.title;
    btn.onclick = () => play(ep.video);
    container.appendChild(btn);
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