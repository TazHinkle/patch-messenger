<template>
  <v-container>
    <p
      v-for="conversation in conversations"
      :key="conversation.conversation_id"
    >{{conversation.contact_number}}</p>
    <p>Words</p>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      conversations: [],
      messages: []
    }
  },
  created () {
    this.loadConversations()
  },
  methods: {
    async loadConversations () {
      const response = await fetch(
        '/api/conversations'
      )
      this.conversations = await response.json()
      console.log(response)
    }
  }
}
</script>
