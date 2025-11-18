<template>
  <section class="filter card">
    <div class="field search">
      <label for="search">Cari menu favorit</label>
      <div class="search-wrapper">
        <input
          id="search"
          v-model="localQuery"
          type="text"
          placeholder="Contoh: chicken, beef, vegan"
        >
        <span class="hint">Menampilkan {{ filteredCount }} menu</span>
      </div>
    </div>
    <div class="field categories">
      <label>Kategori</label>
      <div class="category-list">
        <button
          v-for="category in categories"
          :key="category"
          class="pill-btn"
          :class="{ active: category === activeCategory }"
          @click="() => selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMealsStore } from '~/stores/meals'

const mealsStore = useMealsStore()
const { categories, selectedCategory, filteredMeals, searchQuery } = storeToRefs(mealsStore)

const localQuery = ref(searchQuery.value)
watch(
  localQuery,
  (value) => {
    mealsStore.setSearchQuery(value)
  }
)

watch(searchQuery, (value) => {
  if (value !== localQuery.value) {
    localQuery.value = value
  }
})

const selectCategory = (category: string) => {
  mealsStore.setCategory(category)
}

const activeCategory = computed(() => selectedCategory.value)
const filteredCount = computed(() => filteredMeals.value.length)
</script>

<style scoped lang="scss">
.filter {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.category-list {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.pill-btn {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: inherit;
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    border-color: #f4a261;
    background: rgba(244, 162, 97, 0.12);
    color: #f4a261;
  }
}
</style>
