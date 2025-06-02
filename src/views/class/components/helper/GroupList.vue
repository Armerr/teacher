<template>
  <a-row
    :gutter="[16, 16]"
    class="group-list">
    <a-col
      v-for="group in groups"
      :key="group.id"
      :xs="24"
      :sm="12"
      :md="8">
      <a-card
        :title="group.name"
        class="group-card"
        :head-style="{ padding: '0 16px', borderBottom: 'none' }">
        <div class="group-header">
          <div class="total-score">
            <span class="label">小组总分：</span>
            <span class="value">{{ group.score }}</span>
          </div>
          <a-space>
            <a-button
              type="primary"
              shape="round"
              class="score-btn"
              @click="$emit('group-add', group.id)">
              <template #icon>
                <plus-outlined />
              </template>
            </a-button>
            <a-button
              danger
              shape="round"
              class="score-btn"
              @click="$emit('group-subtract', group.id)">
              <template #icon>
                <minus-outlined />
              </template>
            </a-button>
          </a-space>
        </div>

        <a-divider class="divider" />

        <a-list
          :data-source="group.students"
          class="student-list">
          <template #renderItem="{ item }">
            <a-list-item
              class="student-item"
              @mouseenter="handleMouseEnter(item.id)"
              @mouseleave="handleMouseLeave">
              <student-info
                :hover-student-id="hoverStudentId"
                :item="item"
                @student-add="$emit('student-add')"
                @student-subtract="$emit('student-subtract')"
                @set-leader="setLeader"
                @start-editing-score="$emit('start-editing-score')"
                @end-editing-score="$emit('end-editing-score')" />
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import {
  UserOutlined,
  PlusOutlined,
  MinusOutlined,
  CrownFilled,
  CrownOutlined,
} from '@ant-design/icons-vue';
import { nextTick, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import StudentInfo from '@views/class/components/helper/StudentInfo.vue';

const hoverStudentId = ref(null);
const inputRef = ref(null);

const currentEditGroupId = ref(null);
const currentEditStudentId = ref(null);

const emit = defineEmits([
  'group-add',
  'group-subtract',
  'student-add',
  'student-subtract',
  'set-leader',
  'start-editing-score',
  'end-editing-score',
]);

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

const handleMouseEnter = (studentId) => {
  hoverStudentId.value = studentId;
};

const handleMouseLeave = () => {
  hoverStudentId.value = null;
};

const setLeader = (groupId, studentId) => {
  emit('set-leader', { groupId, studentId });
  hoverStudentId.value = null;
};
</script>

<style lang="scss" scoped>
$primary-color: #2f54eb;
$text-color: #1f1f1f;
$secondary-text: #8c8c8c;

.group-list {
  margin: 20px 10px;

  .group-card {
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;

      .total-score {
        font-size: 16px;

        .label {
          color: $secondary-text;
        }

        .value {
          color: $primary-color;
          font-weight: 600;
        }
      }

      .score-btn {
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 !important;
      }
    }

    .divider {
      margin: 12px 0;
    }

    .student-list {
      max-height: 400px;
      overflow-y: auto;

      .student-item {
        padding: 4px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.3s;
        cursor: pointer;

        &:hover {
          background-color: #fafafa;
        }
      }
    }
  }
}

:deep(.ant-card-head) {
  padding: 0 16px !important;
  border-bottom: none !important;
}

:deep(.ant-card-body) {
  padding: 5px 15px !important;
  border-bottom: none !important;
}
</style>
