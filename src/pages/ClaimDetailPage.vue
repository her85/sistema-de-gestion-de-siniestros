<template>
  <q-page class="minimalist-page">
    <div class="minimalist-container">
      <div class="page-header">
        <q-btn flat icon="arrow_back" to="/claims" class="back-btn" size="sm" round />
        <h1 class="minimalist-title">Detalle del Siniestro</h1>
      </div>

      <div v-if="claim" class="detail-card minimalist-card">
        <div class="detail-claimNumber">
          <h4> Siniestro {{ claim.claimNumber }}</h4>
        </div>
        <div class="detail-header">
          <span class="minimalist-badge status-badge">{{ claim.status }}</span>
          <span class="claim-date">{{ formatDate(claim.incidentDate) }}</span>
        </div>

        <!-- Actualizar Estado -->
        <!-- Nota: sección oculta para estados PAGADO/RECHAZO. -->
        <div v-if="claim && claim.status !== 'PAGADO' && claim.status !== 'RECHAZADO'"
          class="update-status-section minimalist-card">
          <h3 class="section-title">Actualizar Estado</h3>
          <div class="status-form">
            <q-select v-model="newStatus" :options="filteredStatusOptions" label="Nuevo Estado" outlined dense
              class="status-select" />
            <!-- OBS: El campo Monto se muestra cuando `newStatus === 'APROBADO'`. -->
            <q-input v-if="newStatus === 'APROBADO'" v-model.number="newAmount" label="Monto" type="number" outlined
              dense prefix="$" class="amount-input" />
            <div v-if="newStatus === 'APROBADO'"
              :class="['amount-hint', (newAmount == null || newAmount <= 0) ? 'invalid' : '']">
              El monto debe ser mayor a 0
            </div>
            <q-btn @click="updateStatus"
              :disable="!newStatus || (newStatus === 'APROBADO' && (newAmount == null || newAmount <= 0))"
              :loading="updating" color="primary" label="Actualizar" unelevated class="btn-minimalist update-btn" />
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">Descripción</h3>
          <p class="section-content">{{ claim.description }}</p>
        </div>

        <div class="detail-section">
          <h3 class="section-title">Ubicación</h3>
          <p class="section-content">{{ claim.location }}</p>
        </div>

        <div v-if="claim.amount" class="detail-section">
          <h3 class="section-title">Monto</h3>
          <p class="section-content amount">{{ formatAmount(claim.amount) }}</p>
        </div>

        <div v-if="claim.images?.length" class="detail-section">
          <h3 class="section-title">Imágenes</h3>
          <div class="images-grid">
            <div v-for="img in claim.images" :key="img.id" class="image-item">
              <q-img :src="img.url" class="claim-image" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="loading-state">
        <q-spinner size="40px" color="primary" />
        <p class="minimalist-subtitle">Cargando...</p>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getClaim, updateClaimStatus } from 'src/services/claimService'
import type { Claim } from 'src/interfaces/models'
import { Notify, Loading } from 'quasar'

const route = useRoute()
const claim = ref<Claim | null>(null)
const newStatus = ref<string>('')
const newAmount = ref<number | null>(null)
const updating = ref(false)

const allowedTransitions: Record<string, string[]> = {
  'PENDIENTE': ['EN REVISIÓN'],
  'EN REVISIÓN': ['APROBADO', 'RECHAZADO'],
  'APROBADO': ['PAGADO'],
  'RECHAZADO': [],
  'PAGADO': []
}

const filteredStatusOptions = computed(() => {
  const current = claim.value?.status || ''
  return allowedTransitions[current] || []
})

async function load() {
  try {
    const id = route.params.id as string
    claim.value = await getClaim(id)
    // Limpiar selección inicial para forzar elegir solo de las transiciones permitidas
    newStatus.value = ''
    newAmount.value = claim.value?.amount ?? null
  } finally {
    Loading.hide()
  }
}

async function updateStatus() {
  if (!claim.value || !newStatus.value) return

  const currentStatus = claim.value.status

  if (!allowedTransitions[currentStatus || '']?.includes(newStatus.value)) {
    Notify.create({
      type: 'negative',
      message: `No se puede cambiar de ${currentStatus} a ${newStatus.value}`,
      position: 'top'
    })
    return
  }

  // Validación: para 'APROBADO' el monto debe existir y ser > 0.
  if (newStatus.value === 'APROBADO' && (newAmount.value == null || newAmount.value <= 0)) {
    Notify.create({
      type: 'negative',
      message: 'El monto debe ser mayor a 0 para el estado APROBADO',
      position: 'top'
    })
    return
  }

  Loading.show({
    message: 'Actualizando estado...',
    spinnerColor: 'black'
  })

  try {
    updating.value = true
    const id = route.params.id as string
    claim.value = await updateClaimStatus(id, newStatus.value, newAmount.value ?? undefined)

    Notify.create({
      type: 'positive',
      message: 'Estado actualizado correctamente',
      position: 'top'
    })
  } catch (error: unknown) {
    // Nota: extracción robusta pero verbosa del mensaje de error.
    // Se puede simplificar con `axios.isAxiosError(error)` o adaptando al shape del backend.
    const errorMessage = error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data
      ? String(error.response.data.error)
      : 'Error al actualizar el estado';

    Notify.create({
      type: 'negative',
      message: errorMessage,
      position: 'top'
    })
  } finally {
    updating.value = false
    Loading.hide()
  }
}

function formatDate(d?: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount)
}

onMounted(load)
</script>

<style scoped lang="scss">
.minimalist-page {
  background: #f7f7f8;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  color: #000;
}

.detail-card {
  max-width: 800px;
  padding: 1.25rem;
}

.detail-claimNumber {
  margin-bottom: 1rem;

  h4 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 1.5rem;
}

.status-badge {
  text-transform: uppercase;
  font-size: 0.625rem;
  letter-spacing: 0.05em;
  padding: 0.375rem 0.75rem;
  background: #f5f5f7;
  color: #111;
  border-radius: 8px;
}

.claim-date {
  font-size: 0.875rem;
  color: #999;
}

.detail-section {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.update-status-section {
  padding: 1rem;
  margin-bottom: 1rem;
}

.status-form {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.status-select {
  flex: 1;
  min-width: 150px;
}

.amount-input {
  flex: 1;
  min-width: 120px;
}

.amount-hint {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #666;
}

.amount-hint.invalid {
  color: #d32f2f;
  font-weight: 600;
}

.update-btn {
  align-self: flex-start;
  margin-top: 0.25rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
  margin: 0 0 0.5rem 0;
}

.section-content {
  font-size: 1rem;
  color: #000;
  margin: 0;
  line-height: 1.6;

  &.amount {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

.image-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.claim-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 1rem;
}
</style>
