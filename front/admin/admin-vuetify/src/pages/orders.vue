<template>
<v-container class="main-container">
  <v-card outlined>
    <v-card-title>
      <h1>Gestión de Pedidos</h1>
      <v-spacer></v-spacer>
      <v-btn @click="openModalCreateOrder" color="green">Crear Pedido</v-btn>
    </v-card-title>


    <v-divider></v-divider>


    <v-card-text>
      <!-- Campo de búsqueda -->
      <v-text-field
        v-model="searchQuery"
        label="Buscar Pedidos"
        clearable
        append-icon="mdi-magnify"
      ></v-text-field>


      <v-data-table
        :headers="headers"
        :items="filteredOrders"
        class="elevation-1"
        item-key="num_pedido"
        no-data-text="No hay pedidos registrados."
      >
        <!-- Template para la columna de acciones -->
        <template v-slot:item.acciones="{ item }">
          <v-btn @click="openModalEditOrder(item)" color="blue" small>Editar</v-btn>
          <v-btn @click="deleteOrder(item.num_pedido)" color="red" small>Eliminar</v-btn>
          <v-btn @click="openProductModal(item)" color="yellow" small>Ver Productos</v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>


  <!-- Modal para crear Pedido -->
  <v-dialog v-model="isModalCreateOrderOpen" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Crear Pedido</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="newOrder.ID_usuario" label="ID Usuario" type="number" disabled />
        <v-text-field v-model="newOrder.total_pedido" label="Total del Pedido" type="number" disabled />
        <v-select
          v-model="newOrder.estado"
          :items="['Pendiente', 'Completado']"
          label="Estado"
          required
        />
        <!-- Sección para añadir productos -->
        <v-divider></v-divider>
        <h3>Productos</h3>
        <div v-for="(producto, index) in newOrder.productos" :key="index">
          <v-card>
            <v-card-text>
              <v-text-field v-model="producto.ID_producto" label="ID Producto" type="number" />
              <v-text-field v-model="producto.cantidad" label="Cantidad" type="number" />
              <v-text-field v-model="producto.precio_unitario" label="Precio Unitario" type="number" />
              <v-btn @click="removeProduct(index)" color="red">Eliminar Producto</v-btn>
            </v-card-text>
          </v-card>
        </div>
        <v-btn @click="addProduct" color="blue">Agregar Producto</v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="createOrder" color="green">Crear</v-btn>
        <v-btn @click="closeModalCreateOrder" color="grey">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <!-- Modal para Editar Pedido -->
  <v-dialog v-model="isModalEditOrderOpen" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Editar Pedido</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="selectedOrder.ID_usuario" label="ID Usuario" type="number" />
        <v-text-field v-model="selectedOrder.total_pedido" label="Total del Pedido" type="number" />
        <v-select
          v-model="selectedOrder.estado"
          :items="['Pendiente', 'Completado']"
          label="Estado"
          required
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="updateOrder" color="blue">Actualizar</v-btn>
        <v-btn @click="closeModalEditOrder" color="grey">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <!-- Modal para Ver Productos de un Pedido -->
  <v-dialog v-model="isModalProductOpen" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Productos del Pedido {{ selectedOrder.num_pedido }}</span>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="productHeaders"
          :items="orderProducts"
          item-key="ID_producto"
          class="elevation-1"
          no-data-text="No hay productos en este pedido."
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeProductModal" color="grey">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';


const isModalCreateOrderOpen = ref(false);
const isModalEditOrderOpen = ref(false);
const isModalProductOpen = ref(false);
const orders = ref([]);
const newOrder = ref({ ID_usuario: '', total_pedido: '', estado: '', productos: [] });
const selectedOrder = ref({});
const orderProducts = ref([]); // Productos del pedido seleccionado
const searchQuery = ref(''); // Variable para el campo de búsqueda


// Encabezados de la tabla de pedidos
const headers = [
{ text: 'Número de Pedido', value: 'num_pedido' },
{ text: 'ID Usuario', value: 'ID_usuario' },
{ text: 'Fecha', value: 'fecha' },
{ text: 'Total', value: 'total_pedido' },
{ text: 'Estado', value: 'estado' },
{ text: 'Acciones', value: 'acciones', align: 'end', sortable: false },
];


// Encabezados de la tabla de productos
const productHeaders = [
{ text: 'ID Producto', value: 'ID_producto' },
{ text: 'Cantidad', value: 'cantidad' },
{ text: 'Precio Unitario', value: 'precio_unitario' },
{ text: 'Total', value: 'total' },
];


// Abrir modal para crear un nuevo pedido
const openModalCreateOrder = () => {
newOrder.value = { ID_usuario: '', total_pedido: '', estado: '', productos: [] };
isModalCreateOrderOpen.value = true;
};


// Cerrar modal de crear pedido
const closeModalCreateOrder = () => {
isModalCreateOrderOpen.value = false;
};


// Abrir modal para editar un pedido
const openModalEditOrder = (order) => {
selectedOrder.value = { ...order };
isModalEditOrderOpen.value = true;
};


// Cerrar modal de edición
const closeModalEditOrder = () => {
isModalEditOrderOpen.value = false;
};


// Obtener todos los pedidos al montar el componente
onMounted(async () => {
await fetchOrders();
});


// Función para obtener pedidos
const fetchOrders = async () => {
try {
  orders.value = await communicationManager.getOrders();
} catch (error) {
  console.error('No se pudieron cargar los pedidos:', error);
}
};


// Función para añadir un producto a la lista
const addProduct = () => {
newOrder.value.productos.push({ ID_producto: '', cantidad: '', precio_unitario: '' });
};


// Función para eliminar un producto de la lista
const removeProduct = (index) => {
newOrder.value.productos.splice(index, 1);
};


// Función para crear un nuevo pedido
const createOrder = async () => {
newOrder.value.fecha = new Date().toISOString();
try {
  const order = await communicationManager.postOrder(newOrder.value);
  orders.value.push(order);
  closeModalCreateOrder();
} catch (error) {
  console.error('Error al crear el pedido:', error);
}
};


// Función para actualizar un pedido
const updateOrder = async () => {
try {
  if (!selectedOrder.value.num_pedido) {
    console.error('El ID del pedido no está definido.');
    return;
  }
  const updatedOrder = await communicationManager.updateOrder(selectedOrder.value.num_pedido, selectedOrder.value);
  const index = orders.value.findIndex(order => order.num_pedido === updatedOrder.num_pedido);
  if (index !== -1) {
    orders.value[index] = updatedOrder;
  }
  closeModalEditOrder();
} catch (error) {
  console.error('Error al actualizar el pedido:', error);
}
};


// Función para eliminar un pedido
const deleteOrder = async (id) => {
const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este pedido?');
if (confirmDelete) {
  try {
    await communicationManager.deleteOrder(id);
    orders.value = orders.value.filter(order => order.num_pedido !== id);
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
  }
}
};


// Función para abrir el modal de productos del pedido
const openProductModal = async (order) => {
selectedOrder.value = order;
isModalProductOpen.value = true;

try {
  const productos = await communicationManager.getOrderProducts(order.num_pedido);
  orderProducts.value = productos.map(product => ({
    ...product,
    total: product.cantidad * product.precio_unitario,
  }));
} catch (error) {
  console.error('Error al cargar productos del pedido:', error);
}
};


// Cerrar el modal de productos
const closeProductModal = () => {
isModalProductOpen.value = false;
orderProducts.value = [];
};


// Filtrar pedidos con la búsqueda
const filteredOrders = computed(() => {
if (!searchQuery.value) return orders.value;
return orders.value.filter(order =>
  order.num_pedido.toString().includes(searchQuery.value) ||
  order.ID_usuario.toString().includes(searchQuery.value)
);
});
</script>


<style scoped>
.main-container {
padding-top: 60px;
}
h1 {
margin: 0;
font-size: 24px;
font-weight: bold;
}
</style>
