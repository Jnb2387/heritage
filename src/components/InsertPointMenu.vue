<template>
  <div class="text-center style-overlay">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="500"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="indigo" dark v-bind="attrs" v-on="on">
          Add Point
        </v-btn>
      </template>

      <v-card ref="form">
        <v-card-title>Add {{ editedItem.category }} Point</v-card-title>
        <v-card-text class="pb-2">
          <v-text-field
            v-model="editedItem.location"
            prepend-icon="mdi-map"
            label="General Location"
            outlined
          >
          </v-text-field>
          <v-select
            v-model="editedItem.category"
            :items="['Maintenance', 'Violation', 'General']"
            menu-props="auto"
            label="Category"
            required
            outlined
          ></v-select>
          <v-textarea
            v-model="editedItem.note"
            name="input-7-1"
            outlined
            label="Note"
            rows="1"
            row-height="15"
            auto-grow
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="menu = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-slide-x-reverse-transition>
            <v-tooltip v-if="formHasErrors" left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="my-0"
                  v-bind="attrs"
                  @click="resetForm"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh form</span>
            </v-tooltip>
          </v-slide-x-reverse-transition>
          <v-btn color="primary" text @click="insertPoint">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import { mapFields } from "vuex-map-fields";

export default {
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    editedIndex: -1,
    formHasErrors: false,

    editedItem: {
      location: null,
      category: null,
      note: "",
      geom: null
    },
    defaultItem: {
      location: null,
      category: null,
      note: "",
      geom: null
    }
  }),
  computed: { ...mapFields(["markercoords"]) },
  methods: {
    resetForm() {
      this.errorMessages = [];
      this.formHasErrors = false;

      Object.keys(this.form).forEach(f => {
        this.$refs[f].reset();
      });
    },
    insertPoint: function() {
      let data = {
        fulladdress: this.editedItem.location,
        category: this.editedItem.category,
        note: this.editedItem.note,
        geom: this.markercoords
      };
      this.$store.dispatch("insertPoint", data);
      this.menu = false;
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
