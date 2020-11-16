<template>
  <v-card class="mx-auto style-overlay ml-1 px-2 mt-1" min-width="120">
    <v-card-title class="px-0 py-0 justify-center subtitle-2 font-weight-bold"
      >Layers</v-card-title
    >
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <div v-on="on">
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
        </div>
      </template>
      <span>Click to Toggle Layer</span>
    </v-tooltip>
  </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapFields(["building_button", "parcel_button"])
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
  padding: 0px 7px 0px 7px;
  top: 5px;
  left: 5px;
  width: 155px;
  background: rgba(255, 255, 255, 1);
  margin-right: 10px;
  border-radius: 5px;
}
</style>
