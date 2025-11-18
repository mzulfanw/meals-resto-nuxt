<template>
  <div class="container gallery-page">
    <header>
      <p class="badge">Galeri</p>
      <h1 class="page-title">Kurasi menu pilihan chef</h1>
      <p class="page-subtitle">
        Gunakan pencarian dan filter kategori untuk menemukan menu sesuai
        suasana hati Anda.
      </p>
    </header>

    <MealFilter />

    <section class="gallery-content">
      <div>
        <div v-if="isLoading" class="empty-state">Memuat menu ...</div>
        <div v-else class="grid">
          <MealCard
            v-for="meal in mealsToShow"
            :key="meal.id"
            :meal="meal"
            @view="(meal) => (selectedMeal = meal)"
          />
        </div>
      </div>
      <aside v-if="selectedMeal" class="card detail">
        <p class="badge">Detail menu</p>
        <h2>{{ selectedMeal.name }}</h2>
        <p class="page-subtitle">{{ selectedMeal.instructions }}</p>
        <h3>Bahan utama</h3>
        <ul>
          <li v-for="(item, index) in selectedMeal.ingredients" :key="index">
            {{ item }}
          </li>
        </ul>
        <button class="btn" @click="handleQuickAdd">Tambah ke keranjang</button>
      </aside>
    </section>

    <div v-if="!mealsToShow.length && !isLoading" class="empty-state">
      Menu tidak ditemukan. Coba kata kunci lainnya.
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMealsStore } from "~/stores/meals";
import type { Meal } from "~/types/meals";

const mealsStore = useMealsStore();
await mealsStore.ensureInitialized();

useHead({
  title: "Galeri Menu",
  meta: [
    {
      name: "description",
      content:
        "Galeri MealsResto menampilkan daftar lengkap menu dengan fitur pencarian dan filter kategori.",
    },
  ],
});
const { filteredMeals, isLoadingMeals } = storeToRefs(mealsStore);

const selectedMeal = ref<Meal | null>(null);

watch(
  filteredMeals,
  (items) => {
    if (items.length && !selectedMeal.value) {
      selectedMeal.value = items[0] ?? null;
    } else if (!items.length) {
      selectedMeal.value = null;
    }
  },
  { immediate: true }
);

const mealsToShow = computed(() => filteredMeals.value);
const isLoading = computed(() => isLoadingMeals.value);

const handleQuickAdd = () => {
  if (!selectedMeal.value) return;
  mealsStore.addToCart(selectedMeal.value);
};
</script>

<style scoped lang="scss">
.gallery-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.gallery-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.detail {
  position: sticky;
  top: 100px;

  ul {
    padding-left: 1.25rem;
  }

  h3 {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 980px) {
  .gallery-content {
    grid-template-columns: 1fr;
  }

  .detail {
    position: static;
  }
}
</style>
