<template>
  <v-card>
    <div id="map"></div>
    <!-- <Legend /> -->
    <LayerToggle @toggle-layer="layertoggle" />
  </v-card>
</template>
<script>
// import { mapFields } from "vuex-map-fields";
import mapboxgl from "mapbox-gl";
import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
const MapboxGeocoder = require("@mapbox/mapbox-gl-geocoder");

import RegularStyle from "../../data/heritage_style.json";
import BaseButton from "../js/mapControlBaseButton";

// import Legend from "./Legend";
import LayerToggle from "./LayerToggle";

export default {
  name: "MapComponent",
  components: {
    // Legend,
    LayerToggle
  },
  data() {
    return {
      map: {}
    };
  },
  methods: {
    initMap: function() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiYnJhZGxleTIzODciLCJhIjoiY2pnMTk0ZTk2NmJzOTJxbnZpMjl1ZGsxbiJ9.L-BSY_VjUrkHL3ov0OciKQ";
      const map = (this.map = new mapboxgl.Map({
        container: "map",
        style: RegularStyle,
        center: [-104.90903, 39.59884],
        zoom: 11,
        maxBounds: [
          [-104.92337547, 39.59166919], // Southwest coordinates,
          [-104.89571004, 39.60577479] // Northeast coordinates
        ],
        minZoom: 15.5,
        hash: true
      }));
      //prettier-ignore
      const heritagebbox = [-104.92337547, 39.59166919, -104.89571004, 39.60577479];
      //Geocoder
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        countries: "us",
        bbox: heritagebbox,
        collapsed: true,
        mapboxgl: mapboxgl
      });
      map.addControl(geocoder);
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      //Sat Button
      map.addControl(new BaseButton());

      // Add geolocate control to the map.
      let geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        fitBoundsOptions: {
          maxZoom: 16.7
        },
        trackUserLocation: true
      });
      map.addControl(geolocate);

      map.on("load", function() {}); //End Map Load

      // Create a popup, but don't add it to the map yet.
      let popup = new mapboxgl.Popup({
        closeOnClick: false
      });

      //Clear all highlights
      map.on("click", function() {
        map.removeFeatureState({
          source: "heritage_data",
          sourceLayer: "heritage_parcels"
        });
        map.removeFeatureState({
          source: "heritage_data",
          sourceLayer: "heritage_buildings"
        });
      });

      map.on("click", "heritage_parcels_fill", function(e) {
        map.removeFeatureState({
          source: "heritage_data",
          sourceLayer: "heritage_parcels"
        });
        map.setFeatureState(
          {
            source: "heritage_data",
            sourceLayer: "heritage_parcels",
            id: e.features[0].id
          },
          { highlight: true }
        );
      });

      //Remove old Centerprogram name highlight
      map.on("mouseover", "heritage_buildings", function(e) {
        map.removeFeatureState({
          source: "heritage_data",
          sourceLayer: "heritage_buildings"
        });
        //Set the highlight to the feature id which is the objectid in the database.(for now as along as its order by)
        map.setFeatureState(
          {
            source: "heritage_data",
            sourceLayer: "heritage_buildings",
            id: e.features[0].id
          },
          { highlight: true }
        );
      });
      map.on("mouseleave", "heritage_buildings", function() {
        map.removeFeatureState({
          source: "heritage_data",
          sourceLayer: "heritage_buildings"
        });
      });
      // Show Popup on Hover for Food Sites
      map.on("click", "heritage_buildings", function(e) {
        map.getCanvas().style.cursor = "pointer";
        let coordinates = e.lngLat;
        let description = `
           <h2 style="background-color:black; color:white;text-align:center; margin:0; padding:4px;"><b> ${e.features[0].properties.owner}</b></h2>
           <b>Year Built:</b> ${e.features[0].properties.year_build}`;
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });

      //Remove Popup when mouseleaves a Food Sites
      map.on("mouseleave", "heritage_buildings", function() {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    }, //End initMap;

    //Emit Function from LayerToggle component
    layertoggle: function(layers) {
      layers.forEach(layer => {
        let visibility = this.map.getLayoutProperty(layer, "visibility");
        this.map.setLayoutProperty(
          layer,
          "visibility",
          visibility === "none" ? "visible" : "none"
        );
      });
    }
  },
  computed: {},
  watch: {},
  mounted: function() {
    this.initMap();
  }
};
</script>

<style>
#map {
  min-height: 96vh;
}

.mapboxgl-popup {
  max-width: 600px !important;
}

.mapboxgl-popup-close-button {
  position: absolute;
  right: -10px;
  top: -10px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: #005073;
  width: 25px;
  height: 25px;
  z-index: 1;
  padding: 0px;
  color: white;
  text-align: center;
}
</style>
