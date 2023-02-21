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
      <p>位置：{{ profile.zoneName }}</p>
    </div>
    <el-button type="primary" @click="handleRun">趕路</el-button>
    <el-button type="primary" @click="handleBattle">戰鬥</el-button>
    <el-button type="primary" @click="handleRest">休息</el-button>
    <el-button type="primary" @click="handleRestComplete">休息完成</el-button>
    <div>
      <h1>Auto Battle</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps } from "vue";

const props = defineProps({
  userObj: Object,
});

let user = {};
let profile = ref({});

const handleRun = async () => {
  await user.run();
  getProfile();
};

const handleBattle = async () => {
  await user.battle();
  getProfile();
};

const handleRest = async () => {
  await user.rest();
  getProfile();
};

const handleRestComplete = async () => {
  await user.restComplete();
  getProfile();
};

const getProfile = async () => {
  profile.value = await user.getProfile();
};

onMounted(async () => {
  user = props.userObj;
  getProfile();
});
</script>

<export default>
  name: 'ProfileView'
</export>
