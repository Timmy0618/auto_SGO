import { ElMessage } from "element-plus";
import moment from "moment";

class statusCheck {
  constructor(profile, setProfileInfo, user) {
    this.profile = profile;
    this.setProfileInfo = setProfileInfo;
    this.user = user;
    this.forgeStatus = true;
  }

  checkStatus = async () => {
    switch (this.profile.actionStatus) {
      case "休息":
        if (this.actionTime() >= 10) {
          let profile = await this.user.restComplete();
          this.profile = profile;
          await this.setProfileInfo(profile);
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
          this.profile = profile;
          await this.setProfileInfo(profile);
          ElMessage("移動完成！");
          return true;
        }
        ElMessage(`移動中！(耗時：${this.actionTime()})分`);
        return false;

      case "重生":
        if (this.actionTime() >= 10) {
          this.setProfileInfo(await this.user.restComplete());
          ElMessage("復活！");
          return true;
        }
        ElMessage(`甦醒中！(耗時：${this.actionTime()})分`);
        return false;

      case "鍛造":
        if (this.forgeTime() < -5) {
          this.setProfileInfo(await this.user.forgeComplete());
          ElMessage("鍛造完成");
          this.forgeStatus = true;
          return true;
        }
        ElMessage(`鍛造中！(耗時：${this.actionTime()})分`);
        this.forgeStatus = false;
        return false;

      default:
        ElMessage(this.profile.actionStatus);
        return true;
    }
  };

  actionTime = () => {
    let diff = moment.duration(moment().diff(moment(this.profile.actionStart)));
    return diff.minutes();
  };

  rest = async () => {
    ElMessage("開始休息！");
    let profile = await this.user.rest();
    this.profile = profile;
    await this.setProfileInfo(profile);
  };

  forgeTime = () => {
    let diff = moment.duration(
      moment(this.profile.forgingCompletionTime).diff(moment())
    );
    return diff.seconds();
  };
}

export default statusCheck;
