<template>
  <div class="raw-display">
    <pre>{{ value1Str }}</pre>
    <pre v-if="value2">{{ value2Str }}</pre>
  </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  value1: {},
  value2: {},
});

const value1Str = computed(() => {
  return JSON.stringify(props.value1, null, 2);
});

const value2Str = computed(() => {
  return JSON.stringify(props.value2, null, 2);
});
</script>
<style lang="scss" scoped>
.raw-display {
  display: flex;
  padding: 5px;
}
pre {
  flex: 1;
  font-size: 10px;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.2);
  height: 400px;
}
pre:nth-child(n + 2) {
  margin-left: 10px;
}
</style>
