<template>
  <el-row :gutter="20">
    <el-col v-for="(userObj, index) in userAry" :key="index" :span="12">
      <el-card :body-style="{ padding: '20px' }">
        <ProfileView :userObj="userObj" />
      </el-card>
      <el-divider />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ProfileView from "../components/ProfileView.vue";
import user from "../api/user.js";

const tokenAry = JSON.parse(process.env.VUE_APP_TOKENS);
let userAry = ref([]);

const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  let clone = Object.assign({}, obj);

  Object.keys(clone).forEach((key) => {
    clone[key] = deepClone(clone[key]);
  });

  return clone;
};

onMounted(async () => {
  for (let index = 0; index < tokenAry.length; index++) {
    userAry.value.push(deepClone(new user(tokenAry[index])));
  }
  console.log(userAry.value);
});
</script>

<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
