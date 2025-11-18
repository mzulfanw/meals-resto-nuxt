<template>
  <div class="container checkout-page">
    <header>
      <p class="badge">Checkout</p>
      <h1 class="page-title">Konfirmasi pesanan</h1>
      <p class="page-subtitle">Lengkapi data pengiriman dan pilih metode pembayaran.</p>
    </header>

    <section class="two-column">
      <form class="card form" @submit.prevent="handleSubmit">
        <div class="field">
          <label for="name">Nama lengkap</label>
          <input id="name" v-model="form.name" required placeholder="Nama penerima">
        </div>
        <div class="field">
          <label for="phone">Nomor telepon</label>
          <input id="phone" v-model="form.phone" required placeholder="+62 812..." type="tel">
        </div>
        <div class="field">
          <label for="address">Alamat lengkap</label>
          <textarea id="address" v-model="form.address" rows="4" required></textarea>
        </div>
        <div class="field">
          <label for="delivery">Metode pengiriman</label>
          <select id="delivery" v-model="form.delivery">
            <option value="pickup">Ambil sendiri</option>
            <option value="delivery">Diantar kurir</option>
          </select>
        </div>
        <div class="field">
          <label for="notes">Catatan tambahan</label>
          <textarea id="notes" v-model="form.notes" rows="3" placeholder="Contoh: tidak pedas"></textarea>
        </div>
        <button class="btn" type="submit" :disabled="!cartItems.length">Bayar sekarang</button>
      </form>

      <aside class="card summary">
        <p class="badge">Ringkasan pesanan</p>
        <div v-if="!cartItems.length" class="empty-state">Keranjang kosong.</div>
        <ul v-else class="checkout-list">
          <li v-for="item in cartItems" :key="item.meal.id">
            <span>{{ item.meal.name }} × {{ item.quantity }}</span>
            <strong>{{ formatCurrency(item.quantity * item.meal.price) }}</strong>
          </li>
        </ul>
        <div class="summary-row">
          <span>Total</span>
          <strong>{{ formatCurrency(cartTotal) }}</strong>
        </div>
      </aside>
    </section>

    <transition name="toast">
      <div v-if="notification" class="toast">
        {{ notification }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMealsStore } from '~/stores/meals'
import { formatCurrency } from '~/utils/format'

const mealsStore = useMealsStore()
const { cart, cartTotal } = storeToRefs(mealsStore)

useHead({
  title: 'Checkout',
  meta: [
    {
      name: 'description',
      content: 'Lengkapi data pengiriman dan konfirmasi pembayaran di halaman checkout MealsResto.'
    }
  ]
})

const cartItems = computed(() => cart.value)

const form = reactive({
  name: '',
  phone: '',
  address: '',
  delivery: 'delivery',
  notes: ''
})

const notification = ref('')
const handleSubmit = () => {
  notification.value = 'Pesanan akan diproses'
  setTimeout(() => {
    notification.value = ''
  }, 2500)
}
</script>

<style scoped lang="scss">
.checkout-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkout-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  li {
    display: flex;
    justify-content: space-between;
  }
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #2a9d8f;
  color: #fff;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .toast {
    left: 1rem;
    right: 1rem;
    bottom: 1.5rem;
    text-align: center;
  }
}
</style>
