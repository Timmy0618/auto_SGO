<template>
  <div>
    <h1>Profile</h1>
    <el-card>
      <el-row>
        <el-col :span="8">Name：</el-col>
        <el-col :span="16">{{ profile.nickname }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">HP：</el-col>
        <el-col :span="16">{{ profile.hp }}/{{ profile.fullHp }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">體力：</el-col>
        <el-col :span="16">{{ profile.sp }}/{{ profile.fullSp }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">狀態：</el-col>
        <el-col :span="16">{{ profile.actionStatus }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">位置：</el-col>
        <el-col :span="16"
          >{{ profile.zoneName }} {{ profile.huntStage }}</el-col
        >
      </el-row>
      <el-row v-show="showDetails">
        <el-col :span="8">Lv：</el-col>
        <el-col :span="16">{{ profile.lv }}</el-col>
      </el-row>
      <el-row v-show="showDetails">
        <el-col :span="8">Exp：</el-col>
        <el-col :span="16">{{ profile.exp }}/{{ profile.nextExp }}</el-col>
      </el-row>

      <el-row v-show="showDetails">
        <el-col :span="8">開始時間：</el-col>
        <el-col :span="16"
          >{{ moment(profile.actionStart).format("MM-DD HH:mm:ss") }} ({{
            dateDiff
          }})</el-col
        >
      </el-row>
      <el-row v-show="showDetails">
        <el-col :span="8">操作：</el-col>
        <el-col :span="16">
          <el-button type="primary" @click="handleBackTown">回城</el-button>
          <el-button type="primary" @click="handleRun">趕路</el-button>
          <el-button type="primary" @click="handleBattle">戰鬥</el-button>
          <el-button type="primary" @click="handleRest">休息</el-button>
          <el-button type="primary" @click="handleRestComplete"
            >完成休息</el-button
          >
          <el-button type="primary" @click="handleMoveComplete"
            >完成移動</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-button type="primary" size="small" @click="showDetails = !showDetails">
      {{ showDetails ? "隱藏" : "顯示詳情" }}
    </el-button>
  </div>

  <div>
    <AutoBattle
      :userObj="userObj"
      :profile="profile"
      @set-profile="setProfile"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, computed } from "vue";
import AutoBattle from "../components/AutoBattle.vue";
import moment from "moment";

const props = defineProps({
  userObj: Object,
});

let user = {};
let profile = ref({});
const showDetails = ref(false);

const setProfile = (profileInfo) => {
  profile.value = profileInfo;
  getProfile();
};

const handleRun = async () => {
  let data = await user.run();
  profile.value = data.profile;
};

const handleBattle = async () => {
  let data = await user.battle();
  profile.value = data.profile;
};

const handleRest = async () => {
  profile.value = await user.rest();
};

const handleRestComplete = async () => {
  profile.value = await user.restComplete();
};

const handleMoveComplete = async () => {
  profile.value = await user.moveComplete();
};

const handleBackTown = async () => {
  profile.value = await user.move(0);
};

const getProfile = async () => {
  profile.value = await user.getProfile();
};

const sleep = async (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms));
};

const getInterval = async () => {
  for (;;) {
    await getProfile();
    await sleep(10000);
  }
};

const dateDiff = computed(() => {
  let diff = moment.duration(moment().diff(moment(profile.value.actionStart)));
  return `${diff.hours()} 小時 ${diff.minutes()} 分 ${diff.seconds()}秒`;
});

onMounted(async () => {
  user = props.userObj;
  getProfile();
  getInterval();
});
</script>

<export default>
  name: 'ProfileView'
</export>