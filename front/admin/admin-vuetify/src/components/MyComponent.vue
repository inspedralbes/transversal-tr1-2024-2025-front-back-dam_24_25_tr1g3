<template>
  <v-container>
    <v-btn @click="sendMessage">Enviar Mensaje</v-btn>
    <v-list>
      <v-list-item-group>
        <v-list-item v-for="(message, index) in messages" :key="index">
          <v-list-item-content>{{ message }}</v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script>
import socket from '../socket'; 

export default {
  data() {
    return {
      messages: [],
    };
  },
  created() {
    // Escuchar eventos de Socket.IO
    socket.on('message', (message) => {
      this.messages.push(message);
    });
  },
  methods: {
    sendMessage() {
      const message = 'Hola desde Vuetify!';
      socket.emit('message', message); // Envía un mensaje
    },
  },
  beforeDestroy() {
    socket.off('message'); // Limpia el evento al destruir el componente
  },
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
