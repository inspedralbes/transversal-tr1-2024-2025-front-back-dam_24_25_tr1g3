<!-- src/components/Delete.vue -->
<template>
    <v-container>
      <h2>Delete Product</h2>
      <v-alert type="error">
        Are you sure you want to delete this product?
      </v-alert>
      <v-btn color="error" @click="deleteProduct">Yes, Delete</v-btn>
      <v-btn color="secondary" :to="{ name: 'Read' }">Cancel</v-btn>
    </v-container>
  </template>
  
  <script>
  export default {
    methods: {
      deleteProduct() {
        const id = this.$route.params.id;
        // Aquí puedes eliminar el producto por ID.
        console.log('Product deleted with ID:', id);
        this.$router.push({ name: 'Read' }); // Vuelve a la lista después de eliminar
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos locales si es necesario */
  </style>
  