<!-- GroupList.vue -->
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
              <template #icon><plus-outlined /></template>
            </a-button>
            <a-button
              danger
              shape="round"
              class="score-btn"
              @click="$emit('group-subtract', group.id)">
              <template #icon><minus-outlined /></template>
            </a-button>
          </a-space>
        </div>

        <a-divider class="divider" />

        <a-list
          :data-source="group.students"
          class="student-list">
          <template #renderItem="{ item }">
            <a-list-item class="student-item">
              <div class="student-info">
                <user-outlined class="student-icon" />
                <span class="student-name">{{ item.name }}</span>
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
import { UserOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

defineEmits(['group-add', 'group-subtract', 'student-add', 'student-subtract']);
</script>

<style lang="scss" scoped>
$primary-color: #2f54eb;
$text-color: #1f1f1f;
$secondary-text: #8c8c8c;

.group-list {
  margin: -8px;

  .group-card {
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    :deep(.ant-card-head) {
      padding: 0 16px;
      border-bottom: none;
    }

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
      }
    }

    .divider {
      margin: 12px 0;
    }

    .student-list {
      max-height: 400px;
      overflow-y: auto;

      .student-item {
        padding: 8px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.3s;

        &:hover {
          background-color: #fafafa;
        }

        .student-info {
          display: flex;
          align-items: center;

          .student-icon {
            margin-right: 12px;
            color: $secondary-text;
          }

          .student-name {
            color: $text-color;
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
</style>
