<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <h1>Gestión de Productos</h1>
        <v-spacer></v-spacer>
        <v-btn @click="openModalCreateProduct" color="green">Crear Producto</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list v-if="products.length">
          <v-list-item v-for="(product, index) in products" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ product.nombre }}</v-list-item-title>
              <v-list-item-subtitle>{{ product.precio }}€</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn @click="openModalEditProduct(product)" color="purple">Editar</v-btn>
              <v-btn @click="deleteProduct(product.id)" color="red">Eliminar</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Modal para crear Producto -->
    <v-dialog v-model="isModalCreateProductOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Crear Producto</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newProduct.nombre" label="Nombre del Producto" />
          <v-text-field v-model="newProduct.precio" label="Precio" type="number" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="createProduct" color="green">Crear</v-btn>
          <v-btn @click="closeModalCreateProduct" color="grey">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para Editar Producto -->
    <v-dialog v-model="isModalEditProductOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Producto</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedProduct.nombre" label="Nombre del Producto" />
          <v-text-field v-model="selectedProduct.precio" label="Precio" type="number" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="updateProduct" color="blue">Actualizar</v-btn>
          <v-btn @click="closeModalEditProduct" color="grey">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';

const isModalCreateProductOpen = ref(false);
const isModalEditProductOpen = ref(false);
const products = ref([]);
const selectedProduct = ref({});
const newProduct = ref({ nombre: '', precio: '' }); // Inicializamos el nuevo producto

// Abrir modal para crear producto
const openModalCreateProduct = () => {
  newProduct.value = { nombre: '', precio: '' }; // Reiniciar el nuevo producto
  isModalCreateProductOpen.value = true;
};

// Cerrar modal de crear producto
const closeModalCreateProduct = () => {
  isModalCreateProductOpen.value = false;
};

// Abrir modal para editar producto
const openModalEditProduct = (product) => {
  selectedProduct.value = { ...product }; // Hacemos una copia del producto para editar
  isModalEditProductOpen.value = true;
};

// Cerrar modal de edición
const closeModalEditProduct = () => {
  isModalEditProductOpen.value = false;
};

// Obtener todos los productos al montar el componente
onMounted(async () => {
  await fetchProducts();
});

// Función para obtener productos
const fetchProducts = async () => {
  try {
    products.value = await communicationManager.getProducts();
  } catch (error) {
    console.error('No se pudieron cargar los productos:', error);
  }
};

// Función para crear un nuevo producto
const createProduct = async () => {
  try {
    await communicationManager.postProduct(newProduct.value);
    await fetchProducts(); // Refrescar la lista de productos
    closeModalCreateProduct();
  } catch (error) {
    console.error('Error al crear el producto:', error);
  }
};

// Función para actualizar el producto
const updateProduct = async () => {
  try {
    await communicationManager.updateProduct(selectedProduct.value.id, selectedProduct.value);
    await fetchProducts(); // Refrescar la lista de productos
    closeModalEditProduct();
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  }
};

// Función para eliminar un producto
const deleteProduct = async (id) => {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto?');
  if (confirmDelete) {
    try {
      await communicationManager.deleteProduct(id);
      await fetchProducts(); // Refrescar la lista de productos
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
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
