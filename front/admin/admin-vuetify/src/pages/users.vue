<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <h1>Gestión de Usuarios</h1>
        <v-spacer></v-spacer>
        <v-btn @click="openModalCreateUser" color="green">Crear Usuario</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list v-if="users.length">
          <v-list-item v-for="(user, index) in users" :key="index">
            <v-list-item-content>
              <v-list-item-title>ID: {{ user.ID_usuario }} - {{ user.nombre }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.correo }} ({{ user.telefono }})</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>No hay usuarios registrados.</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';

const isModalCreateUserOpen = ref(false);
const users = ref([]);

// Función para abrir el modal de creación de usuario
const openModalCreateUser = () => {
  isModalCreateUserOpen.value = true;
};

// Obtener los usuarios al montar el componente
onMounted(async () => {
  try {
    const data = await communicationManager.getUsers();
    console.log('Datos de usuarios:', data); // Verificar la estructura de datos
    users.value = Array.isArray(data) ? data : []; // Asegúrate de que sea un array
  } catch (error) {
    console.error('No se pudieron cargar los usuarios:', error);
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
