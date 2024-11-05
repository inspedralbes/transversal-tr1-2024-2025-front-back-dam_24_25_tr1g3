<template>
  <v-container class="main-container">
    <v-card outlined>
      <v-card-title>
        <h1>Gestión de Usuarios</h1>
        <v-spacer></v-spacer>
        <v-btn @click="openModalCreateUser" color="green">Crear Usuario</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          append-icon="mdi-magnify"
          label="Buscar usuario por nombre"
          outlined
          clearable
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="createUser" color="green">Crear</v-btn>
          <v-btn @click="closeModalCreateUser" color="grey">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para editar Usuario -->
    <v-dialog v-model="isModalEditUserOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Usuario</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedUser.nombre" label="Nombre" required />
          <v-text-field v-model="selectedUser.correo" label="Correo" type="email" required />
          <v-text-field v-model="selectedUser.telefono" label="Teléfono" required />
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { communicationManager, socket } from '@/services/communicationManager.js';

const isModalCreateUserOpen = ref(false);
const isModalEditUserOpen = ref(false);
const users = ref([]);
const newUser = ref({ nombre: '', correo: '', telefono: '', contraseña: '' });
const selectedUser = ref({});
const searchQuery = ref(''); // Variable de búsqueda


// Abrir modal para crear usuario
const openModalCreateUser = () => {
  newUser.value = { nombre: '', correo: '', telefono: '', contraseña: '' };
  isModalCreateUserOpen.value = true;
};

// Cerrar modal de crear usuario
const closeModalCreateUser = () => {
  isModalCreateUserOpen.value = false;
};

// Abrir modal para editar usuario
const openModalEditUser = (user) => {
  selectedUser.value = { ...user };
  isModalEditUserOpen.value = true;
};

// Cerrar modal de edición
const closeModalEditUser = () => {
  isModalEditUserOpen.value = false;
};

// Obtener todos los usuarios al montar el componente
onMounted(async () => {
  await fetchUsers();

  // Escuchar eventos de Socket.io para cambios en usuarios
  socket.on('userCreated', (newUser) => {
    users.value.push(newUser);
    
  });

  socket.on('userUpdated', (updatedUser) => {
    const index = users.value.findIndex(u => u.ID_usuario === updatedUser.ID_usuario);
    if (index !== -1) users.value[index] = updatedUser;
  });

  socket.on('userDeleted', (deletedUserId) => {
    users.value = users.value.filter(u => u.ID_usuario !== deletedUserId);
  });
});

// Desconectar el socket cuando el componente se desmonte
onBeforeUnmount(() => {
  socket.off('userCreated');
  socket.off('userUpdated');
  socket.off('userDeleted');
});

// Función para obtener usuarios
const fetchUsers = async () => {
  try {
    users.value = await communicationManager.getUsers();
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
};

// Crear nuevo usuario
const createUser = async () => {
  await communicationManager.postUser(newUser.value);
  closeModalCreateUser();
  await fetchUsers(); 

};

// Actualizar usuario
const updateUser = async () => {
  await communicationManager.updateUser(selectedUser.value.ID_usuario, selectedUser.value);
  closeModalEditUser();
  await fetchUsers(); 

};

// Eliminar usuario
const deleteUser = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    await communicationManager.deleteUser(id);
    await fetchUsers(); 
socket.emit('usuario eliminado')
  }
};

// Filtrar usuarios según la búsqueda
const filteredUsers = computed(() => {
  return users.value.filter(user => user.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()));
});
</script>

<style scoped>
.main-container {
  margin: 20px;
}
.user-card {
  transition: transform 0.2s;
}

.user-card:hover {
  transform: scale(1.02);
}
</style>
