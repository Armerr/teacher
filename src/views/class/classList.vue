<template>
  <a-space
    direction="vertical"
    style="width: 100%; padding: 10px 10px">
    <div>
      <div style="margin-top: 5px">
        <a-space>
          <a-input
            v-model:value="reqParam.name"
            placeholder="班级名称"
            style="width: 200px"
            :allow-clear="true" />
          <a-button
            type="primary"
            ghost
            @click="search(1)">
            <template #icon>
              <search-outlined />
            </template>
            查询
          </a-button>
        </a-space>
      </div>
      <div style="margin-top: 10px">
        <a-table
          :scroll="{ x: 1300 }"
          table-layout="fixed"
          :bordered="true"
          :data-source="rows"
          :columns="columns"
          :pagination="pagination"
          @resizeColumn="handleResizeColumn"
          @change="tableChange">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'opt'">
              <a-space>
                <a-button
                  type="link"
                  @click="classHelper(record.id)">
                  班级助手
                </a-button>
                <a-button
                  type="link"
                  @click="editClass(record.id)">
                  编辑
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-space>
</template>
<script setup>
import { inject, onMounted, reactive, ref } from 'vue';
import { hideLoading, showLoading } from '@common/loading.js';
import { SearchOutlined } from '@ant-design/icons-vue';
import { list } from '@api/class.js';
import storage from '@common/storage.js';
import { USER_ID } from '@common/constant.js';

const rows = ref([]);
const reqParam = reactive({
  name: '',
  userId: storage.get(USER_ID) ?? '',
});

const openTab = inject('openTab');

const search = (page = pagination.current) => {
  showLoading();
  list({ page, limit: pagination.pageSize, ...reqParam }).then((res) => {
    rows.value = res.rows;
    pagination.total = res.total;
    pagination.current = page;
    hideLoading();
  });
};

const tableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  search();
};

const handleResizeColumn = (w, col) => {
  col.width = w;
};

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  hideOnSinglePage: false,
  showSizeChanger: true,
  showTotal: (total, _) => '总共' + total + '条',
});

function editClass(id) {
  openTab('班级编辑', `/class/classEdit?id=${id}`);
}

function classHelper(id) {
  const params = {};
  params.classId = id;
  openTab('班级助手', `/class/classHelper`, params);
}

onMounted(() => {
  search(1);
});

const columns = [
  {
    title: '班级编号',
    dataIndex: 'id',
    key: 'id',
    width: 50,
    align: 'center',
  },
  {
    title: '班级名称',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: '教师',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: 100,
    align: 'center',
  },
  {
    title: '班级人数',
    dataIndex: 'studentNum',
    key: 'studentNum',
    width: 100,
    align: 'center',
  },
  {
    title: '班级总分',
    dataIndex: 'score',
    key: 'score',
    width: 50,
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateDate',
    key: 'updateDate',
    width: 100,
    align: 'center',
  },
  {
    title: '更新人',
    dataIndex: 'updatePerson',
    key: 'updatePerson',
    width: 100,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'opt',
    key: 'opt',
    width: '100px',
    align: 'center',
  },
];
</script>
