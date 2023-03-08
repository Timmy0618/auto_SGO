import axios from "axios";

const baseurl = "https://api.swordgale.online/api";

function user(inputToken) {
  this.token = inputToken;

  this.getProfile = async function () {
    return await axios
      .get(`${baseurl}/profile`, {
        headers: {
          token: this.token,
        },
      })
      .then((response) => {
        let profile = response.data;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  this.rest = async function () {
    return await axios
      .post(
        `${baseurl}/action/rest`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let profile = response.data;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.restComplete = async function () {
    return await axios
      .post(
        `${baseurl}/action/complete`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let profile = response.data.profile;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.moveComplete = async function () {
    return await axios
      .post(
        `${baseurl}/zone/move/complete`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let profile = response.data.profile;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.run = async function () {
    return await axios
      .post(
        `${baseurl}/hunt`,
        {
          type: 2,
        },
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let data = response.data;
        return data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.battle = async function () {
    return await axios
      .post(
        `${baseurl}/hunt`,
        {
          type: 1,
        },
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let data = response.data;
        return data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  // 換地圖 0:城鎮 1:大草原 2:猛牛原 3:兒童樂園 4:蘑菇園 5:圓明園 6:非洲大草原
  this.move = async function (id) {
    return await axios
      .post(
        `${baseurl}/zone/move/${id}`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let profile = response.data.profile;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.revive = async function () {
    return await axios
      .post(
        `${baseurl}/action/revive`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let profile = response.data;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.equip = async function (id) {
    return await axios
      .post(
        `${baseurl}/equipment/${id}/equip`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let equipments = response.data.equipments;
        return equipments;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.unEquip = async function (id) {
    return await axios
      .post(
        `${baseurl}/equipment/${id}/unequip`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let equipments = response.data.equipments;
        return equipments;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.unEquipAll = async function () {
    return await axios
      .post(
        `${baseurl}/equipment/unequipAll`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let equipments = response.data.equipments ?? false;
        return equipments;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.item = async function () {
    return await axios
      .get(`${baseurl}/items`, {
        headers: {
          token: this.token,
        },
      })
      .then((response) => {
        let items = response.data;
        return items;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  // { equipments:[], skills:[] }
  this.huntInfo = async function () {
    return await axios
      .get(`${baseurl}/hunt/info`, {
        headers: {
          token: this.token,
        },
      })
      .then((response) => {
        let info = response.data;
        return info;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  // input {equipmentName: "", selected: [{id: , quantity: }], type: "dagger"}
  this.forge = async function (payload) {
    return await axios
      .post(`${baseurl}/forge`, payload, {
        headers: {
          token: this.token,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          let profile = response.data.profile;
          return profile;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  this.forgeComplete = async function () {
    return await axios
      .post(
        `${baseurl}/forge/complete`,
        {},
        {
          headers: {
            token: this.token,
          },
        }
      )
      .then((response) => {
        let profile = response.data.profile;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
}

export default user;
