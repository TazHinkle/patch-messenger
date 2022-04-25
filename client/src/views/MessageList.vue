<template>
  <v-container
      class="py-8 px-6"
      fluid
  >
    <message-card
        v-for="message in messages"
        :key="message.message_id"
        :message="message"
    />
  </v-container>
</template>
<script>
import MessageCard from '@/components/MessageCard'

export default {
  name: 'message-list',
  components: { MessageCard },
  props: {
    messages: {
      type: Array,
      required: true
    }
  }
}
</script>
