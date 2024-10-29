<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <h1>Productos en Pedido</h1>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list v-if="productosPedido.length">
          <v-list-item-group>
            <v-list-item v-for="producto in productosPedido" :key="producto.ID_producto">
              <v-list-item-content>
                <v-list-item-title>ID Producto: {{ producto.ID_producto }} - {{ producto.nombre }}</v-list-item-title>
                <v-list-item-subtitle>
                  Cantidad: {{ producto.cantidad }}<br />
                  Precio Unitario: {{ producto.precio_unitario }}€
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>No hay productos en el pedido.</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';
import { useRoute } from 'vue-router';

const productosPedido = ref([]);
const route = useRoute();
const orderId = route.params.id; // Obtiene el ID del pedido desde la ruta

onMounted(async () => {
  try {
    // Llama a la API para obtener los productos de este pedido
    const data = await communicationManager.getOrderProducts(orderId);
    console.log("Datos recibidos:", data); // Imprime los datos de la API
    productosPedido.value = Array.isArray(data) ? data : []; // Verifica que sea un array
    console.log("Productos en pedido:", productosPedido.value); // Imprime los datos completos
  } catch (error) {
    console.error('No se pudieron cargar los productos en pedido:', error);
  }
});
</script>

<style scoped>
h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}
</style>
