<!-- src/components/Update.vue -->
<template>
    <v-container>
      <h2>Update Product</h2>
      <v-form @submit.prevent="submitForm">
        <v-text-field v-model="product.name" label="Product Name" required></v-text-field>
        <v-text-field v-model="product.price" label="Product Price" required></v-text-field>
        <v-btn color="success" type="submit">Update</v-btn>
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
    created() {
      const id = this.$route.params.id;
      // Aquí deberías obtener el producto por ID y rellenar los datos
      console.log('Editing product with ID:', id);
    },
    methods: {
      submitForm() {
        // Actualiza el producto en la base de datos o realiza la lógica necesaria.
        console.log('Product updated:', this.product);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos locales si es necesario */
  </style>
  