import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { storeToRefs } from "pinia";
import axios from "axios";

export const useCoachStore = defineStore("coach", {
  state: () => {
    const userStore = useUserStore();
    const { userId, getToken } = storeToRefs(userStore);
    // const coachId = userId.value;

    return {
      lastFetch: null,
      coaches: [
        // {
        //   id: "c1",
        //   firstName: "Maximilian",
        //   lastName: "Schwarzmüller",
        //   areas: ["frontend", "backend", "career"],
        //   description:
        //     "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
        //   hourlyRate: 30,
        // },
        // {
        //   id: "c2",
        //   firstName: "Julie",
        //   lastName: "Jones",
        //   areas: ["frontend", "career"],
        //   description:
        //     "I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.",
        //   hourlyRate: 30,
        // },
      ],
      userId,
      getToken,
    };
  },
  getters: {
    hasCoach: (state) => {
      return state.coaches && state.coaches.length > 0;
    },

    isCoach: (state) => {
      return state.coaches.some((coach) => coach.id === state.userId);
    },
    shouldUpdate: (state) => {
      const lastFetch = state.lastFetch;
      if (!lastFetch) return true;

      const currentTimeStep = new Date().getTime();
      return (currentTimeStep - state.lastFetch) / 1000 > 60;
    },
  },

  actions: {
    setFetchTimeStep() {
      this.lastFetch = new Date().getTime();
    },
    async registerCoach(data) {
      const coachData = {
        firstName: data.firstName,
        lastName: data.lastName,
        description: data.description,
        hourlyRate: data.rate,
        areas: data.areas,
      };
      try {
        await axios.put(
          `https://find-coach-3af26-default-rtdb.firebaseio.com/coaches/${this.userId}.json?auth=` +
            this.getToken,
          { ...coachData }
        );
        this.coaches.push({
          ...coachData,
          id: this.userId,
        });
      } catch (err) {
        const error = new Error(err.message || "Failed to Fetch");
        throw error;
      }

      // const response = await fetch(
      //   `https://find-coach-3af26-default-rtdb.firebaseio.com/coaches/${this.userId}.json?auth=` +
      //     this.getToken,
      //   {
      //     method: "PUT",
      //     body: JSON.stringify(coachData),
      //   }
      // );
      // // const responseData = await response.json();
      // if (!response.ok) {
      //   // error
      // }
    },

    async loadCoaches(forceRefresh = false) {
      if (!forceRefresh && !this.shouldUpdate) return;
      // const response = await fetch(
      //   "https://find-coach-3af26-default-rtdb.firebaseio.com/coaches.json"
      // );
      // const responseData = await response.json();
      // if (!response.ok) {
      //   // error
      //   const error = new Error(responseData.message || "Failed to Fetch");
      //   throw error;
      // }
      try {
        const response = await axios.get(
          "https://find-coach-3af26-default-rtdb.firebaseio.com/coaches.json"
        );
        const coaches = [];
        for (const key in response.data) {
          const coach = {
            id: key,
            firstName: response.data[key].firstName,
            lastName: response.data[key].lastName,
            description: response.data[key].description,
            hourlyRate: response.data[key].hourlyRate,
            areas: response.data[key].areas,
          };
          coaches.push(coach);
        }
        this.coaches = coaches;
        this.setFetchTimeStep();
      } catch (err) {
        const error = new Error(err.message || "Failed to Fetch");
        throw error;
      }
    },
  },
});
