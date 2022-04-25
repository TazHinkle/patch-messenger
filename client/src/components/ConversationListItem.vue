<template>
  <v-list-item
      @click="$emit('select-conversation', conversation.conversation_id)"
      :id="'conversation-button-'+conversation.conversation_id"
      :disabled="selected"
      link
  >
    <v-list-item-content>
      <v-list-item-title>
        {{ conversation.contact_number }}
        <v-badge
          v-if="conversation.unread_message_count > 0"
          color="green"
          class="pa-1"
        >
        </v-badge>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
export default {
  name: 'ConversationListItem',
  props: {
    conversation: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    }
  }
}
</script>
