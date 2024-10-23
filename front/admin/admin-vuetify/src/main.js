// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'; // Importar el plugin de Vuetify
import { createPinia } from 'pinia'; // Si estás usando Pinia para la gestión del estado

const app = createApp(App);
app.use(vuetify); // Usar Vuetify en la aplicación
app.use(createPinia()); // Si estás usando Pinia
app.mount('#app'); // Montar la aplicación
