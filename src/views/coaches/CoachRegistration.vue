<template>
  <section>
    <BaseCard>
      <h2>Register as a coach now!</h2>
      <CoachForm @save-data="saveData"></CoachForm>
    </BaseCard>
  </section>
</template>

<script setup>
import CoachForm from "@/components/coaches/CoachForm.vue";
import { useCoachStore } from "@/stores/coaches";
import { useRouter } from "vue-router";

const coachStore = useCoachStore();
const router = useRouter();

function saveData(data) {
  coachStore.registerCoach(data);
  router.replace("/coaches");
}
</script>
