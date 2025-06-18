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
        :head-style="{ padding: '0 16px', borderBottom: 'none' }"
        :body-style="{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }">
        <div class="card-content">
          <div class="group-header">
            <div class="total-score">
              <span class="label">小组总分：</span>
              <span class="value">{{ group.score }}</span>
            </div>
            <div class="score-controls">
              <div class="group-score">{{ group.score }}</div>
              <div class="group-actions">
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
              </div>
            </div>
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
                  :item="{ ...item, groupId: group.id }"
                  @student-add="$emit('student-add', item.id)"
                  @student-subtract="$emit('student-subtract', item.id)"
                  @set-leader="setLeader"
                  @start-editing-score="
                    () => $emit('start-editing-score', { groupId: group.id, studentId: item.id })
                  "
                  @end-editing-score="
                    (param) => $emit('end-editing-score', param)
                  " />
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
import { nextTick, ref } from 'vue';
import StudentInfo from '@views/class/components/helper/StudentInfo.vue';

const hoverStudentId = ref(null);

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
.group-list {
  .group-card {
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    border: 1px solid #e8e8e8;
    background: white;
    overflow: hidden;
    min-height: 520px;
    display: flex;
    flex-direction: column;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px;
    }

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      border-radius: 6px;
      margin-bottom: 8px;

      .group-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        color: #333;
      }

      .score-controls {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .group-score {
        font-size: 16px;
        font-weight: 600;
        background: #1890ff;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        min-width: 50px;
        text-align: center;
      }

      .group-actions {
        display: flex;
        gap: 8px;

        .ant-btn {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
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
    }
    .divider {
      margin: 8px 0;
      border-color: rgba(0, 0, 0, 0.06);
    }

    .student-list {
      flex: 1;
      min-height: 380px;
      max-height: 380px;
      overflow-y: auto;
      padding: 6px;
      background: #fafafa;
      border-radius: 8px;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 2px;

        &:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      }

      .student-item {
        padding: 4px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s ease;
        cursor: pointer;
        border-radius: 6px;
        margin: 1px 0;
        background: white;
        border: 1px solid #f0f0f0;

        &:hover {
          background: #f0f8ff;
          border-color: #d9d9d9;
          transform: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

:deep(.ant-card-head) {
  padding: 0 !important;
  border-bottom: none !important;
  background: transparent !important;
}

:deep(.ant-card-body) {
  padding: 8px 16px 16px !important;
  border-bottom: none !important;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.ant-card) {
  border: none !important;
  background: transparent !important;
}
</style>
