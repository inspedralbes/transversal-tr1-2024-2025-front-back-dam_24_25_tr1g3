<template>
    <v-container>
      <v-card outlined>
        <v-card-title>
          <h1>Gestión de Pedidos</h1>
          <v-spacer></v-spacer>
          <v-btn @click="openModalCreateOrder" color="primary">Crear Pedido</v-btn>
        </v-card-title>
  
        <v-divider></v-divider>
  
        <v-card-text>
          <v-list v-if="orders.length">
            <v-list-item v-for="(order, index) in orders" :key="index">
              <v-list-item-content>
                <v-list-item-title>Pedido N° {{ order.num_pedido }} (ID Usuario: {{ order.ID_usuario }})</v-list-item-title>
                <v-list-item-subtitle>Total: {{ order.total_pedido }}€ - Estado: {{ order.estado }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>No hay pedidos registrados.</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { communicationManager } from '@/services/communicationManager.js';
  
  const isModalCreateOrderOpen = ref(false);
  const orders = ref([]);
  
  const openModalCreateOrder = () => {
    isModalCreateOrderOpen.value = true;
  };
  
  const handleOrderCreated = (order) => {
    orders.value.push(order);
    console.log('Pedido creado:', order);
  };
  
  onMounted(async () => {
    try {
      orders.value = await communicationManager.getOrders();
    } catch (error) {
      console.error('No se pudieron cargar los pedidos:', error);
    }
  });
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
  