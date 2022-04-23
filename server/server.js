require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioPhone = process.env.TWILIO_PHONE_OUT
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const db = require('./db.js');

router.get('/api/conversations', async (ctx) => {
    ctx.body = await db.getAllConversations()
})

router.get('/api/conversations/:conversation_id', async (ctx) => {
    ctx.body = await db.getConversationById(ctx.params.conversation_id)
})

router.get('/api/conversations/:conversation_id/messages', async (ctx) => {
    ctx.body = await db.getMessagesByConversationId(ctx.params.conversation_id)
})

router.post('/api/conversations', async (ctx) => {
    let conversation = ctx.request.body
    conversation = await db.startConversation(conversation.contact_number)
    ctx.response.status = 200
    ctx.body = conversation
})

router.post('/api/conversations/:conversation_id/send', async (ctx) => {
    const message = ctx.request.body.message
    const conversationId = ctx.params.conversation_id
    const conversation = await db.getConversationById(conversationId)
    const recipientNumber = conversation.contact_number
    if(message) {
        console.log('recipientNumber', recipientNumber);
        await client.messages
            .create({
                body: message,
                from: twilioPhone,
                to: recipientNumber
            })
            .then(async (twilioResponse) => {
                console.log(twilioResponse.sid)
                const message = twilioResponse.body
                const timestamp = new Date(twilioResponse.dateUpdated).getTime()
                const result = await db.createMessageInConversation(
                    message,
                    timestamp,
                    conversationId,
                    false
                )

                ctx.response.status = 200
                ctx.body = result
            })
            .catch((error) => {
                ctx.response.status = 500
                ctx.body = error
            });
    }else {
        ctx.response.status = 400
        ctx.body({
            status: 'error',
            error: 'message is required'
        });
    }
})

app.use(require('koa-body')())
app.use(router.allowedMethods())
app.use(router.routes())

app.listen(3000, () => {
    console.log('server started on port 3000')
})
