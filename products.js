fetch("/api/products")
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("products");

    products.forEach(p => {
      const div = document.createElement("div");

      div.innerHTML = `
        <img src="/uploads/${p.image_path}" width="250">
        <h3>${p.name}</h3>
        <p><strong>Price:</strong> R${p.price}</p>
        <p>${p.description}</p>

        <a href="/book?product_id=${p.id}">
          <button>Book Appointment</button>
        </a>
      `;

      container.appendChild(div);
    });
  });
