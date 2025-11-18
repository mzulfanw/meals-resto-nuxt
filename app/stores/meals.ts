/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from "pinia";
import type { CartItem, Meal } from "~/types/meals";

const normalizeMeal = (raw: Record<string, any>): Meal => {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i += 1) {
    const value = raw[`strIngredient${i}`];
    const measure = raw[`strMeasure${i}`];
    if (value && value.trim()) {
      ingredients.push(`${value.trim()}${measure ? ` - ${measure}` : ""}`);
    }
  }

  const id = raw.idMeal ?? `meal-${Math.random().toString(36).slice(2, 10)}`;
  const price = 18000 + (Number.parseInt(String(id).slice(-2), 10) % 40) * 1000;

  return {
    id: String(id),
    name: raw.strMeal ?? "Menu Spesial",
    category: raw.strCategory ?? "Signature",
    area: raw.strArea ?? "Fusion",
    instructions: raw.strInstructions ?? "",
    thumbnail: raw.strMealThumb ?? "",
    tags: raw.strTags
      ? raw.strTags.split(",").map((tag: string) => tag.trim())
      : [],
    price,
    ingredients,
  };
};

export const useMealsStore = defineStore("meals", () => {
  const meals = ref<Meal[]>([]);
  const categories = ref<string[]>(["Semua"]);
  const selectedCategory = ref("Semua");
  const searchQuery = ref("");
  const isLoadingMeals = ref(false);
  const initialized = ref(false);
  const cart = ref<CartItem[]>([]);

  const config = useRuntimeConfig();

  const filteredMeals = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return meals.value.filter((meal) => {
      const matchCategory =
        selectedCategory.value === "Semua" ||
        meal.category === selectedCategory.value;
      const matchQuery =
        !query ||
        meal.name.toLowerCase().includes(query) ||
        meal.ingredients.some((item) => item.toLowerCase().includes(query));
      return matchCategory && matchQuery;
    });
  });

  const featuredMeals = computed(() => filteredMeals.value.slice(0, 6));
  const cartItemCount = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  );
  const cartTotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity * item.meal.price, 0)
  );

  const fetchMeals = async (query = "") => {
    try {
      isLoadingMeals.value = true;
      const data = await $fetch<{ meals: Record<string, any>[] | null }>(
        `${config.public.mealsApiBase}/search.php`,
        { params: { s: query } }
      );
      meals.value = (data.meals ?? []).map(normalizeMeal);
    } catch (error) {
      console.error("Gagal memuat menu", error);
    } finally {
      isLoadingMeals.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await $fetch<{ meals: { strCategory: string }[] | null }>(
        `${config.public.mealsApiBase}/list.php`,
        { params: { c: "list" } }
      );
      const categoryNames =
        data.meals?.map((item) => item.strCategory).filter(Boolean) ?? [];
      categories.value = ["Semua", ...categoryNames];
    } catch (error) {
      console.error("Gagal memuat kategori", error);
    }
  };

  const ensureInitialized = async () => {
    if (initialized.value) return;
    await Promise.all([fetchCategories(), fetchMeals()]);
    initialized.value = true;
  };

  const setSearchQuery = (value: string) => {
    searchQuery.value = value;
  };

  const setCategory = (category: string) => {
    selectedCategory.value = category;
  };

  const addToCart = (meal: Meal) => {
    const existing = cart.value.find((item) => item.meal.id === meal.id);
    if (existing) {
      existing.quantity += 1;
      return;
    }
    cart.value.push({
      meal,
      quantity: 1,
    });
  };

  const decreaseCartItem = (mealId: string) => {
    const target = cart.value.find((item) => item.meal.id === mealId);
    if (!target) return;
    if (target.quantity <= 1) {
      cart.value = cart.value.filter((item) => item.meal.id !== mealId);
    } else {
      target.quantity -= 1;
    }
  };

  const removeFromCart = (mealId: string) => {
    cart.value = cart.value.filter((item) => item.meal.id !== mealId);
  };

  const clearCart = () => {
    cart.value = [];
  };

  return {
    meals,
    categories,
    selectedCategory,
    searchQuery,
    isLoadingMeals,
    cart,
    filteredMeals,
    featuredMeals,
    cartItemCount,
    cartTotal,
    ensureInitialized,
    fetchMeals,
    fetchCategories,
    setSearchQuery,
    setCategory,
    addToCart,
    decreaseCartItem,
    removeFromCart,
    clearCart,
  };
});
