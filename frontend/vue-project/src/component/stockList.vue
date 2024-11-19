<script setup>
   import { ref, onMounted } from 'vue';
   import apiClient from '@/API/axios';

const stocks = ref([]);

defineProps({
     showBnt: {
       type: Boolean,
       default: false
     }
 })

const fetchStocks = async () => {
  try {
    const response = await apiClient.get('/cryptos');
    stocks.value = response.data;
    console.log(stocks.value.slice(0 , showBnt? 3 : stocks.length)) 
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
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
    <div v-for="stock in stocks.slice(0 , !showBnt? 9 : stocks.length)" :key="stock._id" class="flex flex-col  p-6 bg-gray-50 border border-gray-300 rounded-xl shadow-lg w-80 m-4">
    <!-- Stock Header -->


     <div class="flex">
    <div class="flex  w-full">
      <p class="text-xl  font-bold mr-3">#{{ stock.market_cap_rank }}</p>
      <img :src="stock.image" class="w-12 h-12 rounded-full object-cover" alt="stock/currencyLOGO">
    </div>
      <div class="flex flex-col">
      <p class="text-lg font-bold">{{ stock.symbol }}</p>
      <p class="text-sm text-gray-500">{{ stock.name }}</p>
    </div>
    
  </div>

    <!-- Price and Trend -->
    <div class="flex justify-between items-center w-full mt-4">
      <div>
        <p class="text-lg font-semibold text-gray-900">${{ stock.current_price }}</p>
        <p :class="[ stock.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500', 'text-sm font-medium mt-1']">
         <span class="block text-gray-600 text-xs">in 24h</span>{{ (stock.price_change_percentage_24h) }} {{  (stock.price_change_percentage_24h >= 0) ? '▲' : '▼' }} 
        </p>
      </div>
      <div class="text-right">
        <p class="text-sm font-medium text-gray-500">Volume:</p>
        <p class="text-sm font-semibold text-gray-800">{{ stock.total_volume || "N/A" }}</p>
      </div>
    </div>

    <!-- Buy and Sell Buttons -->
    <div class="flex gap-4 mt-6">
      <button class="px-6 py-2 bg-green-500 text-white font-medium rounded-full hover:bg-green-400" @click="buyStock(stock.name)">Buy</button>
      <button class="px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-400" @click="sellStock(stock.name)">Sell</button>
    </div>
  </div>
</div>  
</template>