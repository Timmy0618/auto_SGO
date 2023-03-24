import { ElMessage } from "element-plus";

class skillChecker {
  constructor(user) {
    this.user = user;
  }

  disableSkill = async (skillList, selectSkillList) => {
    for (let index = 0; index < selectSkillList.length; index++) {
      const skillId = selectSkillList[index];
      if (this.checkSkillStatus(skillList, skillId)) {
        await this.user.skillEnable(skillId, false);
        ElMessage(`關閉${skillId}`);
      }
    }
  };

  enableSkill = async (skillList, selectSkillList) => {
    for (let index = 0; index < selectSkillList.length; index++) {
      const skillId = selectSkillList[index];
      if (!this.checkSkillStatus(skillList, skillId)) {
        await this.user.skillEnable(skillId, true);
        ElMessage(`開啟${skillId}`);
      }
    }
  };

  checkSkillStatus = (skillList, skillId) => {
    const skillTypes = Object.keys(skillList);
    let skill = null;
    for (let index = 0; index < skillTypes.length; index++) {
      const skillType = skillTypes[index];

      // 找到符合id的rapier項目
      skill = skillList[skillType].find((item) => {
        return item.id === skillId;
      });

      if (skill) break;
    }

    // 如果找不到，返回null
    if (!skill) {
      console.log("找不到技能!");
      throw "找不到技能!";
    }

    // 返回啟用狀態
    return Boolean(skill.enabled);
  };
}

export default skillChecker;
