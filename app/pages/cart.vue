<template>
  <div class="container cart-page">
    <header>
      <p class="badge">Keranjang</p>
      <h1 class="page-title">Pesanan Anda</h1>
      <p class="page-subtitle">
        {{ cartItems.length ? 'Periksa kembali pesanan sebelum checkout.' : 'Keranjang masih kosong.' }}
      </p>
    </header>

    <section class="two-column">
      <div class="card cart-list">
        <article v-for="item in cartItems" :key="item.meal.id" class="cart-item">
          <NuxtImg
            :src="item.meal.thumbnail"
            :alt="item.meal.name"
            width="160"
            height="160"
            format="webp"
            sizes="120px"
            loading="lazy"
          />
          <div class="info">
            <h3>{{ item.meal.name }}</h3>
            <p>{{ item.meal.category }} • {{ formatCurrency(item.meal.price) }}</p>
            <div class="controls">
              <button @click="() => decrease(item.meal.id)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="() => increase(item.meal)">+</button>
            </div>
          </div>
          <div class="price">
            {{ formatCurrency(item.quantity * item.meal.price) }}
            <button class="remove" @click="() => remove(item.meal.id)">Hapus</button>
          </div>
        </article>

        <div v-if="!cartItems.length" class="empty-state">
          Belum ada menu di keranjang.
        </div>
      </div>

      <aside class="card summary">
        <p class="badge">Ringkasan</p>
        <div class="summary-row">
          <span>Subtotal</span>
          <strong>{{ formatCurrency(cartTotal) }}</strong>
        </div>
        <div class="summary-row">
          <span>Pajak (10%)</span>
          <strong>{{ formatCurrency(tax) }}</strong>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <strong>{{ formatCurrency(cartTotal + tax) }}</strong>
        </div>
        <NuxtLink v-if="cartItems.length" to="/checkout" class="btn">
          Lanjut ke checkout
        </NuxtLink>
        <button v-if="cartItems.length" class="btn ghost" @click="clearCart">Kosongkan keranjang</button>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMealsStore } from '~/stores/meals'
import type { Meal } from '~/types/meals'
import { formatCurrency } from '~/utils/format'

const mealsStore = useMealsStore()
const { cart, cartTotal } = storeToRefs(mealsStore)

useHead({
  title: 'Keranjang',
  meta: [
    {
      name: 'description',
      content: 'Keranjang MealsResto menampilkan ringkasan pesanan, kuantitas, dan total biaya sebelum checkout.'
    }
  ]
})

const cartItems = computed(() => cart.value)
const tax = computed(() => cartTotal.value * 0.1)

const increase = (meal: Meal) => {
  mealsStore.addToCart(meal)
}

const decrease = (mealId: string) => {
  mealsStore.decreaseCartItem(mealId)
}

const remove = (mealId: string) => {
  mealsStore.removeFromCart(mealId)
}

const clearCart = () => {
  mealsStore.clearCart()
}
</script>

<style scoped lang="scss">
.cart-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1rem;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1rem;

  :deep(img) {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 14px;
  }
}

.info h3 {
  margin: 0 0 0.25rem;
}

.controls {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;

  button {
    border: none;
    background: transparent;
    color: inherit;
    font-size: 1.1rem;
    cursor: pointer;
  }
}

.price {
  text-align: right;
}

.remove {
  margin-top: 0.25rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.8);

  &.total {
    font-size: 1.2rem;
  }
}

@media (max-width: 720px) {
  .cart-item {
    grid-template-columns: 1fr;
    text-align: center;

    :deep(img) {
      margin: 0 auto;
    }

    .controls {
      justify-content: center;
    }

    .price {
      text-align: center;
    }
  }
}
</style>
