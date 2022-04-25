<template>
  <v-row>
    <v-col
      cols="3"
      v-if="!message.is_incoming"
    ></v-col>
    <v-col
      cols="9"
    >
      <v-card
        :color="pickColor"
        :id="'message' + message.message_id"
      >
        <v-subheader>{{ convertTimestamp }}</v-subheader>
        <v-card-text>{{ message.message_body }}</v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="3"
      v-if="message.is_incoming"
    ></v-col>
  </v-row>
</template>
<script>
export default {
  name: 'MessageCard',
  props: {
    message: {
      required: true,
      type: Object
    }
  },
  computed: {
    convertTimestamp () {
      const day = new Date(this.message.timestamp)
      return '' + day.toLocaleDateString('en-US') + ' ' + day.toTimeString()
    },
    pickColor () {
      return this.message.is_incoming ? 'blue' : 'gray'
    }
  }
}
</script>
