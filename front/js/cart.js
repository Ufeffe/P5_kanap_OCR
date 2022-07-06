// Position pour effectuer l'affichage des donnes du cart sur la page
const cartDisplay = document.getElementById("cart__items")
const totalQuantiteInCart = document.getElementById("totalQuantity")
const totalPriceInCart = document.getElementById("totalPrice")

// Noeud parent pour la suppression des kanaps dans le DOM
let cart__items = document.getElementById("cart__items")

// //Recuperation des donnees du localStorage
let productsFromLocalStorage = JSON.parse(localStorage.getItem("product"))

// Récupération des inputs du form
const firstName = document.getElementById("firstName")
const lastName = document.getElementById("lastName")
const address = document.getElementById("address")
const city = document.getElementById("city")
const email = document.getElementById("email")
const btn = document.getElementById("order")

// ----------------------------------------------------------------------------------------------------------------------------------
// -------------------------- Recuperation des données depuis la base de donnees --------------------------
async function getData() {
    const res = await fetch('http://localhost:3000/api/products')
    let result = await res.json()
    return result
}

getData()
    // -------------------------- Incrementation des donnees du localstorage avec les donnees de la base de donnees --------------------------
    .then(allKanapData => {
        return productsFromLocalStorage
            .map(itemInBasket => {
                const kanap = allKanapData.find(kanap => kanap._id == itemInBasket.id)
                if (kanap) {
                    itemInBasket.name = kanap.name
                    itemInBasket.price = kanap.price
                    itemInBasket.imageUrl = kanap.imageUrl
                    itemInBasket.description = kanap.description
                    itemInBasket.altTxt = kanap.altTxt
                }
                return itemInBasket
            })
    })
    // -------------------------- Affichage des données du panier sur la page  --------------------------
    .then(mergedList => {
        cartDisplayItems(mergedList)
        sumQuantityPrice(mergedList)
        return mergedList
    })
    .then(dataToUpdate => {
        // -------------------- Suppression des kanaps -----------------------
        window.addEventListener('click', (e) => {
            if (e.target.className == "deleteItem") {
                let dataToModify = e.target.closest('article')
                deleteFromArray(dataToModify, dataToUpdate)
                cart__items.removeChild(dataToModify)
                updateLocalStorage(dataToUpdate)
            }
            sumQuantityPrice(dataToUpdate)
        })

        // -------------------- Modification des quantités des kanaps -----------------------
        window.addEventListener('input', (e) => {
            if (e.target.className == "itemQuantity") {
                let dataToModify = e.target.closest('article')
                let newQuantity = e.target.value

                if (newQuantity > 100) {
                    e.target.value = 100
                    newQuantity = 100
                    window.alert("La quantité maximun autorisée est 100")
                } else if (newQuantity < 1) {
                    e.target.value = 1
                    newQuantity = 1
                    window.alert("La quantité minimale autorisée est 1")
                }
                quantityUpdateInBasket(dataToModify, dataToUpdate, newQuantity)
                sumQuantityPrice(dataToUpdate)
                updateLocalStorage(dataToUpdate)

            }
        })

        //-------------------------- Blocage du comportement par default + verification des champs du form--------------------------
        btn.addEventListener("click", (e) => {
            e.preventDefault()
            let contact = formControl()
            let products = []
            if (products[0] !== undefined) {
                dataToUpdate.forEach(element => {
                    products.push(element.id)
                })
            }
            let finalArr = { contact, products }

            // Debut de la methode POST pour obtention de l'orderID

            let postMethod = fetch('http://localhost:3000/api/products/order', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(finalArr)
            })
            postMethod
                .then(res => res.json())
                .then(data => document.location.href = `/front/html/confirmation.html?orderId=${data.orderId}`)
                .catch(err => console.log(err))
        })
    })



// ------------------------------------------------- Affichage des elements du panier sur la page HMTL ---------------------------------------------------------

function cartDisplayItems(data) {
    for (let i = 0; i < data.length; i++) {
        cartDisplay.innerHTML +=
            `<article class="cart__item" data-id="${data[i].id}" data-color="${data[i].color}">
                    <div class="cart__item__img">
                      <img src="${data[i].imageUrl}" alt="${data[i].description}">
                    </div>
                    <div class="cart__item__content">
                      <div class="cart__item__content__description">
                        <h2>${data[i].name}</h2>
                        <p>${data[i].color}</p>
                        <p>${data[i].price} €</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                          <p>Qté : </p>
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${data[i].quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </article>`
    }
}

// -------------------------------- Appel des caclculs de quantités et de prix --------------------------------

function sumQuantityPrice(arr) {
    totalQuantiteInCart.textContent = quantityInBasket(arr)
    totalPriceInCart.textContent = priceInBasket(arr)
}

// -------------------------------- Calcul des quantités de kanaps dans le panier --------------------------------

function quantityInBasket(arr) {
    let sumQuantityKanapToDisplay = 0
    for (let i = 0; i < arr.length; i++) {
        // Le + devant arr[i] permet de parse la valeur de quantity sinon il y a concaténation
        sumQuantityKanapToDisplay += +arr[i].quantity
    }
    return sumQuantityKanapToDisplay
}

// ----------------------------------- Calcul du prix des kanaps dans le panier -----------------------------------

function priceInBasket(arr) {
    let totalPriceKanapToDisplay = 0
    for (let i = 0; i < arr.length; i++) {
        totalPriceKanapToDisplay += arr[i].quantity * arr[i].price
    }
    return totalPriceKanapToDisplay
}

//----------------------------------- Suppression du kanap du panier -------------------------------

function deleteFromArray(input, arr) {
    const dataToDelete = arr.indexOf(arr.find(item => item.id == input.dataset.id && item.color == input.dataset.color))
    arr.splice(dataToDelete, 1)
}

// ----------------------------------- Changement de la quantité des kanaps dans le panier ------------------------------

function quantityUpdateInBasket(input, arr, newValue) {
    const itemToChange = arr.indexOf(arr.find(item => item.id == input.dataset.id && item.color == input.dataset.color))
    arr[itemToChange].quantity = newValue
}

// ------------------------------------------------------- Controle du Formulaire ----------------------------------------------

function formControl() {
    // Récupération des valeurs dans les champs du form
    const firstNameValue = firstName.value
    const lastNameValue = lastName.value
    const addressValue = address.value
    const cityValue = city.value
    const emailValue = email.value

    const regex = new RegExp('^[a-zA-Z0-9.-_]+@{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,3}$')
    let testEmail = regex.test(emailValue)


    // Vérification à la chaine de tous les champs du form
    setErrorMsg(firstName, firstNameValue == "" ? "Veuillez écrire votre Prénom" : "")
    setErrorMsg(lastName, lastNameValue == "" ? "Veuillez écrire votre Nom" : "")
    setErrorMsg(address, addressValue == "" ? "Veuillez écrire votre Adresse" : "")
    setErrorMsg(city, cityValue == "" ? "Veuillez écrire votre ville" : "")
    setErrorMsg(email, testEmail == false ? "Veuillez écrire votre valide" : "")

    // Création du tableau contact pour la méthode POST si tous les champs sont remplis
    if (firstNameValue !== "" && lastNameValue !== "" && addressValue !== "" && cityValue !== "" && testEmail) {
        collectedData = {
            firstName: firstNameValue,
            lastName: lastNameValue,
            address: addressValue,
            city: cityValue,
            email: emailValue
        }
    }
    return collectedData
}

// --------------------------------- Fonction d'affiche des messages d'erreur ---------------------------------

function setErrorMsg(input, message) {
    // Création de l'id de l'input concerné
    let errorDisplay = input.id + "ErrorMsg"

    //  Récupération de la balise pour afficher le message
    let positionToDisplay = document.getElementById(errorDisplay)
    positionToDisplay.textContent = message
}

// --------------------------- Mise a jour quantite et article du localstorage ---------------------------

function updateLocalStorage(arr) {
    const newLocalStorage = []
    for (let i = 0; i < arr.length; i++) {

        newLocalStorage.push({
            id: arr[i].id,
            color: arr[i].color,
            quantity: arr[i].quantity
        })
    }
    localStorage.setItem("product", JSON.stringify(newLocalStorage))

}