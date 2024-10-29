<template>
  <v-container class="main-container">
    <v-card outlined>
      <v-card-title>
        <h1>Gestión de Usuarios</h1>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchQuery"
          append-icon="mdi-magnify"
          label="Buscar usuario por nombre"
          outlined
          clearable
        ></v-text-field>
        <v-btn @click="openModalCreateUser" color="green">Crear Usuario</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Grid de datos de usuarios -->
      <v-card-text>
        <v-row>
          <v-col
            v-for="user in filteredUsers"
            :key="user.ID_usuario"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="user-card" outlined>
              <v-card-title>
                <h3>{{ user.nombre }}</h3>
              </v-card-title>
              <v-card-subtitle>ID: {{ user.ID_usuario }}</v-card-subtitle>
              <v-card-text>
                <p><strong>Correo:</strong> {{ user.correo }}</p>
                <p><strong>Teléfono:</strong> {{ user.telefono }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="openModalEditUser(user)" color="blue" small>Editar</v-btn>
                <v-btn @click="deleteUser(user.ID_usuario)" color="red" small>Eliminar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Modal para crear Usuario -->
    <v-dialog v-model="isModalCreateUserOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Crear Usuario</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newUser.nombre" label="Nombre" required />
          <v-text-field v-model="newUser.correo" label="Correo" type="email" required />
          <v-text-field v-model="newUser.telefono" label="Teléfono" required />
          <v-text-field v-model="newUser.contraseña" label="Contraseña" type="password" required />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="createUser" color="green">Crear</v-btn>
          <v-btn @click="closeModalCreateUser" color="grey">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para Editar Usuario -->
    <v-dialog v-model="isModalEditUserOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Usuario</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedUser.nombre" label="Nombre" required />
          <v-text-field v-model="selectedUser.correo" label="Correo" type="email" required />
          <v-text-field v-model="selectedUser.telefono" label="Teléfono" required />
          <v-text-field v-model="selectedUser.contraseña" label="Contraseña" type="password" required />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="updateUser" color="blue">Actualizar</v-btn>
          <v-btn @click="closeModalEditUser" color="grey">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';

const isModalCreateUserOpen = ref(false);
const isModalEditUserOpen = ref(false);
const users = ref([]);
const newUser = ref({ nombre: '', correo: '', telefono: '', contraseña: '' });
const selectedUser = ref({});
const searchQuery = ref(''); // Variable de búsqueda

const openModalCreateUser = () => {
  newUser.value = { nombre: '', correo: '', telefono: '', contraseña: '' };
  isModalCreateUserOpen.value = true;
};

const closeModalCreateUser = () => {
  isModalCreateUserOpen.value = false;
};

const openModalEditUser = (user) => {
  selectedUser.value = { ...user };
  isModalEditUserOpen.value = true;
};

const closeModalEditUser = () => {
  isModalEditUserOpen.value = false;
};

onMounted(async () => {
  await fetchUsers();
});

const fetchUsers = async () => {
  try {
    const data = await communicationManager.getUsers();
    users.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('No se pudieron cargar los usuarios:', error);
  }
};

const createUser = async () => {
  try {
    if (!newUser.value.nombre || !newUser.value.correo || !newUser.value.telefono || !newUser.value.contraseña) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newUser.value.correo)) {
      alert("Por favor ingresa un correo electrónico válido.");
      return;
    }

    const user = await communicationManager.postUser(newUser.value);
    users.value.push(user);
    closeModalCreateUser();
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    alert("Hubo un error al crear el usuario. Intenta nuevamente.");
  }
};

const updateUser = async () => {
  try {
    if (!selectedUser.value.ID_usuario || !selectedUser.value.nombre || !selectedUser.value.correo || !selectedUser.value.telefono || !selectedUser.value.contraseña) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const updatedUser = await communicationManager.updateUser(selectedUser.value.ID_usuario, selectedUser.value);
    const index = users.value.findIndex(user => user.ID_usuario === updatedUser.ID_usuario);
    if (index !== -1) {
      users.value[index] = updatedUser;
    }
    closeModalEditUser();
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    alert("Hubo un error al actualizar el usuario. Intenta nuevamente.");
  }
};

const deleteUser = async (id) => {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este usuario?');
  if (confirmDelete) {
    try {
      await communicationManager.deleteUser(id);
      users.value = users.value.filter(user => user.ID_usuario !== id);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  }
};

// Computed para filtrar usuarios según la búsqueda
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value;
  }
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => user.nombre.toLowerCase().includes(query));
});
</script>

<style scoped>
.main-container {
  margin-top: 60px;
}

h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.v-btn {
  margin: 10px 0;
}

.user-card {
  padding: 16px;
  text-align: left;
}

.user-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}
</style>
