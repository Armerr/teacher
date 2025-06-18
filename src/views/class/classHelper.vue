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
import {
  groupScoreInfo,
  handGroupScore,
  handStudentScore,
  setLeaderStudent,
  setStudentScore,
} from '@api/class.js';
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
      groupId: group.id,
    }))
  );
});

function startEditingScore(param) {
  if (!param) {
    return;
  }

  const groupId = param.groupId;
  const studentId = param.studentId;
  const group = groups.value.find((g) => g.id === groupId);
  if (!group) {
    return;
  }

  const student = group.students.find((s) => s.id === studentId);
  if (!student) {
    return;
  }

  student.editScore = student.score;
  student.editingScore = true;
}

async function endEditingScore(param) {
  if (!param) {
    return;
  }

  const groupId = param.groupId;
  const studentId = param.studentId;
  const newScore = param.newScore;
  const group = groups.value.find((g) => g.id === groupId);
  if (!group) {
    return;
  }

  const student = group.students.find((s) => s.id === studentId);
  if (!student) {
    return;
  }

  if (newScore === undefined || newScore === student.score) {
    student.editingScore = false;
    student.editScore = undefined;
    return;
  }

  const originalScore = student.score;
  student.score = newScore;
  student.editingScore = false;

  try {
    const scoreDelta = newScore - originalScore;
    const baseParam = {};
    baseParam.userId = storage.get(USER_ID) ?? '';
    const payload = {
      studentId: studentId,
      score: newScore,
    };

    setStudentScore(baseParam, payload).then(() => {
      // 更新小组总分
      group.score += scoreDelta;
      message.success('分数修改成功');
    });
  } catch (error) {
    // 如果保存失败，恢复原始分数
    student.score = originalScore;
    message.error('分数修改失败，请重试');
  } finally {
    // 无论成功还是失败，都要重置编辑状态
    student.editingScore = false;
    student.editScore = undefined;
  }
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
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  gap: 24px;
  box-sizing: border-box;

  .left-container {
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }
  }

  .right-container {
    width: 18%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;

    > * {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .container {
    flex-direction: column;
    gap: 20px;

    .left-container,
    .right-container {
      width: 100%;
    }

    .right-container {
      flex-direction: row;
      justify-content: space-between;

      > * {
        flex: 1;
        margin: 0 10px;

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .container {
    padding: 16px;

    .left-container {
      padding: 16px;
    }

    .right-container {
      flex-direction: column;

      > * {
        margin: 0;
        padding: 16px;
      }
    }
  }
}
</style>
