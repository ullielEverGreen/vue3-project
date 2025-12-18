<script setup lang="ts">
import { ref } from 'vue'
import GrandChild from './GrandChild.vue'

const save = ref(9000000)

const addCar = (father: any) => {
  father.car += 1
}

defineProps(['minusHouse'])
defineExpose({ save })
</script>

<template>
  <div class="wrapper">
    <div>
      <h2>女儿组件</h2>

      存款: ${{ save }}

      <div><button @click="addCar($parent)">点击增加祖的车子数量</button></div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  margin-top: 50px;
  width: 500px;
  padding-top: 50px;
  padding-left: 50px;
  background-color: greenyellow !important;
  border-radius: 20px;
}
</style>
