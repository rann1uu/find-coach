<script setup>
import { RouterView } from "vue-router";
import { onBeforeMount, watch } from "vue";
import { useUserStore } from "./stores/user";
import { useRouter } from "vue-router";
// import { storeToRefs } from "pinia";
import TheHeader from "./components/layout/TheHeader.vue";
const userStore = useUserStore();
const router = useRouter();
// const {setAutoLogout} =storeToRefs()

watch(
  () => userStore.setAutoLogout,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      router.replace("/coaches");
    }
  }
);

onBeforeMount(() => {
  // const userStore = useUserStore();
  userStore.tryLogin();
});
</script>

<template>
  <TheHeader />
  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
</style>
