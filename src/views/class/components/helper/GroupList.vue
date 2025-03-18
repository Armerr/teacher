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
                  @click.stop="setLeader(group.id, item.id)">
                  <crown-outlined style="color: rgba(0, 0, 0, 0.25)" />
                </a-button>
              </div>
              <div class="student-actions">
                <span class="student-score">{{ item.score }}</span>
                <a-space>
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
import { ref } from 'vue';

const hoverStudentId = ref(null);

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  'group-add',
  'group-subtract',
  'student-add',
  'student-subtract',
  'set-leader',
]);

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
