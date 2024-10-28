<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <h1>Gestión de Pedidos</h1>
        <v-spacer></v-spacer>
        <v-btn @click="openModalCreateOrder" color="green">Crear Pedido</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list v-if="orders.length">
          <v-list-item v-for="(order, index) in orders" :key="index">
            <v-list-item-content>
              <v-list-item-title>Pedido N° {{ order.num_pedido }} (ID Usuario: {{ order.ID_usuario }})</v-list-item-title>
              <v-list-item-subtitle>Total: {{ order.total_pedido }}€ - Estado: {{ order.estado }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn @click="openModalEditOrder(order)" color="blue">Editar</v-btn>
              <v-btn @click="deleteOrder(order.num_pedido)" color="red">Eliminar</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>No hay pedidos registrados.</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Modal para crear Pedido -->
    <v-dialog v-model="isModalCreateOrderOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Crear Pedido</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newOrder.ID_usuario" label="ID Usuario" type="number" />
          <v-text-field v-model="newOrder.total_pedido" label="Total del Pedido" type="number" />
          
          <!-- Cambiado a v-select para el estado -->
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
          
          <!-- Cambiado a v-select para el estado -->
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
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';

const isModalCreateOrderOpen = ref(false);
const isModalEditOrderOpen = ref(false);
const orders = ref([]);
const newOrder = ref({ ID_usuario: '', total_pedido: '', estado: '', productos: [] });
const selectedOrder = ref({});

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
  // Asignar la fecha actual al nuevo pedido
  newOrder.value.fecha = new Date().toISOString(); // ISO 8601 format
  try {
    const order = await communicationManager.postOrder(newOrder.value);
    orders.value.push(order); // Agregar el nuevo pedido a la lista
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
      orders.value[index] = updatedOrder; // Actualizar el pedido en la lista
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
      orders.value = orders.value.filter(order => order.num_pedido !== id); // Eliminar el pedido de la lista
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  }
};
</script>

<style scoped>
h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.v-btn {
  margin: 10px 0;
}
</style>
