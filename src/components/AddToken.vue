<template>
  <el-row>
    <el-col :span="12">
      <el-form>
        <el-form-item label="輸入Token">
          <el-input v-model="input" placeholder="請輸入Token" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item label="已儲存Token">
          <el-tag
            v-for="(str, index) in strList"
            :key="index"
            closable
            @close="handleDelete(index)"
          >
            {{ str.slice(str.length - 10, str.length) }}
          </el-tag>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";

const emits = defineEmits(["set-token"]);
const setToken = async () => {
  emits("set-token", strList.value);
};

const input = ref("");
const strList = ref(JSON.parse(localStorage.getItem("strList")) || []);

const handleAdd = async () => {
  if (input.value) {
    await strList.value.push(input.value);
    localStorage.setItem("strList", JSON.stringify(strList.value));
    input.value = "";
    setToken();
  }
};

const handleDelete = async (index) => {
  await strList.value.splice(index, 1);
  localStorage.setItem("strList", JSON.stringify(strList.value));
  setToken();
};
</script>

<export default>
    name: 'AddToken'
</export>
