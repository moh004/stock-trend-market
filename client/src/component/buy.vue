<script setup>
import apiClient from '@/API/axios';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const cryptoSymbol = ref('btc');
const Cryptos = ref([]);
const USD = ref(0);

// Fetch crypto list
const fetchingApi = async () => {
  try {
    const res = await apiClient.get('/crypto');
    Cryptos.value = res.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchingApi);

// Get selected coin data
const selectedCoin = computed(() =>
  Cryptos.value.find((coin) => coin.symbol === cryptoSymbol.value)
);



// Get current price or fallback
const currentPrice = computed(() =>
  selectedCoin.value ? selectedCoin.value.current_price  : 0
);

// Calculate shares
const shares = computed(() =>
  currentPrice.value > 0 ? (USD.value / currentPrice.value).toFixed(6) : '0'
);

const buy = async () => {
  if (USD.value === 0) {
    console.log("Invalid price");
    return;
  }

  const img = selectedCoin.value.image;
  const name = selectedCoin.value.name
  const symbol = cryptoSymbol.value;
  const share = Number(shares.value);
  const costs = Number(USD.value);

  try{
    await apiClient.post("/buy", {symbol, share, costs , name , img});
    alert("Trade successful!");
    window.location.reload(); 
  }
  catch(e){
    console.log(e);
    router.push("/login")
  }
};
</script>


<template>
  <div>
    <form @submit.prevent="buy" class="bg-gradient-to-r from-yellow-500 to-fuchsia-700   hover:border-gray-400 mx-auto  mb-12 flex w-96 flex-col rounded-xl p-4 text-gray-700 shadow-md space-y-4">
      
      <label for="cryptoSelect" class="text-sm font-medium">Choose a cryptocurrency:</label>
      <select v-model="cryptoSymbol" id="cryptoSelect" class="p-2 font-black rounded text-yellow-800" >
        <option v-for="coin in Cryptos" :key="coin.symbol" :value="coin.symbol">
           {{ coin.name.toUpperCase() }}
        </option>
      </select>
  
      <div>
        <p class="text-sm">Current Price: <strong v-if="currentPrice">{{ currentPrice.toLocaleString() }} USD</strong></p>
      </div>
  
      <label for="usd" class="text-sm font-medium">Enter amount in USD:</label>
      <div class="flex items-center border rounded p-2">
  <span class="text-green-700 font-black mr-1">$</span>
  <input
    type="number"
    v-model="USD"
    min="0"
    id="usd"
    class="w-full bg-transparent outline-none font-black text-green-700"
    placeholder="500"
  />
</div>
  
      <p>You will receive: <strong class=" font-black">{{ shares }}</strong> <span class=" font-bold text-orange-600">{{ cryptoSymbol.toUpperCase() }}</span> </p>
  
      <button type="submit" class="bg-green-500 text-white p-2 rounded hover:bg-green-600">Buy</button>
    </form>
  </div>  
  </template>
  