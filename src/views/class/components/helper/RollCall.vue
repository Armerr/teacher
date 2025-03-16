<template>
  <div class="roll-container">
    <StudentRoller :students="students" />
    <ContentRoller />
  </div>
</template>

<script setup>
import ContentRoller from '@views/class/components/helper/ContentRoller.vue';
import StudentRoller from '@views/class/components/helper/StudentRoller.vue';

const props = defineProps({
  students: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['roll-start', 'roll-stop']);
</script>

<style lang="scss" scoped>
.roll-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 200px;
  line-height: 1.5;
  z-index: 1;
}
</style>
