<!-- src/components/Read.vue -->
<template>
    <v-container>
      <h2>Product List</h2>
      <v-data-table :headers="headers" :items="products" item-key="id">
        <template v-slot:item.actions="{ item }">
          <v-btn color="warning" :to="{ name: 'Update', params: { id: item.id } }">Edit</v-btn>
          <v-btn color="error" :to="{ name: 'Delete', params: { id: item.id } }">Delete</v-btn>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        headers: [
          { text: 'Product Name', value: 'name' },
          { text: 'Price', value: 'price' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        products: [
          { id: 1, name: 'Shirt', price: '20' },
          { id: 2, name: 'Pants', price: '50' },
          // Agrega más productos aquí o conéctalo a una API
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos locales si es necesario */
  </style>
  