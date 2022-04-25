<template>
  <v-app id="inspire">
    <auth-dialog
      :value="!authenticated"
      @submit="login"
    />
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
          <v-form
            @submit.prevent="startConversation"
          >
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
                  type="submit"
                >
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-row>
      <br />
      <v-divider></v-divider>
      <conversation-list
        :conversations="conversations"
        :selectedConversation="selectedConversation"
        @select-conversation="selectConversation"
      />
    </v-navigation-drawer>

    <v-main
      class="pa-0"
    >
      <message-list
        :messages="messages"
      />
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
import AuthDialog from '@/components/AuthDialog'
import ConversationList from '@/components/ConversationList'
import MessageList from '@/views/MessageList'

export default {
  components: {
    MessageList,
    ConversationList,
    AuthDialog
  },
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
      conversationTimer: '',
      messageTimer: '',
      lastMessage: '',
      authenticated: false
    }
  },
  created () {
    this.checkAuth()
  },
  methods: {
    login (password) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password
        })
      }
      this.checkAuth(requestOptions)
    },
    async checkAuth (requestOptions) {
      const response = await fetch(
        '/api/auth',
        requestOptions
      )
      const result = await response.json()
      if (result.success) {
        this.authenticated = true
        this.startTimers()
      }
    },
    startTimers () {
      this.loadConversations()
      this.messageTimer = setInterval(this.getMessages, 10000)
      this.conversationTimer = setInterval(this.loadConversations, 10000)
    },
    async loadConversations () {
      const response = await fetch(
        '/api/conversations'
      )
      this.conversations = await response.json()
    },
    async getMessages () {
      if (this.selectedConversation !== '') {
        const response = await fetch(`/api/conversations/${this.selectedConversation}/messages`)
        this.messages = await response.json() || []
        if (this.messages.length > 0) {
          this.lastMessage = 'message' + this.messages[this.messages.length - 1].message_id
        }
      }
    },
    async selectConversation (conversationId) {
      this.selectedConversation = conversationId
      await this.getMessages()
      await this.loadConversations()
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
        this.selectedConversation = this.response.conversation_id
        this.conversations.push(this.response)
        this.newContactNumber = '+1'
        this.messages = []
        this.addNewConvo = false
      } else {
        this.error = 'Must be a valid phone number prefaced by a +'
      }
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
    goToSection () {
      if (this.lastMessage) {
        this.$nextTick().then(() => {
          const scrollToElement = document.getElementById(this.lastMessage)
          if (scrollToElement) {
            this.$vuetify.goTo(scrollToElement, {
              duration: 300,
              offset: 0,
              easing: 'easeInOutCubic'
            })
          }
        })
      }
    }
  },
  watch: {
    messages: 'goToSection'
  }
}
</script>
