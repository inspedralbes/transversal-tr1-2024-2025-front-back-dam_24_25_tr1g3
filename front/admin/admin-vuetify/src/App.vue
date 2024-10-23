<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Tienda de Ropa</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="$router.push('/')">Inicio</v-btn>
      <v-btn text @click="$router.push('/add')">Agregar Producto</v-btn>
    </v-app-bar>

    <v-container>
      <router-view />
    </v-container>

    <v-footer app>
      <span>&copy; 2024 Tienda de Ropa. Todos los derechos reservados.</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Estilos globales */
.v-app-bar {
  background-color: #1976D2; /* Color de fondo para la barra de navegación */
}

.v-footer {
  background-color: #424242; /* Color de fondo para el pie de página */
  color: white; /* Color del texto del pie de página */
}

/* Otros estilos globales */
</style>
