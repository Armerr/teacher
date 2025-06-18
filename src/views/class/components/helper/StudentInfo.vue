<template>
  <div class="student-info">
    <user-outlined class="student-icon" />
    <span class="student-name">{{ item.name }}</span>
    <div class="crown-container">
      <crown-filled
        v-if="item.leader"
        class="leader-icon"
        style="color: #f8ab02" />
      <a-button
        v-if="!item.leader && hoverStudentId === item.id"
        type="text"
        size="small"
        class="virtual-crown-btn"
        @click.stop="setLeader(item.groupId, item.id)">
        <crown-outlined style="color: rgba(0, 0, 0, 0.25)" />
      </a-button>
    </div>
  </div>
  <div class="student-actions">
    <div ref="containerRef">
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
        style="width: 50px"
        :precision="0"
        @pressEnter="handleSaveScore(item.groupId, item.id)"
        @blur="handleSaveScore(item.groupId, item.id)" />
    </div>

    <a-space style="margin-left: 5px">
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
import { ref, nextTick } from 'vue';
import { onClickOutside } from '@vueuse/core';

const editScore = ref(0);
const containerRef = ref(null);
const inputRef = ref(null);

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
  if (props.item.editingScore) {
    handleSaveScore(props.item.groupId, props.item.id);
  }
});

const handleSaveScore = (groupId, studentId) => {
  emit('end-editing-score', { groupId: groupId, studentId: studentId, newScore: editScore.value });
};

const showEditRowInput = async (groupId, studentId) => {
  if (groupId && studentId) {
    editScore.value = props.item.score;
    emit('start-editing-score', { groupId, studentId });
    await nextTick();
    if (inputRef.value) {
      inputRef.value.focus();
    }
  }
};

const setLeader = (groupId, studentId) => {
  emit('set-leader', { groupId, studentId });
};
</script>
<style lang="scss" scoped>
.student-info {
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 0;
  min-height: 36px;

  .student-icon {
    margin-right: 12px;
    color: #666;
    font-size: 16px;
  }

  .crown-container {
    width: 32px; // 固定宽度，为皇冠图标预留空间
    height: 24px;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .leader-icon {
    // 移除 margin-left，因为已在容器中设置
    cursor: pointer;
    transition: filter 0.2s ease;
    transform: none !important;

    &:hover {
      filter: brightness(1.1);
      transform: none !important;
    }

    &:active {
      transform: none !important;
    }

    &:focus {
      transform: none !important;
    }
  }

  .virtual-crown-btn {
    // 移除 margin-left，因为已在容器中设置
    transition: color 0.2s ease;
    transform: none !important;

    &:hover {
      transform: none !important;

      :deep(svg) {
        color: #f8ab02 !important;
      }
    }

    &:active {
      transform: none !important;
    }

    &:focus {
      transform: none !important;
    }
  }
}

.student-actions {
  display: flex;
  align-items: center;
  gap: 12px;

  .student-score {
    font-weight: 500;
    color: #1890ff;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
    background: #f0f8ff;
    border: 1px solid #d9d9d9;
    min-width: 40px;
    text-align: center;
    font-size: 14px;
    transform: none !important;

    &:hover {
      background: #e6f7ff;
      border-color: #1890ff;
      transform: none !important;
    }

    &:active {
      transform: none !important;
    }

    &:focus {
      transform: none !important;
    }
  }

  .action-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
    transform: none !important;

    &:hover {
      transform: none !important;
    }

    &:active {
      transform: none !important;
    }

    &:focus {
      transform: none !important;
    }
  }
}
</style>
