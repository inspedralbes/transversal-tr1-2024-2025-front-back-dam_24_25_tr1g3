<!-- src/components/Create.vue -->
<template>
    <v-container>
      <h2>Create a New Product</h2>
      <v-form @submit.prevent="submitForm">
        <v-text-field v-model="product.name" label="Product Name" required></v-text-field>
        <v-text-field v-model="product.price" label="Product Price" required></v-text-field>
        <v-btn color="success" type="submit">Create</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        product: {
          name: '',
          price: '',
        },
      };
    },
    methods: {
      submitForm() {
        // Aquí puedes enviar el producto al servidor o manejar la lógica de creación.
        console.log('Product created:', this.product);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos locales si es necesario */
  </style>
  