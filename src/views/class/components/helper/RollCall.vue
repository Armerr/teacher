<template>
  <div class="container">
    <div class="controls">
      <a-button
        type="primary"
        :disabled="isRolling"
        class="control-btn"
        @click="$emit('roll-start')">
        {{ isRolling ? '点名中...' : '开始点名' }}
      </a-button>
      <a-button
        danger
        :disabled="!isRolling"
        class="control-btn"
        @click="$emit('roll-stop')">
        停止点名
      </a-button>
    </div>
    <div
      v-if="selectedStudent"
      class="result">
      <alert-outlined class="result-icon" />
      <span class="result-text">本次抽中：{{ selectedStudent }}</span>
    </div>
  </div>
</template>

<script setup>
import { AlertOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  selectedStudent: {
    type: String,
    default: '',
  },
  isRolling: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['roll-start', 'roll-stop']);
</script>

<style lang="scss" scoped>
.container {
  padding: 16px 24px;
  line-height: 1.5;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;

  &-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .title {
    margin-bottom: 12px;
    font-size: 20px;
    color: #1f1f1f;
  }

  .controls {
    margin-bottom: 8px;

    .control-btn {
      min-width: 100px;
    }
  }

  .result {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: #f0f5ff;
    border-radius: 4px;

    &-icon {
      margin-right: 8px;
      color: #2f54eb;
    }

    &-text {
      font-weight: 500;
      color: #2f54eb;
    }
  }
}
</style>
