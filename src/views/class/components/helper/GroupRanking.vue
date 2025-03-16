<template>
  <a-card
    title="小组排行榜"
    class="ranking-card"
    :head-style="{ borderBottom: '1px solid #f0f0f0', padding: '0 16px' }"
    :body-style="{ padding: '8px 0' }">
    <a-list :data-source="groups">
      <template #renderItem="{ item, index }">
        <a-list-item class="ranking-item">
          <div
            class="rank-icon"
            :style="{ color: getRankColor(index) }">
            <trophy-filled v-if="index < 3" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="group-info">
            <span class="group-name">{{ item.name }}</span>
            <span class="group-score">{{ item.score }} 分</span>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script setup>
import { TrophyFilled } from '@ant-design/icons-vue';

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

const getRankColor = (index) => {
  const colors = ['#ffd666', '#d3adf7', '#5cdbd3'];
  return colors[index] || '#bfbfbf';
};
</script>

<style lang="scss" scoped>
$rank-colors: (#ffd666, #d3adf7, #5cdbd3);

.ranking-card {
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0 !important;

  :deep(.ant-card-head) {
    border-bottom: 1px solid #f0f0f0;
    padding: 0 16px;
  }

  :deep(.ant-card-body) {
    padding: 8px 0;
  }

  .ranking-item {
    padding: 12px 24px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #fafafa;
    }

    .rank-icon {
      width: 32px;
      height: 32px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      @for $i from 0 through 2 {
        &:nth-child(#{$i + 1}) {
          color: nth($rank-colors, $i + 1);
        }
      }
    }

    .group-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;

      .group-name {
        font-weight: 500;
      }

      .group-score {
        color: red;
        font-weight: 600;
      }
    }
  }
}
</style>
