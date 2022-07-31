import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: window.localStorage.getItem("user"),
    isGifsLoading: false,
    gifs: [],
  },
  getters: {
    getUserStatus: (state) => !!state.user,
    getUser: (state) => JSON.parse(state.user),
    getGifs: (state) => state.gifs,
    getIsGifsLoading: (state) => state.isGifsLoading,
  },
  mutations: {
    setUser: (state, currentUser) => {
      if (!currentUser) {
        state.user = null;
        window.localStorage.removeItem("user");
        return;
      }
      let theUser = JSON.stringify(currentUser);
      state.user = theUser;
      window.localStorage.setItem("user", theUser);
    },
    setGifs: (state, gifs) => {
      state.gifs = gifs;
    },
    setIsGifsLoading: (state, isLoading) => {
      state.isGifsLoading = isLoading;
    },
  },
  actions: {
    updateUser: ({ commit }, payload) => {
      commit("setUser", payload.currentUser);
    },
    getReactionGifs: async ({ commit }, payload) => {
      commit("setIsGifsLoading", true);
      axios
        .get("api/reactionGifs?q=" + payload)
        .then((res) => {
          console.log("res:", res.data);
          commit("setIsGifsLoading", false);
          commit("setGifs", res.data);
        })
        .catch((err) => {
          console.log(err);
          commit("setIsGifsLoading", false);
        });
    },
  },
  modules: {},
});
