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
        <v-data-table
          :headers="headers"
          :items="users"
          class="elevation-1"
          item-key="ID_usuario"
          no-data-text="No hay usuarios registrados."
        >
          <!-- Template para la columna de acciones -->
          <template v-slot:item.acciones="{ item }">
            <v-btn @click="openModalEditUser(item)" color="blue" small>Editar</v-btn>
            <v-btn @click="deleteUser(item.ID_usuario)" color="red" small>Eliminar</v-btn>
          </template>
        </v-data-table>
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
import { ref, onMounted } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';

const isModalCreateUserOpen = ref(false);
const isModalEditUserOpen = ref(false);
const users = ref([]);
const newUser = ref({ nombre: '', correo: '', telefono: '', contraseña: '' });
const selectedUser = ref({});

// Encabezados de la tabla
const headers = [
  { text: 'ID', value: 'ID_usuario' },
  { text: 'Nombre', value: 'nombre' },
  { text: 'Correo', value: 'correo' },
  { text: 'Teléfono', value: 'telefono' },
  { text: 'Acciones', value: 'acciones', align: 'end', sortable: false },
];

// Función para abrir el modal de creación de usuario
const openModalCreateUser = () => {
  newUser.value = { nombre: '', correo: '', telefono: '', contraseña: '' };
  isModalCreateUserOpen.value = true;
};

// Cerrar modal de crear usuario
const closeModalCreateUser = () => {
  isModalCreateUserOpen.value = false;
};

// Abrir modal para editar un usuario
const openModalEditUser = (user) => {
  selectedUser.value = { ...user };
  isModalEditUserOpen.value = true;
};

// Cerrar modal de edición
const closeModalEditUser = () => {
  isModalEditUserOpen.value = false;
};

// Obtener los usuarios al montar el componente
onMounted(async () => {
  await fetchUsers();
});

// Función para obtener usuarios
const fetchUsers = async () => {
  try {
    const data = await communicationManager.getUsers();
    users.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('No se pudieron cargar los usuarios:', error);
  }
};

// Función para crear un nuevo usuario
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

// Función para actualizar un usuario
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

// Función para eliminar un usuario
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
