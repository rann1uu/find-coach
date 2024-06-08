import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { storeToRefs } from "pinia";
import axios from "axios";

export const useRequestStore = defineStore("request", {
  state: () => {
    const userStore = useUserStore();
    const { userId, getToken } = storeToRefs(userStore);
    return { requests: [], userId, getToken };
  },
  getters: {
    getRequests: (state) => {
      return state.requests.filter((req) => req.coachId === state.userId);
    },
    hasRequests() {
      return this.getRequests && this.getRequests.length > 0;
    },
  },
  actions: {
    async addRequest(data) {
      const newRequest = {
        userEmail: data.email,
        message: data.message,
      };
      // const response = await fetch(
      //   `https://find-coach-3af26-default-rtdb.firebaseio.com/requests/${data.coachId}.json`,
      //   { method: "POST", body: JSON.stringify(newRequest) }
      // );
      // // For a POST request, firebase will return generated id
      // const responseData = await response.json();
      // if (!response.ok) {
      //   const error = new Error(
      //     responseData.message || "Failed to send request."
      //   );
      //   throw error;
      // }
      try {
        const response = await axios.post(
          `https://find-coach-3af26-default-rtdb.firebaseio.com/requests/${data.coachId}.json`,
          { ...newRequest }
        );
        newRequest.id = response.data.name;
        newRequest.coachId = data.coachId;

        this.requests.push(newRequest);
      } catch (err) {
        const error = new Error(err.message || "Failed to Fetch");
        throw error;
      }
    },

    async fetchRequests() {
      // const response = await fetch(
      //   `https://find-coach-3af26-default-rtdb.firebaseio.com/requests/${this.userId}.json?auth=` +
      //     this.getToken
      // );
      // const responseData = await response.json();
      // if (!response.ok) {
      //   const error = new Error(
      //     responseData.message || "Failed to fetch request."
      //   );
      //   throw error;
      // }
      try {
        const response = await axios.get(
          `https://find-coach-3af26-default-rtdb.firebaseio.com/requests/${this.userId}.json?auth=` +
            this.getToken
        );

        const requests = [];
        for (const key in response.data) {
          const request = {
            id: key,
            coachId: this.userId,
            userEmail: response.data[key].userEmail,
            message: response.data[key].message,
          };
          requests.push(request);
        }
        this.requests = requests;
      } catch (err) {
        const error = new Error(err.message || "Failed to Fetch");
        throw error;
      }
    },
  },
});
