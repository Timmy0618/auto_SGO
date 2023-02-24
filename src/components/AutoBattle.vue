<template>
  <div>
    <h1>Auto Battle</h1>
    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="8">
        <el-select
          v-model="setting.map"
          class="m-2"
          placeholder="Map"
          size="large"
        >
          <el-option v-for="(item, index) in map" :key="index" :value="item" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          @click="handleAutoBattle"
          :disabled="!(scriptStatus == false && scriptDone == true)"
          >自動戰鬥</el-button
        >
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleStop">停止</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="執行狀態：">{{ scriptStatus }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="執行次數：">{{ count }}</el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="8">
        <el-input
          v-model="setting.hp"
          placeholder="血量"
          type="number"
          size="large"
        >
          <template #prepend>HP 極限</template>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-input
          v-model="setting.sp"
          placeholder="體力"
          type="number"
          size="large"
        >
          <template #prepend>SP 極限</template>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-input
          v-model="setting.mapLevel"
          placeholder="層數"
          type="number"
          size="large"
        >
          <template #prepend>層數 極限</template>
        </el-input>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="toggleBattleInfo">{{
          showContent ? "隱藏戰鬥資訊" : "展開戰鬥資訊"
        }}</el-button>
        <el-col v-show="showContent">
          <p v-for="(info, index) in battleInfo" :key="index">
            {{ info.m }}
          </p>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, defineEmits } from "vue";
import map from "../common/mapping";
import { ElMessage } from "element-plus";
import moment from "moment";

const props = defineProps({
  userObj: Object,
  profile: Object,
});

let scriptStatus = ref(false);
let scriptDone = ref(true);
let user = {};
let battleInfo = ref({});
const value = ref("");
const count = ref(0);
let setting = ref({
  hp: 100,
  sp: 150,
  map: value,
  mapLevel: 1,
});

const showContent = ref(false);

const toggleBattleInfo = () => {
  showContent.value = !showContent.value;
};

const emits = defineEmits(["set-profile"]);
const setProfileInfo = async (profileInfo) => {
  emits("set-profile", profileInfo);
  return true;
};

const handleAutoBattle = async () => {
  scriptStatus.value = true;
  while (scriptStatus.value) {
    scriptDone.value = false;
    if (!(await checkSetting())) {
      console.log("waiting");
    } else {
      await battle();
      count.value += 1;
    }
    await sleep(11000);
    scriptDone.value = true;
  }
};

const handleStop = async () => {
  scriptStatus.value = false;
};

const checkSetting = async () => {
  try {
    console.log("checkSetting");
    return checkStatus()
      .then((isStatusValid) => {
        if (isStatusValid) return checkHpSp();
        else return false;
      })
      .then((isHpSpValid) => {
        if (isHpSpValid) return checkMap();
        else return false;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  } catch (error) {
    alert(error);
  }
};

const checkHpSp = async () => {
  if (
    props.profile.hp <= setting.value.hp ||
    props.profile.sp <= setting.value.sp
  ) {
    ElMessage("體力血量不夠！");
    await rest();
    return false;
  }
  return true;
};

const checkMap = async () => {
  if (setting.value.map === "") {
    ElMessage("請選地圖！");
    return false;
  }

  if (props.profile.zoneName !== setting.value.map) {
    ElMessage("地圖不對！");
    setProfileInfo(await user.move(map.indexOf(setting.value.map)));
    ElMessage("移動！");
    return false;
  }

  if (props.profile.huntStage >= setting.value.mapLevel) {
    ElMessage("層數超過！");
    setProfileInfo(await user.move(0));
    ElMessage("回城！");
    return false;
  }

  return true;
};

const checkStatus = async () => {
  switch (props.profile.actionStatus) {
    case "休息":
      if (actionTime() >= 10) {
        await setProfileInfo(await user.restComplete());
        ElMessage("休息完成！");
        if (props.profile.sp < props.profile.fullSp) {
          ElMessage("體力沒滿繼續睡");
          rest();
          return false;
        } else {
          return true;
        }
      }
      ElMessage("休息中！");
      return false;

    case "移動":
      if (actionTime() >= 5) {
        setProfileInfo(await user.moveComplete());
        ElMessage("移動完成！");
        return true;
      }
      ElMessage(`移動中！(耗時：${actionTime()})分`);
      return false;

    default:
      ElMessage(props.profile.actionStatus);
      return true;
  }
};

const rest = async () => {
  ElMessage("開始休息！");
  setProfileInfo(await user.rest());
};

const battle = async () => {
  ElMessage("戰鬥");
  let data = await user.battle();
  setProfileInfo(data.profile);
  battleInfo.value = data.messages;
};

const sleep = async (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms));
};

const actionTime = () => {
  let diff = moment.duration(moment().diff(moment(props.profile.actionStart)));
  return diff.minutes();
};

onMounted(async () => {
  user = props.userObj;
});
</script>

<export default>
    name: 'AutoBattle'
</export>