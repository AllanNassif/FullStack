import { productsData } from "../data.js";

const container = document.getElementById("checkout-container");
const totalPriceElement = document.getElementById("total-price");
const paymentForm = document.getElementById("payment-form");
const nameInput = document.getElementById("name-on-card");
const cardInput = document.getElementById("card-number");
const expiryInput = document.getElementById("expiration-date");
const cvvInput = document.getElementById("security-code");

function formatPrice(value) {
	return `$${value.toFixed(2)}`;
}

function renderNotFound() {
	container.innerHTML = "<p>Product not found. Please go back and pick an item.</p>";
}

// --- Helpers: input restrictions and validators ---
function restrictToDigits(input) {
	input.addEventListener("keydown", (e) => {
		const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab", "Home", "End"]; 
		if (allowedKeys.includes(e.key)) return;
		if (!/^[0-9]$/.test(e.key)) {
			e.preventDefault();
		}
	});
}

function sanitizeLettersAndSpaces(input) {
	// input event - fires on any change to the input value 
	input.addEventListener("input", () => {
		// remove non-letter and non-space characters
		// [^...]	Negated character class — match anything NOT in this set
		// A-Za-z	All uppercase and lowercase letters
		// \s	Whitespace (spaces, tabs, newlines)
		// g	Global flag — replace all occurrences, not just the first
		let v = input.value.replace(/[^A-Za-z\s]/g, "");

		// replace multiple spaces with a single space
		v = v.replace(/\s+/g, " ");

		// update the input value
		input.value = v;
	});
}

function formatCardNumber(value) {
	// \D = Non-digit (opposite of \d) — matches anything that's NOT 0-9
	// g = Global flag — replace all occurrences
	// Keeps only the first 16 characters (card numbers are 16 digits)
	const digits = value.replace(/\D/g, "").slice(0, 16);

	// Split into groups of 4 digits
	const parts = digits.match(/.{1,4}/g) || [];

	// Join with spaces
	return parts.join(" ");
}

function isValidCardNumber(formatted) {
	// Valid if it matches the pattern XXXX XXXX XXXX XXXX
	// \d{4} = exactly 4 digits
	// ^ and $ = anchors to ensure the entire string matches this pattern
	return /^\d{4} \d{4} \d{4} \d{4}$/.test(formatted);
}

function formatExpiryInput(value) {
	const digits = value.replace(/\D/g, "").slice(0, 4);
	if (digits.length <= 2) return digits;
	return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidExpiry(exp) {
	if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
	const [mmStr, yyStr] = exp.split("/");
	const mm = parseInt(mmStr, 10);
	const yy = parseInt(yyStr, 10);
	if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) return false;
	const fullYear = 2000 + yy; // assume 20YY
	const now = new Date();
	const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	// month is 0-indexed in Date, so subtract 1
	const expiryMonthStart = new Date(fullYear, mm - 1, 1);
	return expiryMonthStart >= currentMonthStart;
}

function isValidCVV(v) {
	// CVV must be exactly 3 digits
	return /^\d{3}$/.test(v);
}

function isValidName(name) {
	const trimmed = name.trim();
	const parts = trimmed.split(/\s+/);
	if (parts.length < 2) return false; // require at least first and last name
	return parts.every(p => /^[A-Za-z]+$/.test(p));
}

function renderProduct(product) {
	// Display the total price
	totalPriceElement.textContent = `Total Price: ${formatPrice(product.discounted_price)}`;

	// Input restrictions and live formatting
	sanitizeLettersAndSpaces(nameInput);

	restrictToDigits(cardInput);
	cardInput.addEventListener("input", () => {
		cardInput.value = formatCardNumber(cardInput.value);
	});

	restrictToDigits(cvvInput);
	cvvInput.addEventListener("input", () => {
		cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 3);
	});

	restrictToDigits(expiryInput);
	expiryInput.addEventListener("input", () => {
		expiryInput.value = formatExpiryInput(expiryInput.value);
	});

	// Handle form submission with validations
	paymentForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const errors = [];
		if (!isValidName(nameInput.value)) {
			errors.push("Enter first and last name (letters only).");
		}
		if (!isValidCardNumber(cardInput.value)) {
			errors.push("Enter a valid 16-digit card number (XXXX-XXXX-XXXX-XXXX).");
		}
		if (!isValidExpiry(expiryInput.value)) {
			errors.push("Enter a valid expiration date MM/YY (this month or later).");
		}
		if (!isValidCVV(cvvInput.value)) {
			errors.push("Enter a valid 3-digit CVV.");
		}

		if (errors.length) {
			alert(errors.join("\n"));
			// focus first invalid field
			if (!isValidName(nameInput.value)) nameInput.focus();
			else if (!isValidCardNumber(cardInput.value)) cardInput.focus();
			else if (!isValidExpiry(expiryInput.value)) expiryInput.focus();
			else if (!isValidCVV(cvvInput.value)) cvvInput.focus();
			return;
		}

		// All validations passed: redirect to Thank You page
		window.location.href = `thank-you.html?product_id=${product.id}`;
	});
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

	renderProduct(product);
}

init();
