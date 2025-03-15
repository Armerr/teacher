<template>
  <div class="content">
    <img
      class="login-icon"
      src="@assets/images/login-img.webp"
      alt="" />
    <div class="action-view">
      <a-input
        v-model:value="data.mobile"
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
import { USER_ID, USER_NAME, A_TOKEN } from '@common/constant';
import storage from '@common/storage';
import router from '@common/router';
import { message } from 'ant-design-vue';
import md5 from 'blueimp-md5';
import { ref } from 'vue';

const data = ref({
  mobile: '',
  password: '',
});

function loginClick() {
  login({
    mobile: data.value.mobile,
    password: data.value.password,
  }).then((res) => {
    message.success('登录成功');
    storage.set(A_TOKEN, res.token);
    storage.set(USER_ID, res.userId);
    storage.set(USER_NAME, res.username);
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
  background: url('@assets/images/login-bg.webp') no-repeat center / cover;
  width: 100vw;
  height: 100vh;
}
</style>
