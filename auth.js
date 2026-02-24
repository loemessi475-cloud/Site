const PASSWORD = "1234"; // שנה

function login() {
  const input = document.getElementById("password").value;
  if (input === PASSWORD) {
    sessionStorage.setItem("auth", "true");
    location.href = "index.html";
  } else {
    alert("סיסמה שגויה");
  }
}

function checkAuth() {
  if (!sessionStorage.getItem("auth")) {
    location.href = "login.html";
  }
}