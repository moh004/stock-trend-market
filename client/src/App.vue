<script setup>
    import navbar from './component/navbar.vue';
    import { RouterView } from 'vue-router';
    import Footer from './component/footer.vue';
</script>

<template>
      <navbar />
      <RouterView />
      <Footer />
</template>

