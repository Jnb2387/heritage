import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
import { getField, updateField } from "vuex-map-fields";
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    points: null,
    markercoords: "-104.9041751,39.5950731",
    building_button: true,
    parcel_button: true
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    SET_POINTS(state, points) {
      state.points = points;
    }
  },
  actions: {
    async insertPoint({ dispatch }, data) {
      try {
        console.log(data);
        await axios.post("https://postgis-api.herokuapp.com/v1/insert_point/", {
          // await axios.post("http://localhost:3000/v1/insert_point/", {
          category: data.category,
          note: data.note,
          geom: data.geom
        });
        await dispatch("getPoints");
      } catch (error) {
        alert(error);
      }
    },
    getPoints({ commit }) {
      axios
        .get(
          "https://postgis-api.herokuapp.com/v1/geojson/heritage.points?geom_column=geom&columns=id%2Cfulladdress%2Cnote%2Ccategory"
        )
        .then(response => {
          commit("SET_POINTS", response.data);
        });
    }
  },
  modules: {}
});
