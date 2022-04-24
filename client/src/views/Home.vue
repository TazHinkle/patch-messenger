<template>
  <v-app id="inspire">
    <v-navigation-drawer
      app
      permanent
    >
      <br />
      <v-row justify="center">
        <v-dialog
          v-model="addNewConvo"
          scrollable
          max-width="300px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              color="indigo"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Enter a Phone Number</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px;">
              <v-text-field
                label="Start a new conversation"
                hint="Valid phone numbers must be prefaced with +1"
                persistent-hint
                required
                v-model="newContactNumber"
              ></v-text-field>
              <span v-if="error" class="error--text">{{ error }}</span>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                color="blue darken-1"
                text
                @click="addNewConvo = !addNewConvo"
              >
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="startConversation"
              >
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <br />
      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="conversation in conversations"
          :key="conversation.conversation_id"
          @click="selectConversation(conversation.conversation_id)"
          :id="'conversation-button-'+conversation.conversation_id"
          :disabled="selectedConversation === conversation.conversation_id"
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
      </v-list>
    </v-navigation-drawer>

    <v-main
      class="pb-0"
    >
      <v-container
        class="py-8 px-6"
        fluid
      >
        <v-row>
          <v-col
            v-for="message in messages"
            :key="message.message_id"
            cols="12"
          >
            <v-card
              :color="pickColor(message.is_incoming)"
            >
              <v-subheader>{{ convertTimestamp(message.timestamp) }}</v-subheader>
              <v-card-text>{{ message.message_body }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer
      app
      color="gray"
      height="72"
      inset
      class="pa-0"
    >
      <v-form
        @submit.prevent="sendMessage"
        class="d-flex flex-grow-1"
      >
        <v-container
          class="py-0"
        >
          <v-row>
            <v-col
              cols="12"
              class="py-0"
            >
              <v-text-field
                label="Send a new message"
                v-model="addMessage"
                @keyup.enter="sendMessage"
                append-outer-icon="mdi-send"
                @click:append-outer="sendMessage"
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <span v-if="error && !selectedConversation" class="error--text">{{ error }}</span>
          </v-row>
        </v-container>
      </v-form>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  data () {
    return {
      conversations: [],
      messages: [],
      selectedConversation: '',
      addNewConvo: false,
      newContactNumber: '+1',
      addMessage: '',
      response: '',
      error: '',
      timer: ''
    }
  },
  created () {
    this.loadConversations()
    this.timer = setInterval(this.loadConversations, 10000)
  },
  methods: {
    async loadConversations () {
      const response = await fetch(
        '/api/conversations'
      )
      this.conversations = await response.json()
      console.log(response)
    },
    async selectConversation (conversationId) {
      this.selectedConversation = conversationId
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      this.messages = await response.json()
      this.loadConversations()
    },
    validateNumber () {
      const reg = /^\+1[0-9]{10}$/g
      return reg.test(this.newContactNumber)
    },
    async startConversation () {
      this.error = ''
      if (this.validateNumber()) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact_number: this.newContactNumber
          })
        }
        const response = await fetch(
          '/api/conversations',
          requestOptions
        )
        this.response = await response.json()
        console.log(this.response)
        this.selectedConversation = this.response.conversation_id
        console.log(this.selectedConversation)
        this.conversations.push(this.response)
        this.newContactNumber = '+1'
        this.messages = []
        this.addNewConvo = false
      } else {
        this.error = 'Must be a valid phone number prefaced by a +'
      }
    },
    convertTimestamp (timestamp) {
      const day = new Date(timestamp)
      return '' + day.toLocaleDateString('en-US') + ' ' + day.toTimeString()
    },
    async sendMessage () {
      console.log(this.addMessage)
      this.error = ''
      if (this.selectedConversation && this.addMessage) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: this.addMessage
          })
        }
        const response = await fetch(
          `/api/conversations/${this.selectedConversation}/send`,
          requestOptions
        )
        const result = await response.json()
        console.log(result)
        this.messages.push(result)
        this.addMessage = ''
      } else {
        this.error = 'You must select a conversation and type a message'
      }
    },
    pickColor (incoming) {
      return incoming ? 'blue' : 'gray'
    }
  }
}
</script>
