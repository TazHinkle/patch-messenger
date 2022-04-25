<template>
  <v-list>
    <conversation-list-item
      v-for="conversation in conversations"
      :key="conversation.conversation_id"
      :conversation="conversation"
      :selected="selectedConversation === '' + conversation.conversation_id"
      @select-conversation="$emit('select-conversation', $event)"
    />
  </v-list>
</template>
<script>
import ConversationListItem from '@/components/ConversationListItem'

export default {
  name: 'ConversationItem',
  components: { ConversationListItem },
  props: {
    conversations: {
      type: Array,
      required: true
    },
    selectedConversation: {
      type: String,
      required: true
    }
  }
}
</script>
