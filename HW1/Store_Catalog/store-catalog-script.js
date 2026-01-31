// Imports the productsData object from data.js
// only works because the script is an ES module (type="module" in HTML)
import { productsData } from "../data.js";

// copies the products array using the spread operator so the original data is not modified
const shuffled_products = [...productsData.products].sort(() => 0.5 - Math.random());
// selects the HTML container where product cards will be added
const grid = document.getElementById('product-grid');

function createProductCard(product) {
    // dynamically creates HTML elements for a product card -
    // div (container - block-level element) - container for the card
    // img (image) - product image
    // h2 (header2) - product title
    // p (paragraph) - product description
    // span (inline container - used to wrap small piece of text) - discounted price
    // Note: block-level elements (like div, h2, p) start on a new line and take up the full width available,
    // while inline elements (like span, img) do not start on a new line and only take up as much width as necessary.
    const card = document.createElement("div");
    card.className = "product-card";
    const checkoutPage = document.createElement("a");
    checkoutPage.href = `../Checkout/checkout.html?product_id=${product.id}`;
    const img = document.createElement("img");
    checkoutPage.appendChild(img);
    const title = document.createElement("h2");
    const description = document.createElement("p");
    const price = document.createElement("span");
    price.className = "original-price";
    const discountedPrice = document.createElement("span");
    discountedPrice.className = "discounted-price";
    const priceContainer = document.createElement("div");
    priceContainer.className = "price-container";

    img.src = `../images/${product.image_file_name}`;
    // alt is a brief description in HTML code for an image that provides context if the image cannot be displayed
    img.alt = product.title;
    title.textContent = product.title;
    description.textContent = product.description;
    // toFixed(2) ensures the price is displayed with two decimal transformed to a string
    price.textContent = `$${product.price.toFixed(2)}`;
    discountedPrice.textContent = `$${product.discounted_price.toFixed(2)}`;
    // append price elements to the price container
    priceContainer.append(price, discountedPrice);
    // append the created elements to the card container by order
    card.append(checkoutPage, title, description, priceContainer);
    return card;
}

shuffled_products.forEach(product => {
    const productCard = createProductCard(product);
    grid.appendChild(productCard);
});