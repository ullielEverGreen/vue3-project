<script setup lang="ts">
import { ref, provide } from 'vue'
import Son from './components/Son.vue'
import Daughter from './components/Daughter.vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Count from './components/Count.vue'
import type DaughterVue from './components/Daughter.vue'

const name = ref('')
const car = ref(8)
const dimond = ref(3)
const house = ref(16)
const daughter = ref()
const son = ref()
const message = ref('You did it!')

const addHouse = () => {
  house.value += 1
}

const minusHouse = (n: number) => {
  house.value -= n
}

const updateCar = () => {
  car.value += 1
}

const addSave = () => {
  daughter.value.save += 8888
}

const getAll = (children: any) => {
  for (let i in children) {
    console.log(children[i])
    if (children[i].save) {
      children[i].save += 888
    } else if (children[i].salary) {
      children[i].salary -= 123
    }
  }
}

defineExpose({ car })

const addDimond = (n: number) => {
  dimond.value += n
}

const minusDimond = () => {
  dimond.value -= 1
}

provide('dimond', { dimond, addDimond, minusDimond })
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld :msg="message" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/chat">Chat</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/charts">Charts</RouterLink>
      </nav>

      <Teleport to="body">
        <input type="text" :value="name" @input="name = (<HTMLInputElement>$event.target).value" />
      </Teleport>
    </div>
  </header>

  <RouterView />

  <!-- <div class="wrapper">
    <h2>父组件</h2>

    <div @click="addHouse">房本：{{ house }}本</div>
    <div>车子：{{ car }}辆</div>
    <div>钻石：{{ dimond }}个</div>
    <div><button @click="addSave">给女儿增加一些存款</button></div>
    <div><button @click="getAll($refs)">获取所有子女组件</button></div>
    <Daughter ref="daughter" />
    <Son ref="son" :house="house" :car="car" :updateCar="updateCar" :minusHouse="minusHouse" />
  </div> -->
</template>

<style scoped>
.wrapper {
  min-height: 300px;
  width: 500px;
  padding-left: 50px;
  padding-top: 50px;
  background-color: skyblue;
  border-radius: 20px;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

input {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
