<template>
  <a-config-provider :locale="zhCN">
    <router-view #="{ Component }">
      <component :is="Component" />
    </router-view>
  </a-config-provider>
</template>
<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
</script>
