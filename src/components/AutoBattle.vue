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

      <el-col :span="8">
        <el-input
          v-model="setting.weaponDuration"
          placeholder="武器耐久"
          type="number"
          size="large"
        >
          <template #prepend>武器 耐久</template>
        </el-input>
      </el-col>
    </el-row>

    <el-card>
      <el-row>
        <el-col :span="12">
          <div class="card-header">
            <h3>裝備中</h3>
          </div>
          <ul class="card-content">
            <li v-for="item in equippedWeapon" :key="item.id">
              {{ item.name }}({{ item.durability }}/{{ item.fullDurability }})
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <div class="card-header">
            <h3>待裝備</h3>
          </div>
          <ul class="card-content">
            <li v-for="itemId in selectWeaponList" :key="itemId">
              {{ itemName(itemId) }}
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>

    <el-divider></el-divider>
    <el-row>
      <WeaponSelect
        :input-weapons="weaponList"
        @weapon-check="weaponCheck"
        @select-weapon="selectWeapons"
      />
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
import { ref, onMounted, defineProps, defineEmits, computed } from "vue";
import map from "../common/mapping";
import { ElMessage } from "element-plus";
import WeaponSelect from "./WeaponSelect.vue";
import sleep from "../common/sleep";
import checker from "../common/checker";

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
  weaponDuration: 20,
  mapLevel: 1,
});
const weaponList = ref([]);
const selectWeaponList = ref([]);
let weaponCheckTag = true;

const setWeapon = async () => {
  let items = await user.item();
  weaponList.value = items.equipments;
};

const equippedWeapon = computed(() => {
  return weaponList.value
    .filter((weapon) => weapon.status == "已裝備")
    .map((weapon) => {
      const { id, name, durability, fullDurability } = weapon;
      return { id, name, durability, fullDurability };
    });
});

const itemName = (itemId) => {
  let weapon = weaponList.value.find((weapon) => weapon.id === itemId);

  return weapon.name ?? itemId;
};

const selectWeapons = (weapons) => {
  selectWeaponList.value = weapons;
};

const weaponCheck = () => {
  weaponCheckTag = !weaponCheckTag;
};

const showContent = ref(false);

const toggleBattleInfo = () => {
  showContent.value = !showContent.value;
};

const emits = defineEmits(["set-profile"]);
const setProfileInfo = async (profileInfo) => {
  emits("set-profile", profileInfo);
};

const handleAutoBattle = async () => {
  scriptStatus.value = true;
  while (scriptStatus.value) {
    scriptDone.value = false;

    if (
      !(await new checker(
        props.profile,
        user,
        setProfileInfo,
        setting.value,
        weaponCheckTag,
        weaponList.value,
        selectWeaponList.value
      ).checkSetting())
    ) {
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

const battle = async () => {
  ElMessage("戰鬥");
  let data = await user.battle();
  setProfileInfo(data.profile);
  setWeapon();
  battleInfo.value = data.messages;
};

onMounted(async () => {
  user = props.userObj;
  setWeapon();
});
</script>

<style>
.card-header {
  position: sticky;
  top: 0;
  z-index: 1;
}

.card-content {
  overflow-y: auto;
  max-height: 100px;
}
</style>

<export default>
    name: 'AutoBattle'
</export>
