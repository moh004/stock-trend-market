<script setup>
   import { ref, onMounted } from 'vue';
   import apiClient from '@/API/axios';

const stocks = ref([]);

const fetchStocks = async () => {
  try {
    const response = await apiClient.get('/stocks');
    console.log(stocks.value)
    stocks.value = response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
};

onMounted(fetchStocks);

// Handlers
function buyStock(name) {
  console.log(`Buying ${name}`);
}

function sellStock(name) {
  console.log(`Selling ${name}`);
}
</script>

<template>
    <div v-for="stock in stocks" :key="stock._id" class="flex flex-col items-center justify-between p-6 bg-gray-50 border border-gray-300 rounded-xl shadow-lg w-80 m-4">
    <!-- Stock Header -->
    <div class="flex justify-between items-center w-full">
      <p class="text-xl font-bold text-gray-800">{{ stock.symbol }}</p>
      <p class="text-lg font-medium text-gray-600">{{ stock.name }}</p>
    </div>

    <!-- Price and Trend -->
    <div class="flex justify-between items-center w-full mt-4">
      <div>
        <p class="text-lg font-semibold text-gray-900">${{ stock.price }}</p>
        <p :class="[ stock.trend === 'up' ? 'text-green-500' : 'text-red-500', 'text-sm font-medium mt-1']">
          {{ (trend === 'up') ? '▲' : '▼' }} 
        </p>
      </div>
      <div class="text-right">
        <p class="text-sm font-medium text-gray-500">Volume:</p>
        <p class="text-sm font-semibold text-gray-800">{{ stock.volume }}</p>
      </div>
    </div>

    <!-- Buy and Sell Buttons -->
    <div class="flex gap-4 mt-6">
      <button class="px-6 py-2 bg-green-500 text-white font-medium rounded-full hover:bg-green-400" @click="buyStock(stock.name)">Buy</button>
      <button class="px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-400" @click="sellStock(stock.name)">Sell</button>
    </div>
  </div>
</template>