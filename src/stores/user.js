import { defineStore } from "pinia";
import axios from "axios";
let timer;
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userId: null,
      token: null,
      setAutoLogout: false,
    };
  },
  getters: {
    getToken: (state) => state.token,
    authenticated: (state) => !!state.token,
  },
  actions: {
    async login(payload) {
      return this.auth({ ...payload, mode: "login" });
    },
    async signup(payload) {
      return this.auth({ ...payload, mode: "signup" });
    },

    async auth(payload) {
      const mode = payload.mode;
      let url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCSknyG47AifTDSocgm9U7gFKLOSxDh-z4";
      if (mode === "signup") {
        url =
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCSknyG47AifTDSocgm9U7gFKLOSxDh-z4";
      }
      // const response = await fetch(url, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     email: payload.email,
      //     password: payload.password,
      //     returnSecureToken: true,
      //   }),
      // });
      // const responseData = await response.json();
      // if (!response.ok) {
      //   const error = new Error(
      //     responseData.message || "Failed to authenticate."
      //   );
      //   throw error;
      // }
      try {
        const response = await axios.post(url, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        });
        console.log(response);

        // const expiresIn = 5000;
        const expiresIn = +response.data.expiresIn * 1000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("userId", response.data.localId);
        localStorage.setItem("tokenExpiration", expirationDate);

        timer = setTimeout(() => {
          this.autoLogout();
        }, expiresIn);

        this.token = response.data.idToken;
        this.userId = response.data.localId;
        this.setAutoLogout = false;
      } catch (err) {
        const error = new Error(err.message || "Failed to Fetch");
        throw error;
      }
    },
    tryLogin() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(() => {
        this.autoLogout();
      }, expiresIn);

      if (token && userId) {
        this.token = token;
        this.userId = userId;
        this.tokenExpiration = null;
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpiration");
      clearTimeout(timer);
      this.userId = null;
      this.token = null;
      this.tokenExpiration = null;
    },
    autoLogout() {
      this.logout();
      this.setAutoLogout = true;
    },
  },
});
