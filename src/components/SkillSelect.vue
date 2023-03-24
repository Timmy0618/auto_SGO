<template>
  <div>
    <el-row>
      <h3>技能選擇</h3>
    </el-row>

    <el-row>
      <el-card style="width: 600px">
        <el-row>
          <el-col :span="12">
            <div class="card-header">
              <h3>選擇的技能</h3>
            </div>
            <ul class="card-content">
              <li v-for="(skill, index) in selectedSkills" :key="index">
                {{ skill }}
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-card>
    </el-row>

    <el-row>
      <el-button type="primary" @click="toggleExpanded">
        {{ expanded ? "收起" : "展開" }}
      </el-button>
      <template
        v-for="weaponType in Object.keys(props.skills)"
        :key="weaponType"
      >
        <el-table
          :data="props.skills[weaponType]"
          style="width: 100%"
          @selection-change="handleSelectChange"
          v-show="expanded"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" :label="weaponType"></el-table-column>
          <el-table-column
            prop="description"
            label="技能描述"
          ></el-table-column>
        </el-table>
      </template>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";
const props = defineProps({
  userObj: Object,
  skillSelectList: Array,
  skills: Object,
});

const selectedSkills = ref({});
const expanded = ref(false);

const emits = defineEmits(["select-skill"]);

const toggleExpanded = () => {
  expanded.value = !expanded.value;
};

const handleSelectChange = (selectedRows) => {
  selectedSkills.value = selectedRows.map((row) => row.id);
  emits("select-skill", selectedSkills.value);
};
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
      name: 'SkillSelect'
  </export>
