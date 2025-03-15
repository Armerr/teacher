<template>
  <div class="container">
    <div class="header">点名器</div>
    <div class="controls">
      <a-button
        v-if="!isRolling"
        type="primary"
        :disabled="isRolling"
        class="control-btn"
        @click="$emit('roll-start')">
        {{ isRolling ? '点名中...' : '开始点名' }}
      </a-button>
      <a-button
        v-else
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
      <span class="result-text"
        >本次抽中：<span class="text-name">{{ selectedStudent }}</span></span
      >
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
  width: auto;
  height: 100%;
  padding: 16px 24px;
  line-height: 1.5;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;

  .header {
    font-size: 16px;
    font-weight: bold;
  }

  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0;

    .control-btn {
      min-width: 100px;
    }
  }

  .result {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: 0 auto;
    background: #f0f5ff;
    width: 10%;

    &-icon {
      margin-right: 8px;
      color: #2f54eb;
    }

    &-text {
      margin: 10px 10px;
      font-size: 22px;
      font-weight: 500;
      color: #2f54eb;

      .text-name {
        font-size: 24px;
        color: red;
      }
    }
  }
}
</style>
