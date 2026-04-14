<template>
  <q-page class="minimalist-page">
    <div class="minimalist-container">
      <div class="page-header">
        <q-btn flat icon="arrow_back" to="/claims" class="back-btn" size="sm" round />
        <h1 class="minimalist-title">Nuevo Siniestro</h1>
      </div>

      <q-form @submit.prevent="onSubmit" class="minimalist-form">
        <div class="form-group">
          <label class="form-label">Descripción</label>
          <q-input v-model="description" placeholder="Describe el siniestro..." outlined type="textarea" rows="4"
            class="minimalist-input" :rules="[val => val && val.length >= 10 || 'Mínimo 10 caracteres']" />
        </div>

        <div class="form-group">
          <label class="form-label">Ubicación</label>
          <q-input v-model="location" placeholder="Dirección del siniestro" outlined class="minimalist-input"
            :rules="[val => val && val.length >= 10 || 'Mínimo 10 caracteres']" />
        </div>

        <div class="form-group">
          <label class="form-label">Fecha del siniestro</label>
          <q-input v-model="incidentDate" type="date" outlined class="minimalist-input" />
        </div>

        <div class="form-actions">
          <q-btn label="Cancelar" flat to="/claims" class="btn-minimalist-outline" no-caps />
          <q-btn label="Crear Siniestro" type="submit" class="btn-minimalist" no-caps unelevated />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify, Loading } from 'quasar'
import { createClaim } from 'src/services/claimService'
import { sanitizeString, sanitizeDate, validateStringLength } from 'src/utils/sanitizer'
import type { CreateClaimDTO } from 'src/interfaces/models'

const router = useRouter()

const description = ref('')
const location = ref('')
const incidentDate = ref('')

function showNotify(opts: { type?: string; message: string }) {
  Notify.create({
    type: opts.type || 'info',
    message: opts.message
  })
}

async function onSubmit() {
  // Sanitizar y validar en cliente usando librerías especializadas
  const sanitizedDescription = sanitizeString(description.value)
  if (!validateStringLength(sanitizedDescription, 10, 1000)) {
    showNotify({ type: 'negative', message: 'La descripción debe tener entre 10 y 1000 caracteres' })
    return
  }

  const sanitizedLocation = sanitizeString(location.value)
  if (!validateStringLength(sanitizedLocation, 3, 200)) {
    showNotify({ type: 'negative', message: 'La ubicación debe tener entre 3 y 200 caracteres' })
    return
  }

  const sanitizedDate = sanitizeDate(incidentDate.value)
  if (!sanitizedDate) {
    showNotify({ type: 'negative', message: 'Fecha del siniestro inválida' })
    return
  }

  const payload: CreateClaimDTO = {
    userId: 'anonymous',
    description: sanitizedDescription,
    incidentDate: sanitizedDate,
    location: sanitizedLocation,
    images: []
  }

  Loading.show({
    message: 'Creando siniestro...',
    spinnerColor: 'black'
  })

  try {
    await createClaim(payload)
    await router.push('/claims')
  } catch (err: unknown) {
    let message = 'Error al crear el siniestro'
    if (err && typeof err === 'object') {
      const e = err as { response?: { data?: { message?: string } }; message?: string }
      message = e.response?.data?.message || e.message || message
    }
    showNotify({ type: 'negative', message })
    console.error('createClaim error:', err)
  } finally {
    Loading.hide()
  }
}
</script>

<style scoped lang="scss">
.minimalist-page {
  background: #fafafa;
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

.minimalist-form {
  max-width: 600px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 0.5rem;
}

.minimalist-input {
  :deep(.q-field__control) {
    border-radius: 6px;
    border-color: #e0e0e0;
  }

  :deep(.q-field__control:hover) {
    border-color: #000;
  }

  :deep(.q-field__control:focus-within) {
    border-color: #000;
  }
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.btn-minimalist {
  background: #000;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-minimalist-outline {
  background: transparent;
  color: #000;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    border-color: #000;
  }
}
</style>
