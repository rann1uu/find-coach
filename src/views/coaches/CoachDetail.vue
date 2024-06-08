<template>
  <div>
    <section>
      <BaseCard>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}/hour</h3>
      </BaseCard>
    </section>
    <section>
      <BaseCard>
        <header>
          <h2>Interested? Reach out now!</h2>
          <BaseButton v-if="inContact" link :to="contactLink"
            >Contact</BaseButton
          >
        </header>
        <RouterView />
      </BaseCard>
    </section>
    <section>
      <BaseCard>
        <BaseBadge
          v-for="area in areas"
          :key="area"
          :type="area"
          :title="area"
        ></BaseBadge>
        <p>{{ description }}</p>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useCoachStore } from "@/stores/coaches";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps(["id"]);
const coachStore = useCoachStore();
const { coaches } = storeToRefs(coachStore);
const selectedCoach = ref(null);
const fullName = computed(
  () => selectedCoach.value.firstName + " " + selectedCoach.value.lastName
);
const contactLink = computed(() => route.path + "/contact");
const rate = computed(() => selectedCoach.value.hourlyRate);
const areas = computed(() => selectedCoach.value.areas);
const description = computed(() => selectedCoach.value.description);
onBeforeMount(() => {
  selectedCoach.value = coaches.value.find((coach) => coach.id === props.id);
});
const inContact = computed(() => {
  const parts = route.path.split("/");
  const lastPart = parts[parts.length - 1];
  if (lastPart === "contact") return false;
  return true;
});
</script>
