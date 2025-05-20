<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Axios from '@/API/axios'

const route = useRoute()
const router = useRouter()
const coinSymbol = route.query.symbol;
const coinId = route.query.id;
const trade = ref()
const sellAmount = ref(0)

// Fetch the specific trade data by ID
const fetchTrade = async () => {
  try {
    const result = await Axios.get("/check-auth")
    const coin = result.data.user.trade.find(c => c._id === coinId)
    if (coin) {
      trade.value = coin
      sellAmount.value = 0
    } else {
      router.push("/")
    }
  } catch (e) {
    console.error(e)
  }
}

const submitSell = async () => {
  if (sellAmount.value <= 0 || sellAmount.value > trade.value.share) return alert("Invalid amount.")
  
  try {
    const res = await Axios.post('/sell', {
      id: coinId,
      symbol: coinSymbol,
      sellShare: sellAmount.value,
    })
    alert("Sell successful!");
    window.location.reload();
    router.push("/")
  } catch (err) {
    console.error(err)
    alert("Sell failed.")
  }
}

onMounted(fetchTrade)
</script>

<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4 text-center">Sell Coin</h2>

    <div v-if="trade">
      <div class="flex items-center gap-4 mb-4">
        <img :src="trade.img" class="w-10 h-10 rounded-full" />
        <div>
          <p class="text-lg font-semibold">{{ trade.name }} ({{ trade.symbol.toUpperCase() }})</p>
          <p class="text-sm text-gray-600">You own: {{ trade.share }} shares</p>
        </div>
      </div>

      <label for="sellRange" class="block mb-2 text-sm font-medium">Select amount to sell:</label>
      
      <!-- Range input -->
      <input
        type="range"
        id="sellRange"
        :max="trade.share"
        step="0.000001"
        v-model.number="sellAmount"
        class="w-full"
      />

      <!-- Number input -->
      <input
        type="number"
        :max="trade.share"
        :min="0"
        v-model.number="sellAmount"
        class="mt-2 w-full border px-2 py-1 rounded"
      />

      <p class="mt-2 text-center text-blue-600 font-mono">
        Selling: {{ sellAmount }} shares
      </p>

      <button @click="submitSell"
        class="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
        Confirm Sell
      </button>
    </div>

    <div v-else class="text-center">Loading coin data...</div>
  </div>
</template>

