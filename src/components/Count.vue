<template>
  <div class="count">
    <h2>当前求和为：{{ countStore.sum }}</h2>

    <button @click="add">加</button>
    <button @click="minus">减</button>
  </div>
</template>

<script setup lang="ts" name="count">
import { useCountStore } from '@/store/count'

const countStore = useCountStore()
console.log('???', countStore.sum)

const add = () => {
  countStore.sum += 1
}
const minus = () => {}
</script>
