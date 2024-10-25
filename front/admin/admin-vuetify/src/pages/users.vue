<template>
    <v-container>
      <v-card outlined>
        <v-card-title>
          <h1>Gestión de Usuarios</h1>
          <v-spacer></v-spacer>
          <v-btn @click="openModalCreateUser" color="primary">Crear Usuario</v-btn>
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
  
  const openModalCreateUser = () => {
    isModalCreateUserOpen.value = true;
  };
  
  const handleUserCreated = (user) => {
    users.value.push(user);
    console.log('Usuario creado:', user);
  };
  
  onMounted(async () => {
    try {
      users.value = await communicationManager.getUsers();
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
  