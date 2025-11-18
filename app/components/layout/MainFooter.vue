<template>
  <footer class="main-footer">
    <div class="container footer-content">
      <div>
        <p class="brand">MealsResto</p>
        <p>Masakan rumahan terbaik pilihan bahan segar.</p>
      </div>
      <div class="footer-links">
        <NuxtLink to="/">Beranda</NuxtLink>
        <NuxtLink to="/gallery">Galeri</NuxtLink>
        <NuxtLink to="/cart">Keranjang</NuxtLink>
        <NuxtLink to="/checkout">Checkout</NuxtLink>
      </div>
      <p class="copy">© {{ new Date().getFullYear() }} MealsResto</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.main-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2rem 1.5rem 3rem;
  background: rgba(12, 15, 19, 0.95);
  color: rgba(255, 255, 255, 0.75);
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.brand {
  font-weight: 600;
  letter-spacing: 0.12em;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  a {
    color: inherit;
  }
}

.copy {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
}
</style>
