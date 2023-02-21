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
        let profile = response.data;
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
        let profile = response.data;
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
        let profile = response.data;
        return profile;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
}

export default user;
