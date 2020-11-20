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
        <v-btn color="indigo" dark small v-bind="attrs" class="" v-on="on">
          <v-icon dark>
            mdi-map-marker-plus
          </v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-form ref="form">
          <v-card-title
            >{{ clickPointID ? "Update" : "Add" }} {{ category }} Point
            <v-spacer></v-spacer>
            <v-btn
              small
              @click="usermarker = 'gps'"
              class="ma-2"
              color="primary"
              dark
            >
              Use GPS
            </v-btn>
            <v-btn small @click="usermarker = true" color="primary" dark>
              Drag Marker
            </v-btn>
          </v-card-title>
          <v-card-text class="pb-2">
            <v-text-field v-model="location" label="General Location" outlined>
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
          <v-card-actions class="justify-space-between">
            <v-btn text @click="resetForm()">
              Cancel
            </v-btn>
            <div v-if="clickPointID">
              <v-icon small @click="deletePoint()">
                mdi-delete
              </v-icon>
            </div>
            <v-btn
              :color="clickPointID ? 'success' : 'primary'"
              text
              @click="handlePointData()"
            >
              {{ clickPointID ? "Update" : "Insert" }}
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
      "clickPointID",
      "usermarker",
      "editedItem.location",
      "editedItem.category",
      "editedItem.note",
      "editedItem.geom"
    ])
  },
  methods: {
    resetForm() {
      this.$refs.form.reset();
      this.menu = false;
      this.usermarker = false;
      this.clickPointID = null;
    },
    handlePointData: function() {
      let data = {
        location: this.location,
        category: this.category,
        note: this.note,
        geom: this.geom
      };
      //If the clickPointID has a value then Updating point if not then Inserting
      this.$store.dispatch(
        !this.clickPointID ? "insertPoint" : "updatePoint",
        data
      );
      this.resetForm();
    },
    deletePoint: function() {
      if (confirm("are you sure?")) this.$store.dispatch("deletePoint");
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
