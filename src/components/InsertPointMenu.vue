<template>
  <div class="text-center style-overlay">
    <v-menu
      v-model="menu"
      :nudge-width="500"
      offset-x
      :close-on-content-click="false"
      :close-on-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="indigo" dark v-bind="attrs" v-on="on">
          Add Point
        </v-btn>
      </template>

      <v-card>
        <v-form ref="form">
          <v-card-title
            >Add {{ category }} Point <v-spacer></v-spacer>
            <div v-if="id">ID:{{ id }}</div>
          </v-card-title>
          <v-card-text class="pb-2">
            <v-text-field
              v-model="location"
              prepend-icon="mdi-map"
              label="General Location"
              outlined
            >
            </v-text-field>
            <v-select
              v-model="category"
              :items="['Maintenance', 'Violation', 'General']"
              menu-props="auto"
              label="Category"
              required
              outlined
            ></v-select>
            <v-textarea
              v-model="note"
              name="input-7-1"
              outlined
              label="Note"
              rows="1"
              row-height="15"
              auto-grow
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="resetForm()">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="insertPoint">
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import { mapFields } from "vuex-map-fields";

export default {
  data: () => ({}),
  computed: {
    ...mapFields([
      "menu",
      "editedItem.id",
      "editedItem.location",
      "editedItem.category",
      "editedItem.note",
      "editedItem.geom"
    ])
  },
  methods: {
    resetForm() {
      this.$refs.form.reset();
      this.id = null;
      this.menu = false;
    },
    insertPoint: function() {
      let data = {
        id: this.id,
        location: this.location,
        category: this.category,
        note: this.note,
        geom: this.geom
      };
      console.log(this.id);
      this.$store.dispatch("insertPoint", data);
      this.resetForm();
    }
  }
};
</script>
<style scoped>
.style-overlay {
  z-index: 1;
  position: absolute;
  bottom: 20px;
  right: 5px;
}
</style>
