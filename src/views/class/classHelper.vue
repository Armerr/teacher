<template>
  <div class="container">
    <div class="left-container">
      <RollCall :students="allStudents" />
      <GroupList
        :groups="groups"
        @group-add="handleGroupAddScore"
        @group-subtract="handleGroupSubtractScore"
        @student-add="handleStudentAddScore"
        @student-subtract="handleStudentSubtractScore"
        @set-leader="setLeader"
        @start-editing-score="startEditingScore"
        @end-editing-score="endEditingScore" />
    </div>
    <div class="right-container">
      <GroupRanking :groups="sortedGroups" />
      <StudentRanking :students="allStudents" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import GroupList from '@views/class/components/helper/GroupList.vue';
import RollCall from '@views/class/components/helper/RollCall.vue';
import GroupRanking from '@views/class/components/helper/GroupRanking.vue';
import StudentRanking from '@views/class/components/helper/StudentRanking.vue';
import { message } from 'ant-design-vue';
import { groupScoreInfo, handGroupScore, handStudentScore, setLeaderStudent } from '@api/class.js';
import { useRouter } from 'vue-router';
import storage from '@common/storage.js';
import { USER_ID } from '@common/constant.js';

const groups = ref([]);
const classId = ref('');
const router = useRouter();
const controllers = {};
const loading = ref({});
const needRoll = ref(true);

const sortedGroups = computed(() => [...groups.value].sort((a, b) => b.score - a.score));

const allStudents = computed(() => {
  return groups.value.flatMap((group) =>
    group.students.map((student) => ({
      ...student,
    }))
  );
});

function startEditingScore(param) {
  const groupId = param.groupId;
  const studentId = param.studentId;
  const group = groups.value.find((g) => g.id === groupId);
  const student = group.students.find((s) => s.id === studentId);
  student.editScore = student.score;
  student.editingScore = true;
}

function endEditingScore(param) {
  debugger;
  const groupId = param.groupId;
  const studentId = param.studentId;
  const group = groups.value.find((g) => g.id === groupId);
  const student = group.students.find((s) => s.id === studentId);
  student.editingScore = false;
}

const setLeader = (param) => {
  if (param.groupId && param.studentId) {
    const payload = {};
    payload.classId = classId.value;
    payload.groupId = param.groupId;
    payload.studentId = param.studentId;
    const baseParam = {};
    baseParam.userId = storage.get(USER_ID) ?? '';
    setLeaderStudent(baseParam, payload).then(() => {
      init();
      message.success('设置成功');
    });
  }
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
      s.score = s.score + delta;
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
    const newScore = originalScore + delta;
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

function init() {
  groupScoreInfo({ classId: classId.value }).then((res) => {
    if (res) {
      groups.value = res.groups;
      needRoll.value = res.needRoll === 1;
    }
  });
}

onMounted(() => {
  classId.value = router.currentRoute.value.query.classId;
  init();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  .left-container {
    width: 83%;
    display: flex;
    flex-direction: column;
  }

  .right-container {
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 40px;
  }
}
</style>
