<template>
  <a-layout>
    <a-layout-sider class="layout-sider">
      <a-flex
        class="sider-content"
        vertical>
        <div class="logo">
          <a href="/">
            <img
              src="https://img.maitao.com/20240119/yanxue_logo.png"
              style="height: 32px; border-radius: 50%"
              alt="" />
            <h3 style="color: #333; margin-left: 5px">包老师助学系统</h3>
          </a>
        </div>
        <div class="sider-menu-container">
          <a-menu
            id="sideMenu"
            v-model:open-keys="openKeys"
            v-model:selected-keys="selectedKeys"
            mode="inline"
            :items="menuItems"
            @click="handleMenuClick" />
        </div>
      </a-flex>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <div class="header-content">
          <a-popover>
            <template #content>
              <a-space direction="vertical">
                <a-button
                  size="small"
                  type="text"
                  @click="logoutSys">
                  退出登录
                </a-button>
              </a-space>
            </template>
            <div>
              <img
                class="header-logo"
                src="https://img.maitao.com/20240119/yanxue_logo.png"
                alt="" />
              <span class="header-name">{{ loginName }}</span>
            </div>
          </a-popover>
        </div>
      </a-layout-header>
      <a-layout-content class="layout-content">
        <a-tabs
          v-if="tabPanes.length"
          v-model:active-key="activeKey"
          type="editable-card"
          hide-add
          @edit="tabEdit"
          @change="tabChange">
          <a-tab-pane
            v-for="pane in tabPanes"
            :key="pane.key"
            :tab="pane.title"
            :closable="pane.closable"
            :path="pane.path" />
        </a-tabs>
        <div
          v-if="tabPanes.length"
          class="router-view-pane">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component
                :is="Component"
                :key="router.currentRoute.value.fullPath" />
            </keep-alive>
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import confirm from '@common/confirm';
import storage from '@common/storage';
import { cloneDeep, isEqual } from 'lodash-es';
import qs from 'qs';
import { RouterView } from 'vue-router';
import { reactive, ref, provide, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { MAX_TAB_NUM, USER_NAME } from '@common/constant';
import router from '@common/router';

const openKeys = ref(['sub1']);
const selectedKeys = ref(['1']);
const activeKey = ref('');
const tabPanes = ref([]);
const loginName = computed(() => {
  const username = storage.get(USER_NAME);
  return username || '';
});

provide('openTab', openTab);
provide('closeTab', closeTab);

function logoutSys() {
  confirm.pop('确定要退出吗？', '温馨提示').then(() => {
    storage.clearStaff();
    router.replace('/');
  });
}

function getItem(label, key, icon, path, children, type) {
  return { key, icon, path, children, label, type };
}

const menuItems = reactive([
  getItem('研学助手', 'sub1', null, null, [
    getItem('活动管理', 'g1', null, '/activity/activityList'),
  ]),
]);

function handleMenuClick(menu) {
  const { label, path } = menu.item.originItemValue;
  openTabByUrl(label, path);
}

function openTabByUrl(label, fullPath) {
  const url = document.createElement('a');
  url.href = fullPath;
  let query = {};
  if (url.search && url.search.startsWith('?')) {
    const search = url.search.split('?')[1];
    query = qs.parse(search);
  }
  openTab(label, url.pathname, query);
}

function tabChange(key) {
  activeKey.value = key;
  const tab = tabPanes.value.find((p) => p.path === key);
  if (!tab) {
    return;
  }
  activeKey.value = tab.path;
  router.push({ path: tab.path, query: tab.query });
}

/**
 * 打开Tab
 * @param title Tab的标题
 * @param path  路由跳转的path
 * @param query 路由跳转的query
 * @param replace 是否replace
 */
function openTab(title, path, query, replace = false) {
  const pane = {
    path,
    query: query || {},
    key: path,
    title,
    closable: true,
  };
  // 限制选项卡的数量
  if (tabPanes.value.length >= MAX_TAB_NUM) {
    message.error(`选项卡不能超过${MAX_TAB_NUM}个`);
    return;
  }
  const index = tabPanes.value.findIndex((i) => i.key === path);
  if (index >= 0) {
    const currTab = tabPanes.value[index];
    const tabQuery = cloneDeep(currTab.query);
    delete tabQuery.$timestamp;
    delete pane.query.$timestamp;
    // if (!isEqual(tabQuery, pane.query)) {
    pane.query.$timestamp = new Date().getTime();
    // }
    tabPanes.value[index].title = title;
    tabPanes.value[index].query = pane.query;
    activeKey.value = pane.path;
    router.push({ path: pane.path, query: pane.query, replace });
    return;
  }
  tabPanes.value.push(pane);
  activeKey.value = pane.path;
  router.push({ path: pane.path, query: pane.query, replace });
}

/**
 * 关闭Tab
 * @param path 要关闭的Tab的path
 */
function closeTab(path) {
  let lastIndex = tabPanes.value.findIndex((i) => i.key === path);
  if (lastIndex > 0) {
    lastIndex -= 1;
  }
  tabPanes.value = tabPanes.value.filter((p) => p.key !== path);
  if (tabPanes.value.length > 0 && path === activeKey.value) {
    const tab = tabPanes.value[lastIndex];
    activeKey.value = tab.path;
    router.push({ path: tab.path, query: tab.query, replace: true });
  }
}

onMounted(() => {
  openTab('活动管理', '/activity/activityList');
});

function tabEdit(targetKey, action) {
  if (action === 'remove') {
    closeTab(targetKey);
  }
}
</script>
<style lang="scss" scoped>
.layout-sider {
  background-color: #fff;
  height: 100vh;
  box-shadow: 2px 0 8px rgba(29, 35, 41, 0.05);
  display: flex;
  flex-direction: column;
  .sider-content {
    //display: flex;
    //flex-direction: column;
    height: 100%;
  }
  .sider-menu-container {
    flex: 1;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .logo {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    z-index: 5;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    > img {
      height: 32px;
    }
    > a {
      display: flex;
      align-items: center;
      > img {
        height: 32px;
      }
      > h3 {
        margin: 0;
      }
    }
  }
}
.layout-header {
  height: 48px;
  line-height: 48px;
  padding-inline: 0;
  z-index: 9;
  .header-content {
    width: 100%;
    height: 100%;
    background: #fff;
    padding-inline: 16px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .header-logo {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .header-name {
      margin-left: 10px;
    }
  }
}
.layout-content {
  height: 100%;
  background: #fff;
  padding: 8px;
  .router-view-pane {
    width: 100%;
    overflow: scroll;
    height: calc(100vh - 120px);
  }
}
</style>
