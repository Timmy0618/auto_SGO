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
    </el-row>

    <el-row>
      <el-col :span="12">
        <h3>鍛造素材</h3>
        <ul class="card-content">
          <li v-for="item in findItemNameById" :key="item.name">
            {{ item.name }}* {{ item.quantity }}
          </li>
        </ul>
      </el-col>

      <el-col :span="12">
        <h3>持有素材</h3>
        <ul class="card-content">
          <li v-for="item in findHoldItemNameById" :key="item.name">
            {{ item.name }}* {{ item.quantity }}
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, watch, computed } from "vue";
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
let item = {};

const emits = defineEmits(["set-profile"]);
const setProfileInfo = async (profileInfo) => {
  emits("set-profile", profileInfo);
};

const props = defineProps({
  userObj: Object,
  profile: Object,
});

const parseWeaponSelected = () => {
  try {
    if (!forgeItems.value) {
      weaponPayload.value.selected = "";
      return;
    }
    weaponPayload.value.selected = JSON.parse(forgeItems.value);
  } catch (error) {
    forgeItems.value = "";
    weaponPayload.value.selected = "";
    ElMessage("json 格式錯誤");
  }
};

const handleAutoForge = async () => {
  scriptStatus.value = true;
  while (scriptStatus.value) {
    scriptDone.value = false;
    const myForgeChecker = new forgeChecker(
      props.profile,
      setProfileInfo,
      props.userObj
    );

    if (await myForgeChecker.checkStatus()) {
      if (!(await forge())) {
        scriptStatus.value = false;
        scriptDone.value = true;
        return;
      }

      if (myForgeChecker.forgeStatus) await getItem();
    }

    await sleep(11000);
    scriptDone.value = true;
  }
};

const forge = async () => {
  let profile = await props.userObj.forge(weaponPayload.value);
  await getItem();
  if (!profile) {
    ElMessage("鍛造失敗");
    return false;
  } else {
    ElMessage("鍛造中");
    await setProfileInfo(profile);
    return true;
  }
};

const findItemNameById = computed(() => {
  const ary1 = weaponPayload.value.selected;
  const ary2 = item.mines;
  const ary3 = [];

  for (let i = 0; i < ary1.length; i++) {
    for (let j = 0; j < ary2.length; j++) {
      if (ary1[i].id === ary2[j].id) {
        ary3.push({ name: ary2[j].name, quantity: ary1[i].quantity });
        break;
      }
    }
  }

  return ary3;
});

const findHoldItemNameById = computed(() => {
  const ary1 = weaponPayload.value.selected;
  const ary2 = item.mines;
  const ary3 = [];

  for (let i = 0; i < ary1.length; i++) {
    for (let j = 0; j < ary2.length; j++) {
      if (ary1[i].id === ary2[j].id) {
        ary3.push({ name: ary2[j].name, quantity: ary2[j].quantity });
        break;
      }
    }
  }

  return ary3;
});

const handleStop = () => {
  scriptStatus.value = false;
};

const getItem = async () => {
  item = await props.userObj.item();
  findHoldItemNameById.value;
};

onMounted(async () => {
  await getItem();
});

watch(
  () => weaponPayload.value.selected,
  () => {
    findItemNameById.value; // 強制觸發 getter 函數，使 computed 屬性重新計算
    findHoldItemNameById.value; // 強制觸發 getter 函數，使 computed 屬性重新計算
  }
);
</script>

<export default>
    name: 'AutoForge'
</export>

<style scoped>
.card-header {
  position: sticky;
  top: 0;
  z-index: 1;
}

.card-content {
  overflow-y: auto;
  max-height: 200px;
}
</style>
