<template>
  <div>
    <BaseDialog
      :show="!!error"
      title="An error occurred"
      @close="handleError"
      >{{ error }}</BaseDialog
    >
    <section>
      <BaseCard>
        <header>
          <h2>Requests Received</h2>
        </header>
        <BaseSpinner v-if="isLoading"></BaseSpinner>
        <ul v-else-if="hasRequests && !isLoading">
          <RequestsItem
            v-for="request in getRequests"
            :key="request.id"
            :email="request.userEmail"
            :message="request.message"
          ></RequestsItem>
        </ul>
        <h3 v-else>You have not received any requests yet!</h3>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseDialog from "@/components/ui/BaseDialog.vue";
import RequestsItem from "../../components/requests/RequestsItem.vue";
import { useRequestStore } from "@/stores/requests.js";
import { storeToRefs } from "pinia";
import { ref, onBeforeMount } from "vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
const isLoading = ref(false);
const error = ref(null);
const requestStore = useRequestStore();
const { getRequests, hasRequests } = storeToRefs(requestStore);

async function loadRequests() {
  isLoading.value = true;
  try {
    await requestStore.fetchRequests();
  } catch (err) {
    error.value = err.message || "Something failed";
    throw err;
  }

  isLoading.value = false;
}
function handleError() {
  error.value = null;
}
onBeforeMount(async () => {
  await loadRequests();
});
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
