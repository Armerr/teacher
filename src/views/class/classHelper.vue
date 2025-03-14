<template>
  <a-space
    direction="vertical"
    :style="{ width: '100%' }"
    :size="[0, 48]">
    <a-layout class="content">
      <a-layout-content>
        <RollCall
          :is-rolling="isRolling"
          :selected-student="selectedStudent"
          @roll-start="handleRollStart"
          @roll-stop="handleRollStop" />
      </a-layout-content>
      <a-layout-sider>
        <GroupRanking :groups="sortedGroups" />
      </a-layout-sider>
    </a-layout>
    <div class="helper-container">
      <GroupList
        :groups="groups"
        @group-add="handleGroupAddScore"
        @group-subtract="handleGroupSubtractScore"
        @student-add="handleStudentAddScore"
        @student-subtract="handleStudentSubtractScore" />
    </div>
  </a-space>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import GroupList from '@views/class/components/helper/GroupList.vue';
import RollCall from '@views/class/components/helper/RollCall.vue';
import GroupRanking from '@views/class/components/helper/GroupRanking.vue';

// 响应式数据层 (可迁移到Pinia/Vuex)
const groups = ref([
  {
    id: 1,
    name: '第一组',
    score: 0,
    students: [
      { id: 1, name: '马苏', score: 0 },
      { id: 2, name: '虞雪萌', score: 0 },
    ],
  },
]);

// 计算属性：排序后的小组数据
const sortedGroups = computed(() =>
  [...groups.value].sort((a, b) => b.score - a.score).slice(0, 3)
);

// 点名器逻辑
const isRolling = ref(false);
const selectedStudent = ref(null);
let rollInterval = null;

const handleRollStart = () => {
  isRolling.value = true;
  rollInterval = setInterval(() => {
    const allStudents = groups.value.flatMap((g) => g.students);
    const randomIndex = Math.floor(Math.random() * allStudents.length);
    selectedStudent.value = allStudents[randomIndex].name;
  }, 100);
};

const handleRollStop = () => {
  isRolling.value = false;
  clearInterval(rollInterval);
};

// 分数操作逻辑
const handleGroupAddScore = (groupId) => {
  const group = groups.value.find((g) => g.id === groupId);
  if (group) {
    group.score++;
    group.students.forEach((s) => s.score++);
  }
};

const handleGroupSubtractScore = (groupId) => {
  const group = groups.value.find((g) => g.id === groupId);
  if (group && group.score > 0) {
    group.score--;
    group.students.forEach((s) => s.score > 0 && s.score--);
  }
};

const handleStudentAddScore = (studentId) => {
  const student = groups.value.flatMap((g) => g.students).find((s) => s.id === studentId);
  if (student) student.score++;
};

const handleStudentSubtractScore = (studentId) => {
  const student = groups.value.flatMap((g) => g.students).find((s) => s.id === studentId);
  if (student && student.score > 0) student.score--;
};

// 清理定时器
onUnmounted(() => {
  if (rollInterval) clearInterval(rollInterval);
});
</script>

<style lang="scss" scoped>
.content {
  height: auto;
}
</style>
