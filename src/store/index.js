import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
import { getField, updateField } from "vuex-map-fields";
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    points: null,

    //
    markercoords: "-104.9041751,39.5950731",
    menu: false,
    usermarker: false,
    clickPointID: null,
    editedItem: {
      location: null,
      category: null,
      note: "",
      geom: null
    },
    //Layer buttons
    building_button: true,
    parcel_button: true,
    point_button: true
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
    getPoints({ commit }) {
      axios
        .get(
          "https://postgis-api.herokuapp.com/v1/geojson/heritage.points?geom_column=geom&columns=id%2Clocation%2Cnote%2Ccategory"
        )
        .then(response => {
          commit("SET_POINTS", response.data);
        });
    },
    async insertPoint({ dispatch }, data) {
      try {
        const response = await axios.post(
          "https://postgis-api.herokuapp.com/v1/insert_point/",
          data
        );
        console.log(response.data);
        await dispatch("getPoints");
      } catch (error) {
        alert(error);
      }
    },
    async updatePoint({ dispatch, state }, data) {
      console.log(data);
      try {
        await axios.put(
          "https://postgis-api.herokuapp.com/v1/update_point/" +
            state.clickPointID,
          data
        );
        await dispatch("getPoints");
      } catch (error) {
        alert(error);
      }
    },
    async deletePoint({ dispatch, state }) {
      try {
        await axios.post(
          "https://postgis-api.herokuapp.com/v1/delete_point/" +
            state.clickPointID
        );
        await dispatch("getPoints");
      } catch (error) {
        alert(error);
      }
    }
  },
  modules: {}
});
