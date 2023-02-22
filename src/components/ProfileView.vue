<template>
  <div>
    <h1>Profile</h1>
    <div>
      <p>Name：{{ profile.nickname }}</p>
      <p>HP：{{ profile.hp }}/{{ profile.fullHp }}</p>
      <p>體力：{{ profile.sp }}/{{ profile.fullSp }}</p>
      <p>Lv：{{ profile.lv }}</p>
      <p>Exp：{{ profile.exp }}</p>
      <p>Next Exp：{{ profile.nextExp }}</p>
      <p>狀態：{{ profile.actionStatus }}</p>
      <p>
        開始時間：{{ moment(profile.actionStart).format("MM-DD HH:mm:ss") }} ({{
          dateDiff
        }})
      </p>
      <p>位置：{{ profile.zoneName }} {{ profile.huntStage }}</p>
    </div>
    <el-button type="primary" @click="handleBackTown">回城</el-button>
    <el-button type="primary" @click="handleRun">趕路</el-button>
    <el-button type="primary" @click="handleBattle">戰鬥</el-button>
    <el-button type="primary" @click="handleRest">休息</el-button>
    <el-button type="primary" @click="handleRestComplete">完成休息</el-button>
    <el-button type="primary" @click="handleMoveComplete">完成移動</el-button>
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
  // getInterval();
});
</script>

<export default>
  name: 'ProfileView'
</export>
