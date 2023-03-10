import moment from "moment";
import map from "../common/mapping";
import specialMap from "../common/specialMap";
import { ElMessage } from "element-plus";
import weaponChecker from "./weaponChecker";

class checker {
  constructor(
    profile,
    user,
    setProfileInfo,
    setting,
    weaponCheckTag,
    weaponList,
    selectWeaponList
  ) {
    this.profile = profile;
    this.user = user;
    this.setProfileInfo = setProfileInfo;
    this.setting = setting;
    this.weaponCheckTag = weaponCheckTag;
    this.weaponList = weaponList;
    this.selectWeaponList = selectWeaponList;
  }

  actionTime = () => {
    let diff = moment.duration(moment().diff(moment(this.profile.actionStart)));
    return diff.minutes();
  };

  forgeTime = () => {
    let diff = moment.duration(
      moment(this.profile.forgingCompletionTime).diff(moment())
    );
    return diff.minutes();
  };

  rest = async () => {
    ElMessage("開始休息！");
    this.setProfileInfo(await this.user.rest());
  };

  checkSetting = async () => {
    try {
      console.log("checkSetting");
      return await this.checkStatus()
        .then((isStatusValid) => {
          if (isStatusValid) return this.checkHpSp();
          else return false;
        })
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

  checkStatus = async () => {
    switch (this.profile.actionStatus) {
      case "休息":
        if (this.actionTime() >= 10) {
          let profile = await this.user.restComplete();
          await this.setProfileInfo(profile);
          this.profile = profile;
          ElMessage("休息完成！");
          if (this.profile.sp < this.profile.fullSp) {
            ElMessage("體力沒滿繼續睡");
            this.rest();
            return false;
          } else {
            return true;
          }
        }
        ElMessage("休息中！");
        return false;

      case "移動":
        if (this.actionTime() >= 5) {
          let profile = await this.user.moveComplete();
          await this.setProfileInfo(profile);
          this.profile = profile;
          ElMessage("移動完成！");
          return true;
        }
        ElMessage(`移動中！(耗時：${this.actionTime()})分`);
        return false;

      case "重生":
        if (this.actionTime() >= 10) {
          let profile = await this.user.restComplete();
          await this.setProfileInfo(profile);
          this.profile = profile;
          ElMessage("復活！");
          return true;
        }
        ElMessage(`甦醒中！(耗時：${this.actionTime()})分`);
        return false;

      case "鍛造":
        if (this.forgeTime() <= 0) {
          let profile = await this.user.forgeComplete();
          await this.setProfileInfo(profile);
          this.profile = profile;
          ElMessage("鍛造完成");
          return true;
        }
        ElMessage(`鍛造中！(耗時：${this.actionTime()})分`);
        return false;

      default:
        ElMessage(this.profile.actionStatus);
        return true;
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
      await this.rest();
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
            this.profile = profile;
            ElMessage("進入秘境！");
            return true;
          }
          return true;
        } else {
          ElMessage("地圖不對！");
          this.setProfileInfo(await this.user.move(getMapIdByName("大草原")));
          ElMessage("移動！");

          return true;
        }

      default:
        break;
    }
    return;
  };
}

function getMapIdByName(name) {
  const found = map.find((item) => item.name === name);
  return found ? found.id : null;
}

export default checker;
