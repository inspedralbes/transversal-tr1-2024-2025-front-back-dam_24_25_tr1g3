<!-- src/components/Login.vue -->
<template>
    <v-container class="main-container">

  <div class="login-container">
    
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Usuario:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      errorMessage.value = error; // Mostrar el error
      return;
    }

    const data = await response.json();
    // Aquí puedes manejar la respuesta, como almacenar el token o la información del usuario
    console.log('Inicio de sesión exitoso:', data);
    
    // Redirigir a otra página después del inicio de sesión exitoso
    router.push('/dashboard'); // Cambia '/dashboard' a la ruta que desees
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión';
    console.error('Error en el inicio de sesión:', error);
  }
};
</script>

<style scoped>
.main-container {
  margin-top: 60px;
}

.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.error {
  color: red;
}
</style>
