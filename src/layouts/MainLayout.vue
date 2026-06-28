<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="showHeader" elevated class="app-header">
      <q-toolbar class="app-toolbar">
        <router-link to="/"><q-btn flat dense round icon="home" aria-label="Inicio" class="q-mr-sm bg-primary text-white" />
        </router-link>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showHeader = computed(() => route.path !== '/')
</script>

<style scoped lang="scss">
.app-header {
  background: var(--q-secondary);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.app-toolbar {
  min-height: 64px;
  padding: 0 1rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;
}

.toolbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.search-input {
  width: 260px;
}

@media (max-width: 600px) {
  .search-input {
    display: none;
  }
}
</style>
