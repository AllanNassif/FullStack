import { productsData } from "../data.js";

function renderNotFound() {
    const container = document.getElementById("thank-you-container");
    container.innerHTML = "<p>Product not found. Please go back and pick an item.</p>";
}

function renderThankYou(product) {
    document.getElementById("product-image").src = `../images/${product.image_file_name}`;
    document.getElementById("product-image").alt = product.title;
    document.getElementById("product-name").textContent = product.title;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-price").textContent = `Order Total: $${product.discounted_price.toFixed(2)}`;
}

function init() {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("product_id"));
    
    if (!productId) {
        renderNotFound();
        return;
    }

    const product = productsData.products.find(p => p.id === productId);
    if (!product) {
        renderNotFound();
        return;
    }

    renderThankYou(product);
}

init();
