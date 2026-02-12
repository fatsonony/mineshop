document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");

  if (!form) {
    console.error("Login form not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {

      if (data.message === "Login successful") {

        // ✅ SAVE USER DATA
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userSurname", data.user.surname);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userLocation", data.user.location);

        // ✅ REDIRECT
        window.location.href = "products.html";

      } else {
        alert(data.message);
      }

    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Server error");
    });

  });

});
