<template>
  <div>
    <BaseDialog
      :show="!!error"
      title="An error occurred"
      @close="handleError"
      >{{ error }}</BaseDialog
    >
    <section>
      <CoachFilter @change-filter="setFilters"></CoachFilter>
    </section>
    <section>
      <BaseCard>
        <div class="controls">
          <BaseButton mode="outline" @click="loadCoaches(true)"
            >Refresh</BaseButton
          >
          <BaseButton link to="/auth?redirect=register" v-if="!authenticated"
            >Login to Register as Coach</BaseButton
          >
          <BaseButton
            v-if="authenticated && !isCoach && !isLoading"
            link
            to="/register"
            >Register as Coach</BaseButton
          >
        </div>
        <div v-if="isLoading">
          <BaseSpinner></BaseSpinner>
        </div>
        <ul v-else-if="hasCoaches">
          <CoachItem
            v-for="coach in filterCoaches"
            :key="coach.id"
            :id="coach.id"
            :first-name="coach.firstName"
            :last-name="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          />
        </ul>
        <h3 v-else>No Coaches!</h3>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useCoachStore } from "@/stores/coaches";
import { useUserStore } from "@/stores/user";
import CoachItem from "../../components/coaches/CoachItem.vue";
import CoachFilter from "../../components/coaches/CoachFilter.vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
const activeFilters = ref({
  frontend: true,
  backend: true,
  career: true,
});
const isLoading = ref(true);
const error = ref(null);
const coachStore = useCoachStore();
const userStore = useUserStore();
const { authenticated } = storeToRefs(userStore);
const { coaches, hasCoach, isCoach } = storeToRefs(coachStore);

const filterCoaches = computed(() => {
  return coaches.value.filter((coach) => {
    if (activeFilters.value.frontend && coach.areas.includes("frontend"))
      return true;
    if (activeFilters.value.backend && coach.areas.includes("backend"))
      return true;
    if (activeFilters.value.career && coach.areas.includes("career"))
      return true;
    return false;
  });
});

const hasCoaches = computed(() => {
  return !isLoading.value && hasCoach.value;
});
function handleError() {
  error.value = null;
}
function setFilters(updateFilters) {
  activeFilters.value = updateFilters;
}
async function loadCoaches(refresh = false) {
  isLoading.value = true;
  try {
    await coachStore.loadCoaches(refresh);
  } catch (err) {
    error.value = err.message || "Something went wrong!";
  }
  isLoading.value = false;
}
onBeforeMount(async () => {
  await loadCoaches(false);
  // await coachStore.loadCoaches(false);
  // isLoading.value = false;
});
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
