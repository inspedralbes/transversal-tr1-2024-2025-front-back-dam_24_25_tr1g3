// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Create from '../views/Create.vue';
import Read from '../views/Read.vue';
import Update from '../views/Update.vue';
import Delete from '../views/Delete.vue';

const routes = [
  {
    path: '/',
    name: 'Read',
    component: Read,
  },
  {
    path: '/create',
    name: 'Create',
    component: Create,
  },
  {
    path: '/update/:id',
    name: 'Update',
    component: Update,
  },
  {
    path: '/delete/:id',
    name: 'Delete',
    component: Delete,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
