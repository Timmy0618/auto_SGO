<template>
  <div>
    <el-input v-model="token" placeholder="Please input">
      <template #prepend>Token</template>
    </el-input>
    <div v-if="Object.keys(userObj).length > 0">
      <ProfileView :userObj="userObj" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ProfileView from "../components/ProfileView.vue";
import user from "../api/user.js";

const token = ref(process.env.VUE_APP_TOKEN1);

let userObj = ref({});

const setUser = () => {
  userObj.value = new user(token.value);
};

onMounted(async () => {
  setUser();
});
</script>

<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
