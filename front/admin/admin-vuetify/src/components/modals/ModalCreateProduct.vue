<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal">
            <button @click="closeModal" class="close-button">X</button>
            <h2 class="modal-title">{{ title }}</h2>
            <form @submit.prevent="createProduct">
                <div class="form-group">
                    <label for="productName">Nombre del Producto:</label>
                    <input type="text" id="productName" v-model="product.name" required />
                </div>

                <div class="form-group">
                    <label for="productDescription">Descripción:</label>
                    <textarea id="productDescription" v-model="product.description" required></textarea>
                </div>

                <div class="form-group">
                    <label for="productPrice">Precio:</label>
                    <input type="number" id="productPrice" v-model="product.price" required min="0" />
                </div>

                <button type="submit">Crear Producto</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Crear Producto',
    },
    modelValue: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue', 'productCreated'])

const isOpen = ref(props.modelValue)
const product = ref({
    name: '',
    description: '',
    price: null,
})

const closeModal = () => {
    isOpen.value = false
    emit('update:modelValue', false)
    resetForm()
}

const createProduct = () => {
    emit('productCreated', { ...product.value })
    closeModal()
}

const resetForm = () => {
    product.value = {
        name: '',
        description: '',
        price: null,
    }
}

watch(
    () => props.modelValue,
    (newVal) => {
        isOpen.value = newVal
    }
)
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    color: black;
    /* Asegura que todo el texto en el modal sea negro */
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: black;
    /* Asegura que el botón de cerrar tenga texto negro */
}

.modal-title {
    color: black;
    /* Asegura que el título tenga texto negro */
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: black;
    /* Asegura que las etiquetas tengan texto negro */
}

input,
textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: black;
    /* Asegura que el texto en los campos de entrada sea negro */
}

button {
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button[type="submit"]:hover {
    background-color: #45a049;
}
</style>