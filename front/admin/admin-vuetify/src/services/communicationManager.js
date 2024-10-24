const products = [
    {
        nombre:"CCC",
        precio:88
    },
    {
        nombre:"CCC",
        precio:88
    },
    {
        nombre:"CCC",
        precio:88
    },
    {
        nombre:"CCC",
        precio:88
    },
    {
        nombre:"CCC",
        precio:88
    },
]

const URLbase = import.meta.env.VITE_API_URL


// PRODUCTS
async function getProducts(){

    console.log('fetching...')

    console.log(products)
    return products
}





const communicationManager = {
    // PRODUCTS
    getProducts,

}

export { communicationManager }