let allMovies = [];

async function loadMovies() {
  const res = await fetch("movies.json");
  const data = await res.json();
  allMovies = data.movies;
  renderMovies(allMovies);
  renderCategories();
}

function renderMovies(list) {
  const container = document.getElementById("movies");
  container.innerHTML = "";
  list.forEach(m => {
    const img = document.createElement("img");
    img.src = m.poster;
    img.title = m.title;
    img.onclick = () => play(m.video);
    container.appendChild(img);
  });
}

function play(url) {
  const modal = document.getElementById("playerModal");
  modal.style.display = "flex";
  const player = videojs("player");
  player.src({ src: url, type: "video/mp4" });
}

function filterMovies() {
  const q = document.getElementById("search").value.toLowerCase();
  renderMovies(allMovies.filter(m => m.title.toLowerCase().includes(q)));
}

function renderCategories() {
  const cats = [...new Set(allMovies.map(m => m.category))];
  const div = document.getElementById("categories");
  cats.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c;
    btn.onclick = () => renderMovies(allMovies.filter(m => m.category === c));
    div.appendChild(btn);
  });
}