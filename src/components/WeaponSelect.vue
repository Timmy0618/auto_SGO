<template>
  <div>
    <el-row>
      <el-col :span="12">
        <h3>武器選擇</h3>
      </el-col>
      <el-col :span="12" :offset="0">
        <el-switch
          v-model="weaponCheck"
          @change="handleWeaponCheck"
          active-text="Open"
          inactive-text="Close"
          >{{ weaponCheck ? "已啟用" : "已關閉" }}</el-switch
        >
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-button type="primary" @click="isCollapse = !isCollapse">
        {{ isCollapse ? "武器詳細" : "隱藏" }}
      </el-button>
    </el-row>

    <transition name="el-zoom-in-top" mode="out-in">
      <div v-show="!isCollapse">
        <el-row>
          <el-col>
            <el-button type="primary" @click="confirm"> 套用 </el-button>
            <el-input v-model.trim="searchText" placeholder="請輸入武器類型" />
          </el-col>
        </el-row>
        <el-row>
          <el-checkbox-group v-model="checkedWeapons">
            <el-checkbox
              v-for="weapon in filteredWeapons"
              :key="weapon.id"
              :label="weapon"
            >
              {{ weapon.name }} ({{ weapon.durability }} /
              {{ weapon.fullDurability }})
            </el-checkbox>
          </el-checkbox-group>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch } from "vue";

const props = defineProps({
  userObj: Object,
  inputWeapons: Array,
  inputCheckedWeapons: Array,
});

const isCollapse = ref(true);
const searchText = ref("");
const weaponCheck = ref(true);
const checkedWeapons = ref([]);

const emits = defineEmits(["select-weapon", "un-equip-all", "weapon-check"]);
const confirm = async () => {
  emits("select-weapon", checkedWeapons.value);
  checkedWeapons.value = [];
};

const handleWeaponCheck = () => {
  emits("weapon-check");
};

const filteredWeapons = computed(() => {
  const text = searchText.value.trim().toLowerCase();
  return props.inputWeapons.filter((weapon) =>
    weapon.typeName.toLowerCase().includes(text)
  );
});

watch(
  () => props.inputWeapons,
  () => {
    filteredWeapons.value; // 強制觸發 getter 函數，使 computed 屬性重新計算
  }
);
</script>

<style scoped>
.el-checkbox-group {
  max-height: 300px;
  overflow: auto;
}
</style>

<export default>
    name: 'WeaponSelect'
</export>
