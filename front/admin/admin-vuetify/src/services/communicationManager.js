const URLbase = import.meta.env.VITE_API_URL;

console.log(URLbase);
import { io } from 'socket.io-client';

console.log('communicationManager antes de conectar.');

const socket = io(URLbase);

console.log('communicationManager despues de conectar.');

socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.IO:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor de Socket.IO');
});

export default socket;

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

// Crear un nuevo producto
async function postProduct(productData) {
  try {
    const response = await fetch(`${URLbase}/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Error al crear producto');
    const createdProduct = await response.json();
    socket.emit('productCreated', createdProduct); // Emitir evento al crear
    return createdProduct;
  } catch (error) {
    console.error('Error al crear el producto:', error);
  }
}

// Actualizar un producto por ID
async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${URLbase}/product/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    const updatedProduct = await response.json();
    socket.emit('productUpdated', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error(`Error al actualizar el producto ${id}:`, error);
  }
}

// Eliminar un producto por ID
async function deleteProduct(id) {
  try {
    const response = await fetch(`${URLbase}/product/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar producto');
    socket.emit('productDeleted', id); // Emitir evento al eliminar
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
    console.log('Datos de usuarios:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
}

// Crear un nuevo usuario
async function postUser(userData) {
  try {
    const response = await fetch(`${URLbase}/user`, {  
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    const createdUser = await response.json();
    socket.emit('userCreated', createdUser); // Emitir evento al crear
    return createdUser;
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  }
}

// Actualizar un usuario por ID
async function updateUser(id, userData) {
  try {
    const response = await fetch(`${URLbase}/user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    const updatedUser = await response.json();
    socket.emit('userUpdated', updatedUser); // Emitir evento al actualizar
    return updatedUser;
  } catch (error) {
    console.error(`Error al actualizar el usuario ${id}:`, error);
  }
}

// Eliminar un usuario por ID
async function deleteUser(id) {
  try {
    const response = await fetch(`${URLbase}/user/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    socket.emit('userDeleted', id); // Emitir evento al eliminar
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar el usuario ${id}:`, error);
  }
}


// ORDERS

// Obtener todas las órdenes
async function getOrders() {
  try {
    const response = await fetch(`${URLbase}/orders`);
    if (!response.ok) throw new Error('Error en la red al obtener órdenes');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
  }
}

// Crear una nueva orden
async function postOrder(orderData) {
  try {
    const response = await fetch(`${URLbase}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Error al crear orden');
    const createdOrder = await response.json();
    socket.emit('orderCreated', createdOrder); // Emitir evento al crear
    return createdOrder;
  } catch (error) {
    console.error('Error al crear la orden:', error);
  }
}

// Actualizar una orden por ID
async function updateOrder(id, orderData) {
  try {
    const response = await fetch(`${URLbase}/order/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Error al actualizar orden');
    const updatedOrder = await response.json();
    socket.emit('orderUpdated', updatedOrder); // Emitir evento al actualizar
    return updatedOrder;
  } catch (error) {
    console.error(`Error al actualizar la orden ${id}:`, error);
  }
}

// Eliminar una orden por ID
async function deleteOrder(id) {
  try {
    const response = await fetch(`${URLbase}/order/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar orden');
    socket.emit('orderDeleted', id); // Emitir evento al eliminar
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar la orden ${id}:`, error);
  }
}

// Obtener productos de una orden
async function getOrderProducts(orderId) {
  try {
    const response = await fetch(`${URLbase}/order/${orderId}/products`);
    if (!response.ok) throw new Error('Error en la red al obtener productos');
    return await response.json(); 
  } catch (error) {
    console.error(`Error al obtener los productos del pedido ${orderId}:`, error);
  }
}


// EXPORTAR LOS MÉTODOS
const communicationManager = {

  // Products
  getProducts,
  postProduct,
  updateProduct,
  deleteProduct,

  // Users
  getUsers,
  postUser,
  updateUser,
  deleteUser,

  // Orders
  getOrders,
  postOrder,
  updateOrder,
  deleteOrder,
  getOrderProducts,
};

export { communicationManager, socket };
