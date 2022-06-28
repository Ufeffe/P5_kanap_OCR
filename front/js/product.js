// Variables d'acces a la page
const url = new URL(window.location.href);
const idProduct = url.searchParams.get("id");
//Variables des elements de la page
const descriptionProduct = document.getElementById("description")
const imageProduct = document.querySelector(".item__img")
const titleProduct = document.getElementById("title")
const priceProduct = document.getElementById("price")
const colorProduct = document.getElementById("colors")


//Recuperation d'un produit et affichage dans la page des resultats
async function getOneProduct(product) {
    const res = await fetch(`http://localhost:3000/api/products/${product}`)
    const result = await res.json()
    insertionDescription(result)
    setColors(result.colors)
}

getOneProduct(idProduct)


function insertionDescription(data) {
    imageProduct.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
    titleProduct.textContent = data.name
    priceProduct.textContent = data.price
    descriptionProduct.textContent = data.description
}


function setColors(coloring) {
    for (let i = 0; i < coloring.length; i++) {

        colorProduct.innerHTML += `<option value="${coloring[i]}">${coloring[i]}</option>`
    }
}

// {
//     for (const color of coloring) {
//         colorProduct.innerHTML += `<option value="${color}">${color}</option>`
//     }
// }



function getDataFromLocalStorage() {
    console.log("fonciton 1 data from LS", JSON.parse(localStorage.getItem("product")))

    return JSON.parse(localStorage.getItem("product"));
}
//---------------------------------------------------------------------------------------------------------


addToCart.addEventListener("click", () => {
    let cart = getDataFromLocalStorage();
    console.log("cart récupéré");

    let newProductValues = getProductValues(cart)
    console.log("fin fonction contenu de newProdcutValues", newProductValues);

    localStorage.setItem("product", JSON.stringify(newProductValues));
    console.log("ajouté au localstorage");
})


function getProductValues(aligator) {
    let quantitySelected = parseInt(document.getElementById("quantity").value)
    let colorSelected = document.getElementById("colors").value
    let newProductValues = aligator || []

    if (colorSelected == "") {
        window.alert("Sélectionnez une couleur")
    } else if (quantitySelected < 1 || quantitySelected > 100) {
        window.alert("Sélectionnez une quantité entre 1 et 100")
    } else {
        const existingProductInCart = newProductValues.findIndex(productCart => {
            return (productCart.id == idProduct && productCart.color == colorSelected)
        })

        if (existingProductInCart >= 0) {
            newProductValues[existingProductInCart].quantity += quantitySelected
        } else {

            newProductValues.push({
                id: idProduct,
                color: colorSelected,
                quantity: quantitySelected
            })
        }
    }
    return newProductValues
}

//---------------------------------------------------------Sauvegarde---------------------------------------------------------------------------



// function existInArray(girafe) {
//     let quantitySelected = document.getElementById("quantity").value
//     let colorSelected = document.getElementById("colors").value
//     console.log(idProduct);
//     console.log(colorSelected);
//     for (let i = 0; i < girafe.length; i++) {
//         if (girafe[i][0] == [idProduct] && girafe[i][1] == [colorSelected]) {
//             console.log("bingo il est présent");
//             console.log("Avant addition", quantitySelected);
//             quantitySelected = +girafe[i][2] + +quantitySelected
//             console.log("Après addition", quantitySelected);
//             console.log("Avant découpe", girafe);
//             girafe.splice([i], 1)
//             console.log("Après découpe", girafe);
//             girafe.push([idProduct, colorSelected, quantitySelected])
//             console.log("Insertion effectuée", girafe);
//             return girafe

//         } else {

//             console.log("------------------------Perdu il est pas là ou c'est mal écrit--------------------------");

//         }

//     }
//     girafe.push([idProduct, colorSelected, quantitySelected])

//     return girafe

// }

//---------------------------------------------------------------------------------------------------------


// function getProductValues(aligator) {
//     let quantitySelected = document.getElementById("quantity").value
//     let colorSelected = document.getElementById("colors").value
//     let newProductValues = []

//     if (colorSelected == "") {
//         window.alert("Sélectionnez une couleur")
//     }
//     if (quantitySelected < 1 || quantitySelected > 100) {
//         window.alert("Sélectionnez une quantité entre 1 et 100")
//     }

//     if (aligator == null) {
//         newProductValues.push([idProduct, colorSelected, quantitySelected])
//         console.log("ajouté à cart opt1");
//         return newProductValues
//     } else {
//         aligator.push([idProduct, colorSelected, quantitySelected])
//         console.log("ajouté à cart opt3");
//         return aligator
//     }

// }
//---------------------------------------------------------------------------------------------------------
// addToCart.addEventListener("click", () => {
//     let cart = getDataFromLocalStorage();
//     console.log("cart récupéré", cart);

//     let newProductValues = getProductValues(cart)
//     console.log("fin fonction contenu de newProdcutValues", newProductValues);

//     localStorage.setItem("product", JSON.stringify(newProductValues));
//     console.log("ajouté au localstorage");
// })


//---------------------------------------------------------------------------------------------------------



// function getProductValues(aligator) {
//     let quantitySelected = parseInt(document.getElementById("quantity").value)
//     let colorSelected = document.getElementById("colors").value
//     let newProductValues = aligator || []

//     if (colorSelected == "") {
//         window.alert("Sélectionnez une couleur")
//     } else if (quantitySelected < 1 || quantitySelected > 100) {
//         window.alert("Sélectionnez une quantité entre 1 et 100")
//     } else {
//         const existingProductInCart = newProductValues.findIndex(productCart => {
//             return (productCart[0] == [idProduct] && productCart[1] == [colorSelected])
//         })

//         if (existingProductInCart >= 0) {
//             newProductValues[existingProductInCart][2] += quantitySelected
//         } else {
//             /*
//             {
//                 id: idProduct,
//                 color: colorSelected,
//                 quantity: quantitySelected   
//             }
//             */
//             newProductValues.push([idProduct, colorSelected, quantitySelected])
//         }
//     }
//     return newProductValues
// }