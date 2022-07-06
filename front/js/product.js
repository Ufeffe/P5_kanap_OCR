// Variables d'acces a la page
const url = new URL(window.location.href)
const idProduct = url.searchParams.get("id")

// Variables des elements de la page
const descriptionProduct = document.getElementById("description")
const imageProduct = document.querySelector(".item__img")
const titleProduct = document.getElementById("title")
const priceProduct = document.getElementById("price")
const colorProduct = document.getElementById("colors")


// Recuperation d'un produit et affichage dans la page des resultats
async function getOneProduct(product) {
    const res = await fetch(`http://localhost:3000/api/products/${product}`)
    const result = await res.json()
    insertionDescription(result)
    setColors(result.colors)
}

getOneProduct(idProduct)

// Permet d'afficher les donnees de l'article dans la partie HTML
function insertionDescription(data) {
    imageProduct.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
    titleProduct.textContent = data.name
    priceProduct.textContent = data.price
    descriptionProduct.textContent = data.description
}

// Affiche les couleurs selectionnables pour l'article
function setColors(coloring) {
    for (let i = 0; i < coloring.length; i++) {
        colorProduct.innerHTML += `<option value="${coloring[i]}">${coloring[i]}</option>`
    }
}

// Recuperation du panier existant dans le LocalStorage
function getDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem("product"))
}

// -------------------- Evenement d'ajout au pannier --------------------
addToCart.addEventListener("click", () => {
    //Recuperation de la quantite et de la couleur selectionnees
    let colorSelected = document.getElementById("colors").value
    let quantitySelected = parseInt(document.getElementById("quantity").value)

    if (dataControl(colorSelected, quantitySelected)) {
        let allreadyInCart = getDataFromLocalStorage()
        let newProductValues = getProductValues(allreadyInCart, colorSelected, quantitySelected)
        localStorage.setItem("product", JSON.stringify(newProductValues))
        document.location.href = "/front/html/cart.html"
    }
})

// Creation de l'article a ajouter au panier et modification s'il existe deja
function getProductValues(data, color, quantity) {
    let newProductValues = data || []
    const existingProductInCart = newProductValues.findIndex(productCart => {
        return (productCart.id == idProduct && productCart.color == color)
    })

    if (existingProductInCart >= 0) {
        newProductValues[existingProductInCart].quantity += quantity
    } else {
        newProductValues.push({
            id: idProduct,
            color: color,
            quantity: quantity
        })
    }

    return newProductValues
}

// Verification et affichage des messages d'erreurs avant ajout au panier
function dataControl(colorCheck, quantityCheck) {
    if (colorCheck == "") {
        window.alert("Sélectionnez une couleur")
    } else if (quantityCheck < 1 || quantityCheck > 100) {
        window.alert("Sélectionnez une quantité entre 1 et 100")
    } else {
        return true
    }
}