<template>
  <header class="main-header">
    <div class="container header-content">
      <NuxtLink to="/" class="brand">
        <span class="brand-mark">Meals</span>
        <span class="brand-name">Resto</span>
      </NuxtLink>

      <nav class="nav">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" active-class="active">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="header-actions">
        <NuxtLink to="/cart" class="cart-pill" aria-label="Lihat keranjang">
          <span class="icon">🛒</span>
          <span class="count">{{ cartCount }}</span>
        </NuxtLink>
        <NuxtLink to="/gallery" class="btn ghost">Lihat Menu</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMealsStore } from '~/stores/meals'

const navItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Galeri', to: '/gallery' },
  { label: 'Keranjang', to: '/cart' },
  { label: 'Checkout', to: '/checkout' }
]

const mealsStore = useMealsStore()
const { cartItemCount } = storeToRefs(mealsStore)
const cartCount = computed(() => cartItemCount.value)
</script>

<style scoped lang="scss">
.main-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 12, 16, 0.7);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 700;
  letter-spacing: 0.08em;

  .brand-mark {
    background: #f4a261;
    border-radius: 12px;
    padding: 0.35rem 0.6rem;
    color: #101114;
  }

  .brand-name {
    font-size: 1.1rem;
  }
}

.nav {
  display: flex;
  gap: 1.5rem;
  font-weight: 500;

  a {
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.2s ease;

    &.active,
    &:hover {
      color: #fff;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cart-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.count {
  font-weight: 600;
}

@media (max-width: 820px) {
  .nav {
    display: none;
  }

  .header-actions {
    margin-left: auto;
  }
}
</style>
