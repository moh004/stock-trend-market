<script setup>
      import { ref, onMounted } from 'vue';
      import Axios from '@/API/axios';
      import { useRouter } from 'vue-router';

      const Router = useRouter()

      //  USE COOKIE FOR GETTING DATA  OR  FOR PERMISION 

    let userInfo = ref("");
    const Cryptos = ref([])

    const sellCoin = (coinId ,coinSymbol) => {
      // clicking sell btn will send you to the coin you what to sell
        Router.push({ name: 'SellCoin', query: { id: coinId , symbol: coinSymbol} });
    }

   const cryptoPrice = async () => {
  try {
    const response = await Axios.get('/crypto');
    Cryptos.value = response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
};

function getCurrentPrice (coinSymbol) {
  const coin = Cryptos.value.find((c) => c.symbol === coinSymbol);
  return coin ? coin.current_price : 0;
};

        
  const checkAuth = async () => {
      try{
        const result = await Axios.get("/check-auth")
        if(result.data.isAuthenticated) {
          userInfo.value = result.data.user 
        }
        else{
          Router.push("/login")
        }
      }
      catch(e){
        console.log(e)
      }    
  }       

onMounted( async () => {
  await checkAuth();
  await cryptoPrice();
});


 
</script>

<template>
        <section class=" bg-gradient-to-tr from-sky-400 to-yellow-400 py-20 mb-4">
      <div class=" mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div class="text-center">
          <p class="text-2xl font-black text-red-900 sm:text-5xl md:text-6xl">
            {{ userInfo.username }}
          </p>
          <p class="my-4 font-bold text-2xl text-green-900 sm:text-5xl md:text-6xl">
            {{ userInfo.email }}
          </p>
          <p class="my-4 font-bold text-4xl text-gray-800" >
            🪙{{ userInfo.balance }}
          </p>
        </div>
      </div>
    </section>

    <div class="container  mx-auto p-6">
    <h1 class="text-3xl text-green-500   font-bold mb-4 text-center">Crypto that you bought</h1>

    <div v-if="userInfo.trade && userInfo.trade.length">
      <table class="min-w-full bg-slate-300 table-auto border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="px-4 py-2 border-b">#</th>
            <th class="px-4 py-2 border-b">Symbol</th>
            <th class="px-4 py-2 border-b">Name</th>
            <th class="px-4 py-2 border-b">Share</th>
            <th class="px-4 py-2 border-b">Current Value</th>
            <th class="px-4 py-2 border-b">Spend</th>
          </tr>
        </thead>
        <tbody class=" font-mono">
          <tr v-for="(coin, index ) in userInfo.trade" :key="coin._id" class="hover:bg-green-200">
            <td class="px-4 py-2 border-b">{{ index + 1 }}</td>
            <td class="px-4 py-2 flex items-center"><img :src="coin.img" alt="logo" class="w-8 h-8 rounded-full mr-2"/></td>
            
            <td class="px-4 py-2 border-b">{{ coin.name }}</td>
            <td class="px-4 py-2 border-b">{{ coin.share}}</td>
            <td class="px-4 py-2 border-b font-black text-white bg-green-500" >${{ (coin.share * getCurrentPrice(coin.symbol)).toFixed(2) }}</td>
            <td class="px-4 py-2 border-b font-black text-white bg-red-500">${{ coin.costs}}</td>
            <td class="px-4 py-2">
              <button @click="sellCoin(coin._id , coin.symbol)" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Sell
              </button>
            </td>
            
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-center text-gray-500">No coins purchase.</p>
  </div>
</template>