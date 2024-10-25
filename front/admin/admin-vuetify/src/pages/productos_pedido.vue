<template>
    <v-container>
      <v-card outlined>
        <v-card-title>
          <h1>Productos en Pedido</h1>
        </v-card-title>
  
        <v-divider></v-divider>
  
        <v-card-text>
          <v-list v-if="productosPedido.length">
            <v-list-item v-for="(producto, index) in productosPedido" :key="index">
              <v-list-item-content>
                <v-list-item-title>ID Producto: {{ producto.ID_producto }} - {{ producto.nombre }}</v-list-item-title>
                <v-list-item-subtitle>
                  Cantidad: {{ producto.cantidad }}<br />
                  Precio Unitario: {{ producto.precio_unitario }}€
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
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
  
  const productosPedido = ref([]);
  
  onMounted(async () => {
    try {
      // Aquí debes llamar a tu API para obtener los productos en pedido
      // Asegúrate de tener esta función en tu communicationManager
      productosPedido.value = await communicationManager.getProductosPedido(); 
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
  