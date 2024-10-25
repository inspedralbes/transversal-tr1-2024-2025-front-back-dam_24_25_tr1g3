const URLbase = import.meta.env.VITE_API_URL;
console.log(URLbase);

// PRODUCTS

// Obtener todos los productos
async function getProducts() {
  try {
    const response = await fetch(`${URLbase}/products`);
    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}

// Obtener un producto por ID
async function getProduct(id) {
  try {
    const response = await fetch(`${URLbase}/product/${id}`); // Asegúrate de que la ruta sea /product/{id}
    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
  }
}

// Crear un nuevo producto
async function postProduct(productData) {
  try {
    const response = await fetch(`${URLbase}/product`, { // Cambié la ruta a /product
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Error al crear producto');
    return await response.json();
  } catch (error) {
    console.error('Error al crear el producto:', error);
  }
}

// Actualizar un producto por ID
async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${URLbase}/product/${id}`, { // Cambié la ruta a /product/{id}
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar el producto ${id}:`, error);
  }
}

// Eliminar un producto por ID
async function deleteProduct(id) {
  try {
    const response = await fetch(`${URLbase}/product/${id}`, { // Cambié la ruta a /product/{id}
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar producto');
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar el producto ${id}:`, error);
  }
}

// USERS

// Obtener todos los usuarios
async function getUsers() {
  try {
    const response = await fetch(`${URLbase}/users`);
    if (!response.ok) throw new Error('Error en la red');
    const data = await response.json();
    console.log('Datos de usuarios:', data); // Imprimir los datos recibidos
    return data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return []; // Retornar un array vacío en caso de error
  }
}

// ORDERS

// Obtener todas las órdenes
async function getOrders() {
  try {
    const response = await fetch(`${URLbase}/orders`);
    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
  }
}

// Obtener una orden por ID
async function getOrder(id) {
  try {
    const response = await fetch(`${URLbase}/order/${id}`); // Cambié la ruta a /order/{id}
    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener la orden ${id}:`, error);
  }
}

// Crear una nueva orden
async function postOrder(orderData) {
  try {
    const response = await fetch(`${URLbase}/order`, { // Cambié la ruta a /order
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Error al crear orden');
    return await response.json();
  } catch (error) {
    console.error('Error al crear la orden:', error);
  }
}

// Actualizar una orden por ID
async function updateOrder(id, orderData) {
  try {
    const response = await fetch(`${URLbase}/order/${id}`, { // Cambié la ruta a /order/{id}
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Error al actualizar orden');
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar la orden ${id}:`, error);
  }
}

// Eliminar una orden por ID
async function deleteOrder(id) {
  try {
    const response = await fetch(`${URLbase}/order/${id}`, { // Cambié la ruta a /order/{id}
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar orden');
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar la orden ${id}:`, error);
  }
}

// EXPORTAR LOS MÉTODOS
const communicationManager = {
  // Products
  getProducts,
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,

  // Users
  getUsers,

  // Orders
  getOrders,
  getOrder,
  postOrder,
  updateOrder,
  deleteOrder,
};

export { communicationManager };
