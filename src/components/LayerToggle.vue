<template>
  <div class="text-center style-overlay">
    <v-menu
      v-model="layermenu"
      :nudge-width="100"
      offset-x
      class=""
      content-class="layermenuclass"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab x-small v-bind="attrs" v-on="on">
          <v-icon>
            mdi-layers
          </v-icon>
        </v-btn>
      </template>
      <v-card class="px-1 pb-1">
        <v-card-title class="px-0 py-0 justify-center caption font-weight-bold"
          >Layers</v-card-title
        >
        <div>
          <v-btn
            x-small
            block
            class="mb-1"
            :color="building_button ? 'success' : ''"
            @click="
              toggleBaseLayers([
                'heritage_buildings-3d',
                'heritage_address_num'
              ]);
              building_button = !building_button;
            "
            >Buildings</v-btn
          >
          <v-btn
            x-small
            block
            class="mb-1"
            :color="parcel_button ? 'success' : ''"
            @click="
              toggleBaseLayers([
                'heritage_parcels_fill',
                'heritage_parcels_line'
              ]);
              parcel_button = !parcel_button;
            "
            >Parcels</v-btn
          >
          <v-btn
            x-small
            block
            class=""
            :color="point_button ? 'success' : ''"
            @click="
              toggleBaseLayers(['points', 'points_label']);
              point_button = !point_button;
            "
            >Points</v-btn
          >
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  data() {
    return {
      layermenu: false
    };
  },
  computed: {
    ...mapFields(["building_button", "parcel_button", "point_button"])
  },
  methods: {
    toggleBaseLayers: function(layer) {
      //When the layer button is clicked, emit the layer array names to the map component.
      this.$emit("toggle-layer", layer);
    }
  }
};
</script>

<style scoped>
.style-overlay {
  z-index: 1;
  position: absolute;
  top: 5px;
  left: 5px;
}
</style>
