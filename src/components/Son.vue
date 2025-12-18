<script setup lang="ts">
import { ref } from 'vue'
import GrandChild from './GrandChild.vue'

const salary = ref(60000)

defineProps(['minusHouse'])
defineExpose({ salary })
</script>

<template>
  <div class="wrapper">
    <div>
      <h2>子组件</h2>

      薪酬: {{ salary }}

      <div><button @click="minusHouse(2)">点击减少祖的房本的数量</button></div>
    </div>

    <GrandChild v-bind="$attrs"></GrandChild>
  </div>
</template>

<style scoped>
.wrapper {
  margin-top: 50px;
  min-height: 100px;
  width: 200px;
  padding-top: 50px;
  padding-left: 50px;
  background-color: salmon !important;
  border-radius: 20px;
}
</style>
