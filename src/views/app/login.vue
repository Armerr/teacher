<template>
  <div class="content">
    <img
      class="login-icon"
      src="@assets/images/login-img.webp"
      alt="" />
    <div class="action-view">
      <a-input
        v-model:value="data.loginName"
        allow-clear>
        <template #addonBefore>
          <div style="display: flex">
            <div>用户名&emsp;</div>
            <UserOutlined />
          </div>
        </template>
      </a-input>

      <a-input-password
        v-model:value="data.password"
        style="margin-top: 10px"
        allow-clear>
        <template #addonBefore>
          <div style="display: flex">
            <div>密&emsp;码&emsp;</div>
            <LockOutlined />
          </div>
        </template>
      </a-input-password>

      <a-button
        style="margin-top: 20px"
        @click="loginClick">
        登&emsp;录
      </a-button>
    </div>
  </div>
</template>
<script setup>
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { login } from '@api/login';
import { YX_STAFF_ID, YX_STAFF_INFO, YX_TOKEN, MT_AUTH } from '@common/constant';
import storage from '@common/storage';
import router from '@common/router';
import { message } from 'ant-design-vue';
import md5 from 'blueimp-md5';
import { ref } from 'vue';

const data = ref({
  loginName: '',
  password: '',
});

function loginClick() {
  login({
    loginname: data.value.loginName,
    password: md5(data.value.password),
  }).then((res) => {
    message.success('登录成功');
    storage.set(YX_TOKEN, res.token);
    storage.set(YX_STAFF_ID, res.staffBasicInfo.staffId);
    storage.set(YX_STAFF_INFO, res.staffBasicInfo);
    storage.set(MT_AUTH, res.staffBasicInfo.encryptedStaffId);
    router.replace('/main');
  });
}
</script>
<style lang="scss" scoped>
.action-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  margin-left: 10px;
  background: rgba(255, 255, 255, 0.6);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 4px 0 16px rgba(29, 35, 41, 0.15);
}

.login-icon {
  width: 400px;
  object-fit: contain;
  border-radius: 60px;
}

.content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: url('@assets/images/login-bg.webp') no-repeat;
  width: 100vw;
  height: 100vh;
}
</style>
