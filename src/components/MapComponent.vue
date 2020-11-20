<template>
  <v-card>
    <div id="map"></div>
    <!-- <Legend /> -->
    <LayerToggle @toggle-layer="layertoggle" />
    <InsertPointMenu />
  </v-card>
</template>
<script>
import { mapFields } from "vuex-map-fields";
import mapboxgl from "mapbox-gl";
import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
const MapboxGeocoder = require("@mapbox/mapbox-gl-geocoder");

import RegularStyle from "../../data/heritage_style.json";

import BaseButton from "../js/mapControlBaseButton";

// import Legend from "./Legend";
import LayerToggle from "./LayerToggle";
import InsertPointMenu from "./InsertPointMenu";

export default {
  name: "MapComponent",
  components: {
    // Legend,
    LayerToggle,
    InsertPointMenu
  },
  data() {
    return {
      map: {},
      marker: new mapboxgl.Marker({
        draggable: true
      })
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
        zoom: 15.5,
        maxBounds: [
          [-104.9337547, 39.58166919], // Southwest coordinates,
          [-104.89171004, 39.61577479] // Northeast coordinates
        ],
        minZoom: 15,
        hash: process.env.NODE_ENV !== "production" ? true : false
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
      map.on("styledata", () => {
        this.map.getSource("points").setData(this.points);
      });
      // Create a popup, but don't add it to the map yet.
      let popup = new mapboxgl.Popup({
        closeOnClick: false
      });

      //custom function to remove the state from an number of layers
      const removeFeatureState = function(...layers) {
        map.removeFeatureState({
          source: "points"
        });
        layers.forEach(layer => {
          map.removeFeatureState({
            source: "heritage_data",
            sourceLayer: layer
          });
        });
      };

      //Show that these layers are clickable by adding a pointer
      ["heritage_parcels_fill", "heritage_buildings"].forEach(layer => {
        map.on("mouseover", layer, function() {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layer, function() {
          map.getCanvas().style.cursor = "";
        });
      });

      //Clear all highlights when the map is clicked anywhere (will be superceded by a click on a named layer)
      map.on("click", function() {
        removeFeatureState("heritage_buildings", "heritage_parcels");
      });

      //
      map.on("click", "heritage_parcels_fill", function(e) {
        removeFeatureState("heritage_buildings", "heritage_parcels");
        map.setFeatureState(
          {
            source: "heritage_data",
            sourceLayer: "heritage_parcels",
            id: e.features[0].id
          },
          { highlight: true }
        );
        let coordinates = e.lngLat;
        let description = `
           <h2 style="background-color:black; color:white;text-align:center; margin:0; padding:4px;"><b> ${e.features[0].properties.owner}</b></h2>
           <p>${e.features[0].properties.address}</p>
           ${e.features[0].properties.link}
           `;
        // prettier-ignore
        // let description2 =
        // "<h3>"+properties.School+"</h3>"+
        // "<p>"+properties['Address']+". <a target='_blank' href='https://www.google.com/maps/dir/?api=1&destination="+properties['Address']+".,Denver,CO'> Directions</a></p>"+
        // "<p><b>Grades Served: </b>" + properties['Grades Served'] + "</p>"+
        // "<p><b>Programs Offered: </b>" + properties['Programs Offered'] + "</p>"+

        // "<p><b>Phone: </b>" + properties['Phone'] + "</p>"
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });

      map.on("click", "heritage_buildings-3d", e => {
        removeFeatureState("heritage_buildings", "heritage_parcels");
        map.setFeatureState(
          {
            source: "heritage_data",
            sourceLayer: "heritage_buildings",
            id: e.features[0].id
          },
          { highlight: true }
        );
        let coordinates = e.lngLat;
        // map.jumpTo({
        //   center: coordinates,
        //   zoom: 17.5
        // });
        let description = `
           <h2 style="background-color:black; color:white;text-align:center; margin:0; padding:4px;"><b> ${e.features[0].properties.owner}</b></h2>
           <b>Year Built:</b> ${e.features[0].properties.year_build}`;
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });

      ["points"].forEach(layer => {
        map.on("click", layer, e => {
          const pointdata = e.features[0];
          removeFeatureState("heritage_buildings", "heritage_parcels");
          map.setFeatureState(
            {
              source: "points",
              id: pointdata.id
            },
            { highlight: true }
          );
          let coordinates = e.lngLat;
          const divElement = document.createElement("div");
          const innerHtmlContent = `
            <div style="">
              <h4 class="">${pointdata.properties.location} </h4>
              <p>Category:  ${pointdata.properties.category}</p>
            </div>`;
          divElement.innerHTML = innerHtmlContent;

          const assignBtn = document.createElement("div");
          assignBtn.innerHTML = `<button class="btn">Edit</button>`;
          assignBtn.addEventListener("click", () => {
            this.clickPointID = pointdata.properties.id;
            this.location = pointdata.properties.location;
            this.category = pointdata.properties.category;
            (this.note = pointdata.properties.note),
              (this.geom = pointdata.geometry.coordinates.toString());
            this.menu = true;
          });
          divElement.appendChild(assignBtn);
          popup
            .setLngLat(coordinates)
            .setDOMContent(divElement)
            .addTo(map);
        });
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
  computed: {
    ...mapFields([
      "points",
      "menu",
      "clickPointID",
      "usermarker",
      "editedItem.location",
      "editedItem.category",
      "editedItem.note",
      "editedItem.geom"
    ])
  },
  watch: {
    points(newValue) {
      this.map.getSource("points").setData(newValue);
    },
    usermarker(newValue) {
      //Add New Point

      console.log(newValue);
      if (!newValue) {
        this.marker.remove();
        return;
      }
      this.marker.setLngLat([-104.90903, 39.59884]).addTo(this.map);

      let onDragEnd = () => {
        let lngLat = this.marker.getLngLat();
        this.geom = lngLat.lng.toString() + "," + lngLat.lat.toString();
      };

      this.marker.on("dragend", onDragEnd);
    }
  },
  mounted: function() {
    this.initMap();
    this.$store.dispatch("getPoints");
  }
};
</script>

<style>
#map {
  min-height: 90vh;
}

.mapboxgl-popup {
  -webkit-font-smoothing: antialiased;
  max-width: 75% !important;
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  color: #5a5a59;
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

.mapboxgl-popup-close-button:hover {
  color: black;
}

.btn {
  display: inline-block;
  text-align: center;
  text-decoration: none;
  margin: 2px 0;
  border: solid 1px transparent;
  border-radius: 4px;
  padding: 0.1em 0.2em;
  color: #ffffff;
  background-color: #9555af;
}
/* inverse colors on mouse-over */
.btn:hover {
  color: #9555af;
  border-color: currentColor;
  background-color: white;
}
</style>
