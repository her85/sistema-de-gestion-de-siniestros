<template>
  <q-page class="minimalist-page">
    <div class="minimalist-container">
      <div class="space-y-lg">
        <h1 class="minimalist-title">Siniestros</h1>
        <div class="minimalist-card">
          <ClaimList />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ClaimList from 'components/ClaimList.vue'
</script>

<style scoped lang="scss">
.minimalist-page {
  background: #fafafa;
  min-height: 100vh;
}
</style>
