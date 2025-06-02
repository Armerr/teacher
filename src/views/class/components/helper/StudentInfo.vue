<template>
  <div class="student-info">
    <user-outlined class="student-icon" />
    <span class="student-name">{{ item.name }}</span>
    <crown-filled
      v-if="item.leader"
      class="leader-icon"
      style="color: #f8ab02; margin-left: 8px" />
    <a-button
      v-if="!item.leader && hoverStudentId === item.id"
      type="text"
      size="small"
      class="virtual-crown-btn"
      @click.stop="setLeader(item.groupId, item.id)">
      <crown-outlined style="color: rgba(0, 0, 0, 0.25)" />
    </a-button>
  </div>
  <div class="student-actions">
    <div
      ref="containerRef"
      style="width: 80px">
      <span
        v-if="!item.editingScore"
        class="student-score"
        @click="showEditRowInput(item.groupId, item.id)"
        >{{ item.score }}</span
      >
      <a-input-number
        v-else
        ref="inputRef"
        v-model:value="editScore"
        :precision="0"
        @pressEnter="handleSaveScore(item.groupId, item.id)"
        @blur="handleSaveScore(item.groupId, item.id)" />
    </div>

    <a-space style="margin-left: 20px">
      <a-button
        type="primary"
        shape="circle"
        size="small"
        class="action-btn"
        @click="$emit('student-add', item.id)">
        <plus-outlined />
      </a-button>
      <a-button
        danger
        shape="circle"
        size="small"
        class="action-btn"
        @click="$emit('student-subtract', item.id)">
        <minus-outlined />
      </a-button>
    </a-space>
  </div>
</template>
<script setup>
import {
  CrownFilled,
  CrownOutlined,
  MinusOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const editScore = ref(0);
const containerRef = ref(null);

const emit = defineEmits([
  'student-add',
  'student-subtract',
  'set-leader',
  'start-editing-score',
  'end-editing-score',
]);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  hoverStudentId: {
    type: String,
    default: null,
  },
});

onClickOutside(containerRef, () => {
  handleSaveScore(props.item.groupId, props.item.Id);
});

const handleSaveScore = (groupId, studentId) => {
  emit('end-editing-score', { groupId: groupId, studentId: studentId });
};

const showEditRowInput = (groupId, studentId) => {
  if (groupId && studentId) {
    emit('start-editing-score', { groupId, studentId });
  }
};

const setLeader = (groupId, studentId) => {
  emit('set-leader', { groupId, studentId });
};
</script>
<style lang="scss" scoped>
$primary-color: #2f54eb;
.student-info {
  position: relative;
  display: flex;
  align-items: center;

  .virtual-crown-btn {
    margin-left: 8px;
    transition: all 0.2s;

    &:hover {
      :deep(svg) {
        color: #f8ab02 !important;
      }
    }
  }

  .leader-icon {
    margin-left: 8px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.student-actions {
  .student-score {
    margin-right: 12px;
    font-weight: 500;
    color: $primary-color;
  }

  .action-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
