<template>
  <q-page class="page-root">
    <div class="app-shell">
      <div class="hero-card q-pa-lg q-mb-xl q-shadow-2 rounded-borders">
        <div class="hero-inner">
          <div class="hero-text">
            <div class="brand">Gestor • Siniestros</div>
            <h1 class="hero-title">Sistema de gestión de siniestros</h1>
            <p class="hero-subtitle">Administra y controla tus siniestros con foco en claridad y velocidad.</p>
            <div class="hero-actions">
              <q-btn to="/claims" label="Ver Siniestros" color="primary" unelevated class="action-primary" />
              <q-btn to="/claims/new" label="Reportar" color="primary" flat class="action-secondary" />
            </div>
          </div>
          <div class="hero-illustration">
            <q-icon name="assignment" size="120px" color="primary" />
          </div>
        </div>
      </div>

      <div class="container">
        <div class="features-grid">
          <q-card class="md-card">
            <q-card-section>
              <div class="md-icon"><q-icon name="manage_accounts" size="48px" color="primary" /></div>
              <div class="md-title">Gestión Completa</div>
              <div class="md-desc">Información consolidada por siniestro y accesos rápidos.</div>
            </q-card-section>
          </q-card>

          <q-card class="md-card">
            <q-card-section>
              <div class="md-icon"><q-icon name="timeline" size="48px" color="info" /></div>
              <div class="md-title">Seguimiento</div>
              <div class="md-desc">Estados claros y notificaciones para cada cambio relevante.</div>
            </q-card-section>
          </q-card>

          <q-card class="md-card">
            <q-card-section>
              <div class="md-icon"><q-icon name="verified_user" size="48px" color="positive" /></div>
              <div class="md-title">Seguridad</div>
              <div class="md-desc">Control de accesos y cifrado de datos sensibles.</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <footer class="footer q-mt-xl">
        <div class="container footer-inner">
          <div>© 2026 Sistema de Gestión de Siniestros</div>
          <div class="muted">Todos los derechos reservados</div>
        </div>
      </footer>
    </div>
  </q-page>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.page-root {
  padding: 1.5rem 0;
}

.app-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-card {
  display: flex;
  align-items: center;
  background: var(--q-secondary);
  border-radius: 12px;
}

.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.hero-text {
  max-width: 64%;
}

.brand {
  font-weight: 600;
  color: var(--q-primary);
  margin-bottom: 0.5rem;
}

.hero-title {
  font-size: 2.25rem;
  margin: 0;
  font-weight: 700;
  color: #222;
}

.hero-subtitle {
  margin-top: 0.5rem;
  color: #555;
}

.hero-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28%;
}

.hero-actions {
  margin-top: 1.25rem;
  display: flex;
  gap: 0.75rem;
}

.action-primary {
  border-radius: 8px;
}

.action-secondary {
  color: var(--q-primary);
}

.section-title {
  font-size: 1.5rem;
  margin: 0.75rem 0 1rem 0;
  color: #222;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.md-card {
  border-radius: 10px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.md-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.08);
}

.md-icon {
  margin-bottom: 0.5rem;
}

.md-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.md-desc {
  color: #666;
  font-size: 0.95rem;
}

.footer {
  margin-top: 2rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  color: var(--q-secondary);
  align-items: center;
}

.muted {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .hero-inner {
    flex-direction: column;
  }

  .hero-text {
    max-width: 100%;
  }

  .hero-illustration {
    width: 100%;
    margin-top: 1rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }
}
</style>
