<template>
  <BaseCard>
    <h2>Find Coach</h2>
    <span class="filter-option">
      <input type="checkbox" id="frontend" checked @change="setFilter" />
      <label for="frontend">Frontend</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="backend" checked @change="setFilter" />
      <label for="backend">Backend</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="career" checked @change="setFilter" />
      <label for="career">Career</label>
    </span>
  </BaseCard>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["change-filter"]);
const filters = ref({
  frontend: true,
  backend: true,
  career: true,
});
function setFilter(event) {
  const inputId = event.target.id;
  const isActive = event.target.checked;
  const updateFilters = {
    ...filters.value,
    [inputId]: isActive,
  };
  filters.value = updateFilters;
  emit("change-filter", updateFilters);
}
</script>

<style scoped>
h2 {
  margin: 0.5rem 0;
}

.filter-option {
  margin-right: 1rem;
}

.filter-option label,
.filter-option input {
  vertical-align: middle;
}

.filter-option label {
  margin-left: 0.25rem;
}

.filter-option.active label {
  font-weight: bold;
}
</style>
