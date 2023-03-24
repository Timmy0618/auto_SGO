<template>
  <div>
    <h1>AutoRecycle</h1>
    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="16">
        <el-input
          v-model.number="durability"
          placeholder="耐久"
          type="number"
          size="large"
          @change="filteredWeapons"
        >
          <template #prepend>耐久小於</template>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="confirmRecycle">回收</el-button>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" title="確認回收">
      <el-row>
        <span>確定要回收這{{ selectedWeapon.length }}個物品嗎？</span>
      </el-row>
      <el-row>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRecycle">確定</el-button>
          <el-button type="danger" @click="emergencyButton = true"
            >緊急停止</el-button
          >
        </span>
      </el-row>
    </el-dialog>

    <el-table :data="selectedWeapon">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="durability" label="Durability"></el-table-column>
      <el-table-column prop="quality" label="Quality"></el-table-column>
      <el-table-column prop="typeName" label="Type"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, defineProps, onMounted } from "vue";
import sleep from "../common/sleep";
const durability = ref(0);
const weapon = ref([]);
const dialogVisible = ref(false);
const selectedWeapon = ref([]);
const emergencyButton = ref(false);
let items = {};

const props = defineProps({
  userObj: Object,
});

const confirmRecycle = () => {
  if (!selectedWeapon.value || selectedWeapon.value.length == 0) {
    ElMessage("沒有武器");
    return;
  }

  dialogVisible.value = true;
};

const handleRecycle = async () => {
  let recycleAry = [...selectedWeapon.value];
  for (let i = 0; i < recycleAry.length; i++) {
    if (emergencyButton.value) continue;
    const id = recycleAry[i].id;
    weapon.value = await props.userObj.recycle(id);
    selectedWeapon.value.splice(0, 1);
    await sleep(500);
  }
  emergencyButton.value = false;
  dialogVisible.value = false;
};

const getItem = async () => {
  items = await props.userObj.item();
  weapon.value = items.equipments;
};

const filteredWeapons = () => {
  selectedWeapon.value = weapon.value.filter(
    (item) => item.durability <= durability.value
  );
};

onMounted(async () => {
  await getItem();
});
</script>

<export default>
    name: 'AutoRecycle'
</export>
