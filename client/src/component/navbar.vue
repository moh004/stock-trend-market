<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import logo from '../assets/image/logo.png';
import Axios from '../API/axios';

// Auth state
const isConnected = ref(false);

// Modal state
const showLogoutConfirm = ref(false);

// Check auth
const isAuth = async () => {
  try {
    const response = await Axios.get("/check-auth", { withCredentials: true });
    isConnected.value = response.data.isAuthenticated;
  } catch (error) {
    console.error("Auth check failed:", error);
  }
};

// Trigger modal
const logout = () => {
  showLogoutConfirm.value = true;
};

// Confirm logout
const confirmLogout = async () => {
  try {
    await Axios.delete("/logout");
    window.location.reload();
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  await isAuth();
});
</script>

<template>
  <nav class="bg-gradient-to-r from-blue-900 via-blue-300 to-green-900 border-b border-blue-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div class="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto rounded-full" :src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2">MOH CRYPTO</span>
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink to="/" class="text-white bg-blue-900 hover:bg-gray-900 rounded-md px-3 py-2">Home</RouterLink>
              <RouterLink v-if="!isConnected" to="/register" class="text-white hover:bg-green-500 rounded-md px-3 py-2">Register</RouterLink>
              <RouterLink v-if="!isConnected" to="/login" class="text-white hover:bg-green-500 rounded-md px-3 py-2">LogIn</RouterLink>
              <RouterLink v-if="isConnected" to="/profile" class="text-white hover:bg-gray-900 rounded-md px-3 py-2">Profile</RouterLink>
              <button v-if="isConnected" @click="logout" class="text-white hover:bg-red-700 rounded-md px-3 py-2">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutConfirm" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
      <h2 class="text-xl font-bold mb-4">Are you sure you want to <span class=" text-red-500 text-2xl">Logout</span>?</h2>
      <div class="flex justify-center space-x-4">
        <button @click="confirmLogout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes</button>
        <button @click="showLogoutConfirm = false" class="px-4 py-2 bg-green-600 text-black rounded hover:bg-green-400">No</button>
      </div>
    </div>
  </div>
</template>
