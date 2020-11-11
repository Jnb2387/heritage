import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import { getField, updateField } from "vuex-map-fields";
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    building_button: true,
    parcel_button: true
  },
  getters: {
    getField
  },
  mutations: {
    updateField
  },
  actions: {},
  modules: {}
});
