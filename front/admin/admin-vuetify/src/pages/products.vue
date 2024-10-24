<template>
    <div>
      <h1>Gestión de Productos</h1>
      <button @click="openModalCreateProduct">Crear Producto</button>
  
      <ModalCreateProduct :modelValue="isModalCreateProductOpen" @update:modelValue="isModalCreateProductOpen = $event"
        @productCreated="handleProductCreated" />
  
      <div v-if="products.length">
        <h2>Lista de Productos</h2>
        <ul>
          <li v-for="(product, index) in products" :key="index">
            {{ product.nombre }}, {{ product.precio }}€
            <hr>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue' // Importa onMounted
  import { communicationManager } from '@/services/communicationManager.js'
  
  const isModalCreateProductOpen = ref(false) // Controla si el modal está abierto o cerrado
  const products = ref([]) // Lista de productos
  
  const openModalCreateProduct = () => {
    isModalCreateProductOpen.value = true // Abre el modal
  }
  
  const handleProductCreated = (product) => {
    products.value.push(product) // Agrega el producto creado a la lista
    console.log('Producto creado:', product) // Muestra el producto en la consola
  }
  
  onMounted(async () => {
    try {
      // Asegúrate de utilizar await para obtener los productos
      products.value = await communicationManager.getProducts()
    } catch (error) {
      console.error('No se pudieron cargar los productos:', error) // Manejo de errores
    }
  })
  </script>
  
  <style scoped>
  /* Estilos opcionales para tu página */
  h1 {
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  