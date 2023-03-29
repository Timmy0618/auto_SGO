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
          <el-option
            v-for="(item, index) in map"
            :key="index"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-col>
      <el-col :span="8">
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
    </el-row>

    <el-row style="margin-bottom: 20px" :gutter="20">
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
          v-model="setting.runLevel"
          placeholder="趕路層數"
          type="number"
          size="large"
        >
          <template #prepend>趕路 層數</template>
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

    <el-row style="margin-bottom: 5px" :gutter="20">
      <el-col :span="4">
        <h3>補品選擇</h3>
      </el-col>
      <el-col :span="12" :offset="0">
        <el-switch
          v-model="medicineCheckTag"
          active-text="Open"
          inactive-text="Close"
        ></el-switch>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="8">
        <el-select
          v-model="medicineSetting.medicineHpId"
          class="m-2"
          placeholder="Hp"
          size="large"
        >
          <el-option
            v-for="(item, index) in medicine"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-input
          v-model="medicineSetting.medicineHpQuantity"
          placeholder="補品數量"
          type="number"
          size="large"
        >
          <template #prepend>吃補品數量</template>
        </el-input>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="8">
        <el-select
          v-model="medicineSetting.medicineSpId"
          class="m-2"
          placeholder="Sp"
          size="large"
        >
          <el-option
            v-for="(item, index) in medicine"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-input
          v-model="medicineSetting.medicineSpQuantity"
          placeholder="補品數量"
          type="number"
          size="large"
        >
          <template #prepend>吃補品數量</template>
        </el-input>
      </el-col>
    </el-row>

    <el-divider></el-divider>

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
            <li v-for="(weapon, index) in selectWeaponList" :key="index">
              {{ weapon.name }}({{ weapon.durability }} /
              {{ weapon.fullDurability }})
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>

    <el-divider></el-divider>
    <el-row>
      <WeaponSelect
        :input-weapons="weaponList"
        @equipment-check="equipmentCheck"
        @update-check-weapon="checkWeapon"
        @update-check-armor="checkArmor"
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
import { ref, onMounted, defineProps, defineEmits, computed, watch } from "vue";
import map from "../common/mapping";
import { ElMessage } from "element-plus";
import WeaponSelect from "./WeaponSelect.vue";
import sleep from "../common/sleep";
import statusChecker from "../common/statusChecker";
import autoBattleChecker from "../common/autoBattleChecker";
import weaponChecker from "../common/weaponChecker";
import medicineList from "../common/medicineList";

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
  mapLevel: 2,
  runLevel: 0,
});
const weaponList = ref([]);
const selectWeaponList = ref([]);
let equipmentCheckTag = true;
let weaponCheckTag = true;
let armorCheckTag = false;
let medicineCheckTag = ref(true);
let medicineSetting = ref({
  medicineHpId: "",
  medicineSpId: "",
  medicineHpQuantity: 0,
  medicineSpQuantity: 0,
});
const items = ref({});

const setWeapon = async () => {
  items.value = await user.item();
  weaponList.value = items.value.equipments;
};

watch(
  () => weaponList.value,
  () => {
    updateSelectedWeapon();
  }
);

const updateSelectedWeapon = async () => {
  let temp = [];

  selectWeaponList.value.filter((selectedObject) => {
    let matchingObject = weaponList.value.find(
      (object) => object.id === selectedObject.id
    );

    if (
      matchingObject &&
      selectedObject.durability > setting.value.weaponDuration
    ) {
      temp.push(matchingObject);

      return matchingObject;
    }
  });
  selectWeaponList.value = temp;
};

const equippedWeapon = computed(() => {
  return weaponList.value
    .filter((weapon) => weapon.status == "已裝備")
    .map((weapon) => {
      const { id, name, durability, fullDurability } = weapon;
      return { id, name, durability, fullDurability };
    });
});

const selectWeapons = (weapons) => {
  selectWeaponList.value = weapons;
};

const equipmentCheck = () => {
  equipmentCheckTag = !equipmentCheckTag;
};

const checkWeapon = () => {
  weaponCheckTag = !weaponCheckTag;
};
const checkArmor = () => {
  armorCheckTag = !armorCheckTag;
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
  if (!(await checkMedicine())) return;

  if (!(await checkRunLevel())) return;

  scriptStatus.value = true;
  while (scriptStatus.value) {
    scriptDone.value = false;

    const myStatusChecker = new statusChecker(
      props.profile,
      setProfileInfo,
      props.userObj
    );

    if (await myStatusChecker.checkStatus()) {
      const myWeaponChecker = new weaponChecker(
        setting.value,
        weaponList.value,
        selectWeaponList.value,
        selectWeapons,
        weaponCheckTag,
        armorCheckTag,
        user
      );

      const myAutoBattleChecker = new autoBattleChecker(
        props.profile,
        user,
        setProfileInfo,
        setting.value,
        equipmentCheckTag,
        myWeaponChecker,
        medicineCheckTag,
        medicineSetting.value
      );

      if (!(await myAutoBattleChecker.checkSetting())) {
        console.log("waiting");
      } else {
        if (props.profile.huntStage < setting.value.runLevel) {
          await run();
        } else {
          await battle();
        }
        count.value += 1;
      }
      setWeapon();
    }

    await sleep(11000);
    scriptDone.value = true;
  }
};

const handleStop = async () => {
  scriptStatus.value = false;
};

const checkRunLevel = async () => {
  if (
    setting.value.runLevel != 0 &&
    Number(setting.value.runLevel) > Number(setting.value.mapLevel)
  ) {
    ElMessage("趕路 > 層數！");
    return false;
  }

  return true;
};

const checkMedicine = async () => {
  if (!medicineCheckTag.value) return true;

  if (
    !medicineSetting.value.medicineHpId ||
    !medicineSetting.value.medicineSpId
  ) {
    ElMessage("沒選補品");
    return false;
  }

  return true;
};

const run = async () => {
  ElMessage("趕路");
  let data = await user.run();
  setProfileInfo(data.profile);
  battleInfo.value = data.messages;
};

const battle = async () => {
  ElMessage("戰鬥");
  let data = await user.battle();
  setProfileInfo(data.profile);
  battleInfo.value = data.messages;
};

const medicine = computed(() => {
  let result = [];
  if (!items.value.consumables) return result;

  for (let index = 0; index < medicineList.length; index++) {
    const itemName = medicineList[index];
    for (let index = 0; index < items.value.consumables.length; index++) {
      const item = items.value.consumables[index];
      if (item.name == itemName)
        result.push({
          name: `${itemName} (${item.quantity})`,
          id: item.id,
        });
    }
  }

  return result;
});

const readSetting = async () => {
  let token = user.token;
  let userSetting =
    (await JSON.parse(localStorage.getItem(`setting_${token}`))) || {};

  if (Object.keys(userSetting).length == 0) return;

  setting.value = userSetting.setting;
  medicineSetting.value = userSetting.medicineSetting;
};

const writeSetting = async () => {
  let token = user.token;
  const userSetting = {
    setting: setting.value,
    medicineSetting: medicineSetting.value,
  };
  localStorage.setItem(`setting_${token}`, JSON.stringify(userSetting));
};

watch(
  () => [setting.value, medicineSetting.value],
  () => {
    writeSetting();
  },
  { deep: true }
);

watch(
  () => items.value,
  () => {
    medicine.value;
  }
);

onMounted(async () => {
  user = props.userObj;
  await setWeapon();
  await readSetting();
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
