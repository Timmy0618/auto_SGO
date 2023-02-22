import axios from "axios";

const baseurl = "https://api.swordgale.online/api";
let token = "";

function user(inputToken) {
  token = inputToken;

  this.getProfile = async function () {
    return await axios
      .get(`${baseurl}/profile`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        let profile = response.data;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  this.rest = async function () {
    return await axios
      .post(
        `${baseurl}/action/rest`,
        {},
        {
          headers: {
            token: token,
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
            token: token,
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
            token: token,
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
        {},
        {
          headers: {
            token: token,
          },
          type: 2,
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

  this.battle = async function () {
    return await axios
      .post(
        `${baseurl}/hunt`,
        {},
        {
          headers: {
            token: token,
          },
          type: 1,
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
            token: token,
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
