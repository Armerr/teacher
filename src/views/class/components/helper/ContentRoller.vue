<template>
  <div class="content-roll-container">
    <div class="controls">
      <a-button
        v-if="!isRolling"
        type="primary"
        class="control-btn"
        @click="startRolling">
        {{ isRolling ? '滚动中...' : '开始选择' }}
      </a-button>
      <a-button
        v-else
        danger
        class="control-btn"
        @click="stopRolling">
        停止选择
      </a-button>
    </div>

    <div
      v-if="selectedContent"
      class="result">
      <alert-outlined class="result-icon" />
      <span class="result-text">
        本次选中：
        <span class="text-name">{{ selectedContent }}</span>
      </span>
    </div>
    <div
      v-else
      class="rolling-display"
      :class="{ rolling: isRolling }">
      {{ currentContent }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AlertOutlined } from '@ant-design/icons-vue';

const contents = [
  '经典诵读',
  '名贤集',
  '论语',
  '转移前面',
  '经典诵读',
  '任选一类',
  '名贤集',
  '转移后面',
  '论语',
  '经典诵读',
  '转移左面',
  '名贤集',
  '免背一次',
];

const isRolling = ref(false);
const currentContent = ref('点击开始选择背诵内容');
const selectedContent = ref('');
let rollingInterval = null;

const startRolling = () => {
  isRolling.value = true;
  rollingInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * contents.length);
    selectedContent.value = contents[randomIndex];
  }, 60);
};

const stopRolling = () => {
  clearInterval(rollingInterval);
  isRolling.value = false;
};
</script>

<style lang="scss" scoped>
.content-roll-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  padding: 8px 16px;
  line-height: 1.3;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  .header {
    position: absolute;
    top: 10%;
    left: 50%;
    font-size: 24px;
    font-weight: bold;
  }

  .rolling-display {
    font-size: 20px;
    margin: 8px 0;
    min-height: 30px;

    &.rolling {
      color: #1890ff;
      animation: blink 0.8s infinite;
    }
  }

  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 6px 0;

    .control-btn {
      min-width: 90px;
      height: 32px;
    }
  }

  .result {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: 0 auto;
    background: #f0f5ff;
    width: auto;
    padding: 0 12px;

    &-icon {
      margin-right: 6px;
      color: #2f54eb;
      font-size: 14px;
    }

    &-text {
      margin: 6px 8px;
      font-size: 16px;
      font-weight: 500;
      color: #2f54eb;

      .text-name {
        font-size: 18px;
        color: red;
      }
    }
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
