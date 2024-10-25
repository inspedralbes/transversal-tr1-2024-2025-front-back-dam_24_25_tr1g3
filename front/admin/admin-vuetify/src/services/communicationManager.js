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
    const response = await fetch(`${URLbase}/products/${id}`);
    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener el producto ${id}:`, error);
  }
}

// Crear un nuevo producto
async function postProduct(productData) {
  try {
    const response = await fetch(`${URLbase}/products`, {
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
    const response = await fetch(`${URLbase}/products/${id}`, {
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
    const response = await fetch(`${URLbase}/products/${id}`, {
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
    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
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
    const response = await fetch(`${URLbase}/orders/${id}`);
    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener la orden ${id}:`, error);
  }
}

// Crear una nueva orden
async function postOrder(orderData) {
  try {
    const response = await fetch(`${URLbase}/orders`, {
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
    const response = await fetch(`${URLbase}/orders/${id}`, {
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
    const response = await fetch(`${URLbase}/orders/${id}`, {
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
