<template>
  <a-space
    direction="vertical"
    :style="{ width: '100%' }"
    :size="[0, 48]">
    <a-layout>
      <a-layout-content :style="contentStyle">
        <RollCall
          :is-rolling="isRolling"
          :selected-student="selectedStudent"
          @roll-start="handleRollStart"
          @roll-stop="handleRollStop" />
      </a-layout-content>
      <a-layout-sider :width="300">
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
import { ref, computed, onUnmounted, onMounted } from 'vue';
import GroupList from '@views/class/components/helper/GroupList.vue';
import RollCall from '@views/class/components/helper/RollCall.vue';
import GroupRanking from '@views/class/components/helper/GroupRanking.vue';
import { message } from 'ant-design-vue';
import { groupScoreInfo, handGroupScore, handStudentScore } from '@api/class.js';
import { useRouter } from 'vue-router';

const groups = ref([]);
const classId = ref('');
const router = useRouter();
const controllers = {};
const loading = ref({});

const contentStyle = {
  minHeight: 150,
};

const sortedGroups = computed(() =>
  [...groups.value].sort((a, b) => b.score - a.score).slice(0, 3)
);

const isRolling = ref(false);
const selectedStudent = ref(null);
let rollInterval = null;

const handleRollStart = () => {
  isRolling.value = true;
  rollInterval = setInterval(() => {
    const allStudents = groups.value.flatMap((g) => g.students);
    const randomIndex = Math.floor(Math.random() * allStudents.length);
    selectedStudent.value = allStudents[randomIndex].name;
  }, 60);
};

const handleRollStop = () => {
  isRolling.value = false;
  clearInterval(rollInterval);
};

const handleGroupAddScore = (groupId) => {
  handleGroupAdjust(groupId, 1);
};

const handleGroupSubtractScore = (groupId) => {
  handleGroupAdjust(groupId, -1);
};

const groupOperations = new Map();

const handleGroupAdjust = async (groupId, delta) => {
  const group = groups.value.find((g) => g.id === groupId);
  if (!group) return;

  const operationId = Symbol();
  const ctx = {
    groupVersion: group.version || 0,
    originalGroupScore: group.score,
    students: group.students.map((s) => ({
      id: s.id,
      originalScore: s.score,
      version: s.version || 0,
    })),
    controllers: [],
  };

  groupOperations.set(operationId, ctx);

  try {
    group.version = (group.version || 0) + 1;

    group.students.forEach((s) => {
      s.version = (s.version || 0) + 1;
      const newScore = s.score + delta;
      s.score = newScore > 0 ? newScore : 0;
    });
    group.score = group.students.reduce((sum, s) => sum + s.score, 0);

    const param = {};
    param.classId = classId.value;
    param.groupId = group.id;
    param.score = delta;
    handGroupScore(param).then(
      () => {
        // do nothing
      },
      () => {
        group.score = ctx.originalGroupScore;
        group.version = ctx.groupVersion;
        group.students.forEach((s) => {
          const original = ctx.students.find((ss) => ss.id === s.id);
          s.score = original.originalScore;
          s.version = original.version;
        });
        group.score = group.students.reduce((sum, s) => sum + s.score, 0);
        message.error('操作失败，已恢复数据');
      }
    );
  } finally {
    groupOperations.delete(operationId);
  }
};

const handleStudentAddScore = (studentId) => {
  adjustStudentScore(studentId, 1);
};

const handleStudentSubtractScore = (studentId) => {
  adjustStudentScore(studentId, -1);
};

const adjustStudentScore = async (studentId, delta) => {
  if (controllers[studentId]) {
    controllers[studentId].abort();
  }
  const controller = new AbortController();
  controllers[studentId] = controller;

  let group;
  let student;
  let originalScore;
  try {
    loading.value[studentId] = true;
    group = groups.value.find((g) => g.students.some((s) => s.id === studentId));
    student = group.students.find((s) => s.id === studentId);
    originalScore = student.score;
    const newScore = Math.max(0, originalScore + delta);
    student.score = newScore;
    group.score += delta;

    const param = {};
    param.classId = classId.value;
    param.groupId = group.id;
    param.studentId = studentId;
    param.score = delta;
    handStudentScore(param).then(
      () => {
        // do nothing
      },
      () => {
        student.score = originalScore;
        group.score -= delta;
        message.error('保存失败，请重试');
      }
    );
  } finally {
    delete controllers[studentId];
    loading.value[studentId] = false;
  }
};

onMounted(() => {
  const id = router.currentRoute.value.query.classId;
  if (id) {
    classId.value = id;
    groupScoreInfo({ classId: id }).then((res) => {
      if (res) {
        groups.value = res.groups;
      }
    });
  }
});

onUnmounted(() => {
  if (rollInterval) clearInterval(rollInterval);
});
</script>

<style lang="scss" scoped>
.content {
  height: auto;
}
</style>
