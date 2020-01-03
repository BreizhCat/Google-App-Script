import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuItem: [
      {
        id: 1,
        icon: "far fa-minus-square",
        text: "menu_collapse",
        action: "collapse-all"
      },
      {
        id: 3,
        icon: "far fa-calendar-plus",
        text: "menu_add",
        action: "add-new-item"
      },
      { id: 4, icon: "far fa-check-circle", text: "menu_create", action: "" }
    ],
    currentRoute: "",
  },
  mutations: {
    updateCurrentRoute(state, route) {
      state.currentRoute = route;
    },
  },
  actions: {},
  getters: {
    getCurrentRoute: state => {
      return state.currentRoute;
    },

  }
});
