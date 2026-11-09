<script setup>
    import buy from '@/component/buy.vue';
    import stockList from '@/component/stockList.vue';
    import stockTable from '@/component/stockTable.vue';
    import {ref} from "vue"

    const showAll = ref(false);
</script>

<template>
      <buy />
      <stockList :showBnt="showAll"
                @toggleShow="showAll = !showAll"/>
      <stockTable />
</template>