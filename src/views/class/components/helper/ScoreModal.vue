<template>
  <a-modal
    v-model:visible="visible"
    title="学生成绩总览"
    wrap-class-name="no-scroll-modal"
    width="600px"
    :body-style="{
      height: '600px',
      overflowY: 'auto',
      overflowX: 'hidden',
    }"
    :footer="null">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane
        key="all"
        tab="完整数据">
        <div class="full-data-table">
          <a-table
            :data-source="sortedStudents"
            :columns="columns"
            :pagination="false"
            size="middle"
            bordered>
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'rank'">
                <span :class="['rank-number', getRankClass(index)]">
                  {{ index + 1 }}
                </span>
              </template>
              <template v-if="column.key === 'score'">
                <span :class="getScoreClass(record.score)">
                  {{ record.score }}
                </span>
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Modal as AModal, Tabs as ATabs, Table as ATable } from 'ant-design-vue';

const props = defineProps({
  students: Array, // 接收完整学生数据
});

const visible = ref(false);
const activeKey = ref('all'); // 默认激活完整数据Tab

// 表格列配置
const columns = [
  {
    title: '排名',
    key: 'rank',
    width: 100,
    sorter: (a, b) => a.rank - b.rank,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '分数',
    key: 'score',
    sorter: (a, b) => a.score - b.score,
  },
  {
    title: '所属小组',
    dataIndex: 'groupName',
    key: 'group',
  },
];

// 处理后的排序数据（带排名）
const sortedStudents = computed(() =>
  [...props.students]
    .sort((a, b) => b.score - a.score)
    .map((student, index) => ({
      ...student,
      rank: index + 1,
    }))
);

// 打开弹窗方法
const openModal = () => {
  visible.value = true;
};

// 样式处理函数
const getRankClass = (index) => {
  if (index < 3) return 'top-rank';
  if (index >= sortedStudents.value.length - 3) return 'bottom-rank';
  return '';
};

const getScoreClass = (score) => {
  if (score >= 90) return 'high-score';
  if (score < 60) return 'low-score';
  return '';
};

defineExpose({ openModal });
</script>

<style scoped>
.full-data-table {
  height: 100%;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.ant-table-row) {
  transition: background-color 0.3s;
}

:deep(.ant-table-row:hover) {
  background-color: #fafafa;
}

.rank-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 4px;
}

.top-rank {
  background: #fff7e6;
  color: #fa8c16;
}

.bottom-rank {
  background: #fff1f0;
  color: #ff4d4f;
}

.high-score {
  color: #52c41a;
  font-weight: 500;
}

.low-score {
  color: #ff4d4f;
  font-weight: 500;
}
</style>
