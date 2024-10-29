<template>
  <v-container class="main-container">
    <v-card outlined>
      <v-card-title>
        <h1>Gestión de Productos</h1>
        <v-spacer></v-spacer>
        <v-btn @click="openModalCreateProduct" color="green">Crear Producto</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <!-- Campo de búsqueda -->
        <v-text-field
          v-model="searchQuery"
          label="Buscar Producto"
          prepend-icon="mdi-magnify"
          clearable
        ></v-text-field>

        <v-row>
          <v-col
            v-for="product in filteredProducts"
            :key="product.ID_producto"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card>
              <v-card-title>{{ product.nombre }}</v-card-title>
              <v-card-subtitle>ID: {{ product.ID_producto }}</v-card-subtitle>
              <v-card-text>
                <p>{{ product.descripcion }}</p>
                <p>Precio: {{ product.precio }}€</p>
                <p>Stock: {{ product.stock }}</p>
                <v-img
                  :src="product.imagen"
                  max-width="200"
                  max-height="200"
                  contain
                  :alt="`Imagen de ${product.nombre}`"
                ></v-img>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="openModalEditProduct(product)" color="blue">Editar</v-btn>
                <v-btn @click="deleteProduct(product.ID_producto)" color="red">Eliminar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-list v-if="filteredProducts.length === 0">
          <v-list-item>
            <v-list-item-content>No hay productos registrados.</v-list-item-content>
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
          <v-text-field v-model="newProduct.descripcion" label="Descripción" />
          <v-text-field v-model="newProduct.precio" label="Precio" type="number" />
          <v-text-field v-model="newProduct.stock" label="Stock" type="number" />
          <v-text-field v-model="newProduct.imagen" label="URL de la Imagen" />
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
          <v-text-field v-model="selectedProduct.descripcion" label="Descripción" />
          <v-text-field v-model="selectedProduct.precio" label="Precio" type="number" />
          <v-text-field v-model="selectedProduct.stock" label="Stock" type="number" />
          <v-text-field v-model="selectedProduct.imagen" label="URL de la Imagen" />
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
import { ref, onMounted, computed } from 'vue';
import { communicationManager } from '@/services/communicationManager.js';

const isModalCreateProductOpen = ref(false);
const isModalEditProductOpen = ref(false);
const products = ref([]);
const selectedProduct = ref({});
const newProduct = ref({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' });
const searchQuery = ref(''); // Añadido para el campo de búsqueda

// Abrir modal para crear producto
const openModalCreateProduct = () => {
  newProduct.value = { nombre: '', descripcion: '', precio: '', stock: '', imagen: '' };
  isModalCreateProductOpen.value = true;
};

// Cerrar modal de crear producto
const closeModalCreateProduct = () => {
  isModalCreateProductOpen.value = false;
};

// Abrir modal para editar producto
const openModalEditProduct = (product) => {
  selectedProduct.value = { ...product };
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
    if (!selectedProduct.value.ID_producto) {
      console.error('El ID del producto no está definido.');
      return;
    }
    await communicationManager.updateProduct(selectedProduct.value.ID_producto, selectedProduct.value);
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

// Computed para filtrar productos según la búsqueda
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value;
  }
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product => product.nombre.toLowerCase().includes(query));
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
</style>
