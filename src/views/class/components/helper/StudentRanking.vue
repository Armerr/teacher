<template>
  <div class="rank-container">
    <div>
      <span class="rank-header">学生排行榜</span>
      <a-button
        class="rank-header-button"
        type="link"
        @click="openScoreModal">
        查看所有排名
      </a-button>
      <ScoreModal
        ref="scoreModal"
        :students="students" />
    </div>
    <div class="rank-section">
      <h2>🏆 学霸前三甲</h2>
      <div
        v-for="(student, index) in top3"
        :key="student.id"
        class="student-item top-item"
        :class="['top-' + (index + 1)]">
        <span class="medal">
          {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
        </span>
        <span class="name">{{ student.name }}</span>
        <span class="score">{{ student.score }}分</span>
      </div>
    </div>

    <div class="rank-section">
      <h2>💣 重点关怀榜</h2>
      <div
        v-for="(student, index) in bottom3"
        :key="student.id"
        class="student-item bottom-item">
        <span class="warning">⚠️</span>
        <span class="rank">倒数第{{ index + 1 }}</span>
        <span class="name">{{ student.name }}</span>
        <span class="score">{{ student.score }}分</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ScoreModal from '@views/class/components/helper/ScoreModal.vue';

const props = defineProps({
  students: {
    type: Array,
    default: () => [],
  },
});

const scoreModal = ref();

const openScoreModal = () => {
  scoreModal.value.openModal();
};

const sortedStudents = computed(() => [...props.students].sort((a, b) => b.score - a.score));

const top3 = computed(() => sortedStudents.value.slice(0, 3));
const bottom3 = computed(() => {
  const arr = sortedStudents.value.slice(-3);
  return [...arr].reverse();
});
</script>

<style scoped>
.rank-container {
  display: grid;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
}

.rank-header {
  padding: 3px 20px;
  font-weight: 600;
  font-size: 16px;
}

.rank-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  transition: transform 0.2s;
}

.student-item:hover {
  transform: translateX(5px);
}

/* 前三名样式 */
.top-item {
  background: linear-gradient(90deg, #fff6e0 0%, #fff 100%);
  border-left: 4px solid;
}

.top-item.top-1 {
  border-color: #ffd700;
}

.top-item.top-2 {
  border-color: #c0c0c0;
}

.top-item.top-3 {
  border-color: #cd7f32;
}

.medal {
  font-size: 24px;
  margin-right: 15px;
  width: 40px;
  text-align: center;
}

/* 倒数三名样式 */
.bottom-item {
  background: linear-gradient(90deg, #ffe9e9 0%, #fff 100%);
  border-left: 4px solid #ff6b6b;
}

.warning {
  color: #ff4757;
  margin-right: 15px;
  width: 40px;
  text-align: center;
}

.rank {
  color: #ff6b6b;
  font-weight: 500;
  min-width: 80px;
}

.name {
  flex: 1;
  color: #2c3e50;
  font-weight: 500;
}

.score {
  color: #666;
  font-family: monospace;
  font-size: 1.1em;
}
</style>
