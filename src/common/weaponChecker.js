import { ElMessage } from "element-plus";
import typeList from "./typeList";
class weaponChecker {
  constructor(setting, weaponList, selectWeaponList, user) {
    this.setting = setting;
    this.weaponList = weaponList;
    this.selectWeaponList = selectWeaponList;
    this.user = user;
  }

  checkWeapon = async () => {
    let equipped = await this.getEquippedWeapon();

    if (!equipped[0] || equipped[0].durability < this.setting.weaponDuration) {
      //武器沒壞掉的話脫裝備
      if (equipped[0] && equipped[0].id) await this.unEquipped(equipped[0].id);

      ElMessage("換武器！");

      if (!this.weaponList || this.weaponList.length == 0) {
        ElMessage("沒武器！");
        return false;
      }

      // 選耐久夠的武器
      let weaponCanBeSelect = this.selectWeaponList.filter((weapon) => {
        return weapon.durability >= this.setting.weaponDuration;
      });

      if (weaponCanBeSelect.length == 0) {
        ElMessage("沒武器！");
        return false;
      }

      await this.wearWeapon(weaponCanBeSelect[0].id);
      ElMessage(`穿上${weaponCanBeSelect[0].name}`);

      this.selectWeaponList = weaponCanBeSelect;

      return true;
    }

    return true;
  };

  getEquippedWeapon = async () => {
    return this.weaponList
      .filter((weapon) => weapon.status == "已裝備")
      .map((weapon) => {
        const { id, name, durability, fullDurability } = weapon;
        return { id, name, durability, fullDurability };
      });
  };

  wearWeapon = async (id) => {
    this.weaponList = await this.user.equip(id);
  };

  unEquipped = async (id) => {
    this.weaponList = await this.user.unEquip(id);
  };
}
export default weaponChecker;
