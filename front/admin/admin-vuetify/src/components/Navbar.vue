<!-- src/components/Navbar.vue -->
<template>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Gestión de Inventario BADM</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/products" text>Productos</v-btn>
      <v-btn to="/users" text>Usuarios</v-btn>
      <v-btn to="/orders" text>Pedidos</v-btn>
      <v-btn to="/productosPedido" text>Productos Pedido</v-btn>

    </v-app-bar>
  </template>
  
  <script setup>
  // Puedes importar aquí la configuración o iconos adicionales si los necesitas
  </script>
  
  <style scoped>
  /* Estilos opcionales para ajustar la barra de navegación */
  .v-btn {
    font-weight: bold;
  }
  </style>
  