<!-- src/App.vue -->
<template>
  <v-app>
    <Navbar /> <!-- Barra de navegación en la parte superior -->
    <router-view /> <!-- Contenido de la página (Products, Users, Orders) -->
  </v-app>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>
