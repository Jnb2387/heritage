<template>
  <v-app>
    <v-main>
      <MapComponent />
    </v-main>
  </v-app>
</template>

<script>
import MapComponent from "./components/MapComponent";

export default {
  name: "App",

  components: {
    MapComponent
  },

  data: () => ({
    //
  })
};
</script>
