<template>
  <article class="meal-card card">
    <div class="image-wrapper">
      <NuxtImg
        :src="meal.thumbnail"
        :alt="meal.name"
        width="400"
        height="280"
        format="webp"
        loading="lazy"
        sizes="(max-width: 640px) 100vw, 320px"
      />
      <div class="price-pill">{{ formatCurrency(meal.price) }}</div>
    </div>
    <div class="content">
      <span class="pill category">{{ meal.category }}</span>
      <h3>{{ meal.name }}</h3>
      <p v-if="showDescription" class="description">
        {{ meal.instructions.slice(0, 120)
        }}{{ meal.instructions.length > 120 ? "…" : "" }}
      </p>
      <div class="tags">
        <span
          v-for="tag in meal.tags.slice(0, 2)"
          :key="tag"
          class="badge small"
          >{{ tag }}</span
        >
      </div>
    </div>
    <div class="actions">
      <button class="btn ghost" @click="viewDetails">Detail</button>
      <button class="btn" @click="handleAdd">Tambah</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Meal } from "~/types/meals";
import { useMealsStore } from "~/stores/meals";
import { formatCurrency } from "~/utils/format";

const props = defineProps<{
  meal: Meal;
  showDescription?: boolean;
}>();

const emit = defineEmits<{
  view: [meal: Meal];
}>();

const mealsStore = useMealsStore();
const handleAdd = () => {
  mealsStore.addToCart(props.meal);
};

const viewDetails = () => {
  emit("view", props.meal);
};
</script>

<style scoped lang="scss">
.meal-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;

  :deep(img) {
    width: 100%;
    height: 220px;
    object-fit: cover;
  }
}

.price-pill {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

h3 {
  margin: 0.35rem 0 0.15rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.description {
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 0;
}

.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.badge.small {
  font-size: 0.75rem;
  border-radius: 10px;
  width: auto;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

@media (max-width: 520px) {
  .image-wrapper :deep(img) {
    height: 180px;
  }

  .actions {
    flex-direction: column;

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
