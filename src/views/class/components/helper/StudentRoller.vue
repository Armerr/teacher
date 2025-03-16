<template>
  <div class="student-roll-container">
    <div class="header">点名器</div>
    <div class="controls">
      <a-button
        v-if="!isRolling"
        type="primary"
        class="control-btn"
        @click="startRolling">
        {{ isRolling ? '点名中...' : '开始点名' }}
      </a-button>
      <a-button
        v-else
        danger
        class="control-btn"
        @click="stopRolling">
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

    <div
      v-else
      class="rolling-display"
      :class="{ rolling: isRolling }">
      点击开始点名
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AlertOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  students: { type: Array, default: () => [] },
});

const isRolling = ref(false);
const selectedStudent = ref('');
let rollingInterval = null;

const startRolling = () => {
  isRolling.value = true;
  rollingInterval = setInterval(() => {
    const studentNames = props.students.map((student) => student.name);
    const randomIndex = Math.floor(Math.random() * props.students.length);
    selectedStudent.value = studentNames[randomIndex];
  }, 50);
};

const stopRolling = () => {
  clearInterval(rollingInterval);
  isRolling.value = false;
};
</script>

<style lang="scss" scoped>
.student-roll-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 200px;
  padding: 16px 24px;
  line-height: 1.5;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  .header {
    position: absolute;
    top: 10%;
    left: 10%;
    font-size: 24px;
    font-weight: bold;
  }


  .rolling-display {
    font-size: 24px;
    margin: 20px 0;
    min-height: 40px;

    &.rolling {
      color: #1890ff;
      animation: blink 0.8s infinite;
    }
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
    width: auto;
    padding: 0 20px;

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
