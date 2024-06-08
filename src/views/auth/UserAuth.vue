<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog fixed :show="isLoading" title="Authenticating...">
      <BaseSpinner />
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">E-Mail</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">
          Please enter a valid email and password (must be at least 6 characters
          long).
        </p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{
          switchModeButtonCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script setup>
import BaseDialog from "@/components/ui/BaseDialog.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
import { useUserStore } from "@/stores/user";
import { useCoachStore } from "@/stores/coaches";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
const userStore = useUserStore();
const coachStore = useCoachStore();
const { isCoach } = storeToRefs(coachStore);
const { userId } = storeToRefs(userStore);
const email = ref("");
const password = ref("");
const formIsValid = ref(true);
const mode = ref("login");
const isLoading = ref(false);
const error = ref(null);
const route = useRoute();
const router = useRouter();

const submitButtonCaption = computed(() => {
  if (mode.value === "login") {
    return "Login";
  } else {
    return "Signup";
  }
});
const switchModeButtonCaption = computed(() => {
  if (mode.value === "login") {
    return "Signup instead";
  } else {
    return "Login instead";
  }
});

async function submitForm() {
  formIsValid.value = true;
  if (
    email.value === "" ||
    !email.value.includes("@") ||
    password.value.length < 6
  ) {
    formIsValid.value = false;
    return;
  }
  isLoading.value = true;
  try {
    if (mode.value === "login") {
      await userStore.login({
        email: email.value,
        password: password.value,
      });
    } else {
      await userStore.signup({
        email: email.value,
        password: password.value,
      });
    }
    if (!!userId.value && isCoach.value) router.replace("/coaches");
    else {
      const redirectUrl = "/" + (route.query.redirect || "coaches");
      router.replace(redirectUrl);
    }
  } catch (err) {
    error.value =
      err.message || "Failed to authenticate, Please check your info.";
  }

  isLoading.value = false;
}

function switchAuthMode() {
  if (mode.value === "login") {
    mode.value = "signup";
  } else {
    mode.value = "login";
  }
}

function handleError() {
  error.value = null;
}
</script>

<style scoped>
form {
  margin: 1rem;
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
</style>
