<template>
  <div>
    <h1>AutoForge</h1>
    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="12">
        <el-button
          type="primary"
          @click="handleAutoForge"
          :disabled="!(scriptStatus == false && scriptDone == true)"
          >自動鍛造</el-button
        >
      </el-col>

      <el-col :span="6">
        <el-button type="primary" @click="handleStop">停止</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="10">
        <el-select v-model="weaponPayload.type" placeholder="請選擇武器">
          <el-option
            v-for="(weapon, index) in forgeList"
            :key="index"
            :label="weapon.name"
            :value="weapon.type"
          />
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model="weaponPayload.equipmentName"
          placeholder="請輸名字"
        ></el-input>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="24">
        <el-input
          size="large"
          type="textarea"
          placeholder="請輸入 selected payload"
          v-model="forgeItems"
          @change="parseWeaponSelected"
        />
      </el-col>
      {{ weaponPayload }}
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import forgeList from "../common/forgeList";
import forgeChecker from "../common/forgeChecker";
import { ElMessage } from "element-plus";
import sleep from "../common/sleep";

const scriptStatus = ref(false);
const scriptDone = ref(true);
const forgeItems = ref("");
const weaponPayload = ref({
  equipmentName: "",
  selected: "",
  type: "",
});

const emits = defineEmits(["set-profile"]);
const setProfileInfo = async (profileInfo) => {
  emits("set-profile", profileInfo);
};

const props = defineProps({
  userObj: Object,
  profile: Object,
});

const parseWeaponSelected = () => {
  weaponPayload.value.selected = JSON.parse(forgeItems.value);
};

const handleAutoForge = async () => {
  scriptStatus.value = true;
  while (scriptStatus.value) {
    scriptDone.value = false;
    if (
      await new forgeChecker(
        props.profile,
        setProfileInfo,
        props.userObj
      ).checkStatus()
    ) {
      if (!(await forge())) {
        scriptStatus.value = false;
        scriptDone.value = true;
        return;
      }
    }

    await sleep(11000);
    scriptDone.value = true;
  }
};

const forge = async () => {
  let profile = await props.userObj.forge(weaponPayload.value);
  if (!profile) {
    ElMessage("鍛造失敗");
    return false;
  } else {
    ElMessage("鍛造中");
    await setProfileInfo(profile);
    return true;
  }
};

const handleStop = () => {
  scriptStatus.value = false;
};
</script>

<export default>
    name: 'AutoForge'
</export>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
