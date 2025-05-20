<script setup>
    import navbar from './component/navbar.vue';
    import { RouterView } from 'vue-router';
    import Footer from './component/footer.vue';
</script>

<template>
      <navbar />
    <div class="bg-gray-800 text-gray-500 p-12">
        <RouterView />
     </div>
      <Footer />
</template>

