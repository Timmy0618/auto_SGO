import { ElMessage } from "element-plus";

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
      ElMessage("換武器！");

      if (!this.weaponList || this.weaponList.length == 0) {
        ElMessage("沒武器！");
        return false;
      }

      // 選耐久夠的武器
      let weaponCanBeSelect = this.weaponList.filter((weapon) => {
        return (
          this.selectWeaponList.includes(weapon.id) &&
          weapon.durability >= this.setting.weaponDuration
        );
      });

      if (weaponCanBeSelect.length == 0) {
        ElMessage("沒武器！");
        return false;
      }

      await this.wearWeapon(weaponCanBeSelect[0].id);
      ElMessage(`穿上${weaponCanBeSelect[0].name}`);

      this.selectWeaponList = weaponCanBeSelect.map((weapon) => weapon.id);

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
}
export default weaponChecker;
