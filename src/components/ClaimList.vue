<template>
  <div class="claim-list">
    <div class="action-bar">
      <q-btn flat label="+ Nuevo siniestro" to="/claims/new" class="btn-minimalist" no-caps unelevated />
    </div>

    <q-table :rows="claims" :columns="columns" row-key="id" flat bordered
      @row-click="(evt, row) => $router.push(`/claims/${row.id}`)" :rows-per-page-options="[10, 25, 50]"
      class="claims-table">
      <template v-slot:body-cell-claimNumber="props">
        <q-td :props="props">
          <span class="claim-number">{{ props.value }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <span class="minimalist-badge status-badge">{{ props.value }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-incidentDate="props">
        <q-td :props="props">
          {{ formatDate(props.value) }}
        </q-td>
      </template>
      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <span class="claim-amount">{{ props.value ? formatAmount(props.value) : '-' }}</span>
        </q-td>
      </template>
    </q-table>

    <div v-if="claims.length === 0" class="empty-state">
      <p class="minimalist-subtitle">No hay siniestros registrados</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getClaims } from 'src/services/claimService'
import type { Claim } from 'src/interfaces/models'
import { Loading } from 'quasar'

const claims = ref<Claim[]>([])

const columns = [
  {
    name: 'claimNumber',
    label: 'Número',
    field: 'claimNumber',
    align: 'left' as const,
    sortable: true
  },
    {
    name: 'incidentDate',
    label: 'Fecha',
    field: 'incidentDate',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'amount',
    label: 'Monto',
    field: 'amount',
    align: 'right' as const,
    sortable: true
  }
]

async function load() {
  Loading.show({
    message: 'Cargando siniestros...',
    spinnerColor: 'black'
  })
  try {
    claims.value = await getClaims()
  } finally {
    Loading.hide()
  }
}

function formatDate(d?: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
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
.claim-list {
  width: 100%;
}

.action-bar {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-minimalist {
  background: #000;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.claims-table {
  :deep(.q-table__top) {
    padding: 0;
  }

  :deep(.q-table thead th) {
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #fafafa;
    color: #666;
  }

  :deep(.q-table tbody td) {
    font-size: 0.875rem;
  }

  :deep(.q-table tbody tr) {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9f9f9;
    }
  }
}

.claim-number {
  font-weight: 600;
  color: #000;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
  font-size: 0.625rem;
  letter-spacing: 0.05em;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.claim-amount {
  font-weight: 600;
  color: #000;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}
</style>
