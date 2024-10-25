<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <h1>Gestión de Productos</h1>
        <v-spacer></v-spacer>
        <v-btn @click="openModalCreateProduct" color="primary">Crear Producto</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list v-if="products.length">
          <v-list-item v-for="(product, index) in products" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ product.nombre }}</v-list-item-title>
              <v-list-item-subtitle>{{ product.precio }}€</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';

const isModalCreateProductOpen = ref(false);
const products = ref([]);

const openModalCreateProduct = () => {
  isModalCreateProductOpen.value = true;
};

const handleProductCreated = (product) => {
  products.value.push(product);
  console.log('Producto creado:', product);
};

onMounted(async () => {
  try {
    products.value = await communicationManager.getProducts();
  } catch (error) {
    console.error('No se pudieron cargar los productos:', error);
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
