<script setup>
      import { ref } from 'vue';
      import axios from 'axios';

    // Define a reactive variable to hold the response message
    const message = ref('this is a msg');

    // Define the function to call the backend
    const fetchBackendData = async () => {
      try {
        const response = await axios.get('http://localhost:3000');
        message.value = response.data; // Set the response data to the message variable
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
</script>

<template>
      <button @click="fetchBackendData" class="flex bg-sky-500 justify-center align-middle">Test Backend Connection</button>
      <p>{{ message }}</p>
</template>

