<template>
  <form @submit.prevent="submitForm">
    <div class="form-control">
      <label for="email">Your E-mail</label>
      <input type="email" id="email" v-model.trim="data.email" />
    </div>
    <div class="form-control">
      <label for="message">Message</label>
      <textarea rows="5" id="message" v-model.trim="data.message"></textarea>
    </div>
    <p class="errors" v-if="!data.formIsValid">
      Please enter a valid email and non-empty message.
    </p>
    <div class="actions">
      <BaseButton>Send Message</BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRequestStore } from "@/stores/requests";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const requestStore = useRequestStore();
const data = ref({
  email: "",
  message: "",
  formIsValid: true,
});

function submitForm() {
  data.value.formIsValid = true;
  if (
    data.value.email === "" ||
    !data.value.email.includes("@") ||
    data.value.message === ""
  ) {
    data.value.formIsValid = false;
    return;
  }
  requestStore.addRequest({
    email: data.value.email,
    message: data.value.message,
    coachId: route.params.id,
  });
  router.replace("/coaches");
}
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>
