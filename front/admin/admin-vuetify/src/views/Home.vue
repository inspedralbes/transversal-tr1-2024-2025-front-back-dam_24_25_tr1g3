<!-- src/views/Home.vue -->
<template>
    <v-container>
      <h1>Welcome to the CRUD App</h1>
      <v-btn color="primary" :to="{ name: 'Create' }">Add New Product</v-btn>
      <v-btn color="info" :to="{ name: 'Read' }">View Products</v-btn>
    </v-container>
    <Create></Create>
  </template>
  
  <script>
  export default {
    name: 'Home',
  };
  </script>
  
  <style scoped>
  /* Estilos locales si es necesario */
  </style>
  