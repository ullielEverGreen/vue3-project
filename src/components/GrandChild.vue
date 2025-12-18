<script setup lang="ts">
import { ref, inject } from 'vue'

const grade = ref('A+')

defineProps(['house', 'updateCar'])

const { dimond, addDimond, minusDimond } = inject('dimond')
</script>

<template>
  <div class="wrapper-test">
    <div>
      <h2>孙组件</h2>

      考试成绩: {{ grade }}

      <div>祖的房本：{{ house }}</div>
      <div>祖的车子：{{ $attrs.car }}</div>
      <div>祖的钻石数量：{{ dimond }}</div>
      <div><button @click="updateCar">点击增加祖的车子数量</button></div>
      <div><button @click="addDimond(2)">增加祖先的钻石数量</button></div>
      <div><button @click="minusDimond">减少祖先的钻石数量</button></div>
    </div>
  </div>
</template>

<style scoped>
.wrapper-test {
  min-height: 100px;
  width: 300px;
  padding-top: 50px;
  padding-left: 50px;
  background-color: orange;
  border-radius: 20px;
  margin-top: 100px;
  padding-bottom: 30px;
}
</style>
