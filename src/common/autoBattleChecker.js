import map from "../common/mapping";
import specialMap from "../common/specialMap";
import { ElMessage } from "element-plus";
import weaponChecker from "./weaponChecker";

class autoBattleChecker {
  constructor(
    profile,
    user,
    setProfileInfo,
    setting,
    weaponCheckTag,
    weaponList,
    selectWeaponList,
    medicineCheckTag,
    medicineSetting
  ) {
    this.profile = profile;
    this.user = user;
    this.setProfileInfo = setProfileInfo;
    this.setting = setting;
    this.weaponCheckTag = weaponCheckTag;
    this.weaponList = weaponList;
    this.selectWeaponList = selectWeaponList;
    this.medicineCheckTag = medicineCheckTag;
    this.medicineSetting = medicineSetting;
  }

  checkSetting = async () => {
    try {
      console.log("checkSetting");
      return await this.checkHpSp()
        .then((isHpSpValid) => {
          if (isHpSpValid) return this.checkMap();
          else return false;
        })
        .then((isMapValid) => {
          if (isMapValid) {
            if (!this.weaponCheckTag) return true;
            else
              return new weaponChecker(
                this.setting,
                this.weaponList,
                this.selectWeaponList,
                this.user
              ).checkWeapon();
          } else return false;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    } catch (error) {
      alert(error);
    }
  };

  checkHpSp = async () => {
    if (this.profile.hp <= 0) {
      ElMessage("你死了廢物！");
      await this.revive();
      return false;
    }

    if (
      this.profile.hp <= this.setting.hp ||
      this.profile.sp <= this.setting.sp
    ) {
      ElMessage("體力血量不夠！");
      if (this.medicineCheckTag.value) await this.eatMedicine();
      else await this.rest();
      return false;
    }
    return true;
  };

  revive = async () => {
    await this.user.revive();
    ElMessage("死者甦醒之術！");
  };

  checkMap = async () => {
    if (this.setting.map === "") {
      ElMessage("請選地圖！");
      return false;
    }

    // 判斷是否到秘境
    if (
      specialMap.includes(this.setting.map) &&
      this.profile.zoneName != this.setting.map
    ) {
      if (await this.checkSpecialMap()) {
        return true;
      } else {
        return false;
      }
    }

    if (this.profile.zoneName !== this.setting.map) {
      ElMessage("地圖不對！");
      this.setProfileInfo(
        await this.user.move(getMapIdByName(this.setting.map))
      );
      ElMessage("移動！");
      return false;
    }

    if (this.profile.huntStage >= this.setting.mapLevel) {
      ElMessage("層數超過！");
      this.setProfileInfo(await this.user.move(0));
      ElMessage("回城！");
      return false;
    }

    return true;
  };

  checkSpecialMap = async () => {
    switch (this.setting.map) {
      case "草原秘徑":
        //還沒到秘境
        if (this.profile.zoneName == "大草原") {
          if (Number(this.profile.huntStage) == 16) {
            let profile = await this.user.path(
              getMapIdByName(this.setting.map)
            );
            this.setProfileInfo(profile);
            ElMessage("進入秘境！");
            return true;
          }
          return true;
        } else {
          ElMessage("地圖不對！");
          this.setProfileInfo(await this.user.move(getMapIdByName("大草原")));
          ElMessage("移動！");

          return false;
        }

      default:
        return false;
    }
  };

  rest = async () => {
    ElMessage("開始休息！");
    this.setProfileInfo(await this.user.rest());
  };

  eatMedicine = async () => {
    ElMessage("開始吃補品！");
    let payload = JSON.parse(
      '{"quantity": ' + this.medicineSetting.medicineQuantity + "}"
    );
    this.setProfileInfo(
      await this.user.eatMedicine(this.medicineSetting.medicineId, payload)
    );
  };
}

function getMapIdByName(name) {
  const found = map.find((item) => item.name === name);
  return found ? found.id : null;
}

export default autoBattleChecker;
