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
    const response = await apiClient.get('/crypto');
    
    stocks.value = response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
};

onMounted(fetchStocks);
</script>

<template>
    <div class="container  mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4 text-center">Stock Data</h1>

    <div v-if="stocks.length > 0">
      <table class="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="px-4 py-2 border-b">#</th>
            <th class="px-4 py-2 border-b">Symbol</th>
            <th class="px-4 py-2 border-b">Name</th>
            <th class="px-4 py-2 border-b">Price</th>
            <th class="px-4 py-2 border-b">Trend</th>
            <th class="px-4 py-2 border-b">Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in stocks.slice(0 , !showBnt? 10 : stocks.length)" :key="stock._id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b">{{ stock.market_cap_rank }}</td>
            <td class="px-4 py-2 flex items-center"><img :src="stock.image" alt="logo" class="w-6 h-6 rounded-full mr-2"/></td>
            
            <td class="px-4 py-2 border-b">{{ stock.name }}</td>
            <td class="px-4 py-2 border-b">{{ stock.current_price }}</td>
            <td class="px-4 py-2 border-b" :class="{
              'text-green-600': stock.price_change_percentage_24h> 0,
              'text-red-600': stock.price_change_percentage_24h< 0 ,
              'text-gray-500': stock.price_change_percentage_24h=== 0
            }">{{`%${ Math.ceil(stock.price_change_percentage_24h)}`}}</td>
            <td class="px-4 py-2 border-b">{{Number(stock.total_volume).toLocaleString()  || "N/A" }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-center text-gray-500">No stock data available.</p>
  </div>
</template>