const productsDATAAA = [
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
console.log(URLbase)

// PRODUCTS
async function getProducts(){

    console.log('fetching...')
    try {
        const response = await fetch(`${URLbase}/products`); // Cambia esta URL por tu API
        if (!response.ok) {
          throw new Error('Error en la red');
        }
        const data = await response.json(); // Convierte la respuesta a JSON
        console.log(data)
        return data;
      } catch (error) {
        console.error('Error:', error); // Manejo de errores
      }
}





const communicationManager = {
    // PRODUCTS
    getProducts,

}

export { communicationManager }