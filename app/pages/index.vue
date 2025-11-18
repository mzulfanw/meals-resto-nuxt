<template>
  <div class="container home-page">
    <section class="hero card">
      <div class="hero-text">
        <span class="badge">Menu baru minggu ini</span>
        <h1>Masakan artisanal dengan sentuhan rumahan.</h1>
        <p>
          MealsResto menggabungkan bahan segar pilihan petani lokal dengan resep klasik TheMealDB untuk
          menghadirkan pengalaman bersantap modern.
        </p>
        <div class="cta">
          <NuxtLink to="/gallery" class="btn">Pesan Sekarang</NuxtLink>
          <button class="btn ghost" @click="scrollToFeatured">Jelajahi menu</button>
        </div>
        <div class="hero-stats">
          <div>
            <p class="value">{{ featuredMeals.length }}+</p>
            <p class="label">Pilihan menu</p>
          </div>
          <div>
            <p class="value">4.9/5</p>
            <p class="label">Rating pelanggan</p>
          </div>
          <div>
            <p class="value">24/7</p>
            <p class="label">Layanan aktif</p>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <NuxtImg
          src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=70"
          alt="Meals hero"
          width="600"
          height="420"
          format="webp"
          sizes="(max-width: 640px) 100vw, 500px"
          loading="lazy"
        />
        <div class="floating-card">
          <p>Chef Notes</p>
          <ul>
            <li v-for="note in chefNotes" :key="note">{{ note }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="card highlight">
      <div>
        <p class="badge">Kategori unggulan</p>
        <h2>Eksplorasi rasa dari berbagai kategori</h2>
      </div>
      <div class="highlight-grid">
        <article v-for="category in highlightedCategories" :key="category" class="highlight-card">
          <p>{{ category }}</p>
          <small>Pilihan chef</small>
        </article>
      </div>
    </section>

    <section ref="featuredSection" class="featured">
      <div class="section-heading">
        <h2>Menu favorit hari ini</h2>
        <NuxtLink to="/gallery" class="btn ghost">Lihat semua</NuxtLink>
      </div>
      <div v-if="isLoading" class="empty-state">Memuat menu ...</div>
      <div v-else-if="!featuredMeals.length" class="empty-state">Menu belum tersedia</div>
      <div v-else class="grid">
        <MealCard
          v-for="meal in featuredMeals"
          :key="meal.id"
          :meal="meal"
          :show-description="true"
          @view="setActiveMeal"
        />
      </div>
    </section>

    <section v-if="activeMeal" class="card detail">
      <div>
        <p class="badge">Tentang menu</p>
        <h2>{{ activeMeal.name }}</h2>
        <p class="page-subtitle">{{ activeMeal.instructions }}</p>
        <div class="pill">Asal: {{ activeMeal.area }}</div>
        <p class="page-subtitle">Bahan:</p>
        <ul class="ingredient-list">
          <li v-for="(item, index) in activeMeal.ingredients" :key="index">{{ item }}</li>
        </ul>
      </div>
      <NuxtImg
        :src="activeMeal.thumbnail"
        :alt="activeMeal.name"
        width="500"
        height="380"
        format="webp"
        sizes="(max-width: 640px) 100vw, 420px"
        loading="lazy"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMealsStore } from '~/stores/meals'
import type { Meal } from '~/types/meals'

const mealsStore = useMealsStore()
await mealsStore.ensureInitialized()

useHead({
  title: 'Beranda',
  meta: [
    {
      name: 'description',
      content: 'Beranda MealsResto menampilkan highlight menu favorit dan kurasi kategori unggulan.'
    }
  ]
})

const { featuredMeals, categories, isLoadingMeals } = storeToRefs(mealsStore)
const chefNotes = ['Spice Lab', 'Local Farms', 'Slow Cooking', 'Zero MSG']
const isLoading = computed(() => isLoadingMeals.value)
const highlightedCategories = computed(() => categories.value.slice(1, 4))
const featuredSection = ref<HTMLElement | null>(null)

const activeMeal = ref<Meal | null>(null)
const setActiveMeal = (meal: Meal) => {
  activeMeal.value = meal
}

const scrollToFeatured = () => {
  featuredSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  align-items: center;
  padding: 2.5rem;
}

.hero-text h1 {
  margin: 0.5rem 0;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
}

.cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 2rem;
  gap: 1.5rem;

  .value {
    font-size: 1.8rem;
    margin: 0;
  }

  .label {
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
  }
}

.hero-visual {
  position: relative;

  :deep(img) {
    border-radius: 24px;
    width: 100%;
    max-height: 420px;
    object-fit: cover;
  }
}

.floating-card {
  position: absolute;
  bottom: -1rem;
  left: 1rem;
  background: rgba(10, 12, 16, 0.85);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);

  ul {
    padding-left: 1.25rem;
    margin: 0.4rem 0 0;
  }
}

.highlight {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.highlight-card {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
}

.featured {
  padding: 0.5rem 0;
}

.detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;

  :deep(img) {
    border-radius: 22px;
    width: 100%;
    object-fit: cover;
  }
}

.ingredient-list {
  padding-left: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 640px) {
  .hero {
    padding: 1.75rem;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
