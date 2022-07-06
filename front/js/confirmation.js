// Recuperation de la span pour l'affiche de l'order id
let orderIdDisplay = document.getElementById("orderId")

// Recuperation de l'order id
const url = new URL(window.location.href)
const orderIdToDisplay = url.searchParams.get("orderId")

// Affichage de l'order id
orderIdDisplay.textContent = orderIdToDisplay