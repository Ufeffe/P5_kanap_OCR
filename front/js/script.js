const kanapResult = document.getElementById("items");


// Fonction de récupération API ------------------------------------------------------------------------

async function getData() {
    const res = await fetch('http://localhost:3000/api/products')
    const result = await res.json()
    orderList(result)
    createKanapList(result)
}
getData()


// Fonction de creation contenu hmtl index ------------------------------------------------------------------------

function createKanapList(kanapsList) {
    Array.from(kanapsList).forEach(kanap => {
        kanapResult.innerHTML += `
        <a href="./product.html?id=${kanap._id}">
            <article>
              <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
              <h3 class="productName">${kanap.name}</h3>
              <p class="productDescription">${kanap.description}</p>
            </article>
        </a>
    `
    })
}

// Fonction de tri ------------------------------------------------------------------------

function orderList(data) {

    const orderedData = data.sort((a, b) => {

        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1
        }
        return 0
    })
    return orderedData
}

// Fonction de tri ------------------------------------------------------------------------