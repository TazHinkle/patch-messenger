<template>
  <v-dialog
    :value="value"
    scrollable
    persistent
    max-width="300px"
  >
    <v-form
      @submit.prevent="$emit('submit', password)"
    >
      <v-card>
        <v-card-title>Enter your password</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-text-field
            label="Password"
            required
            type="password"
            v-model="password"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            type="submit"
          >
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      password: ''
    }
  }
}
</script>
