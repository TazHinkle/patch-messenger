require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE_OUT
const simplePassword = process.env.SIMPLE_PASSWORD
const twilioClient = require('twilio')(accountSid, authToken)
const Koa = require('koa')
const app = new Koa()
const KoaRouter = require('koa-router')
const koaBody = require('koa-body')
const koaServe = require('koa-static')
const koaSession = require('koa-session')
const router = new KoaRouter()
const db = require('./db.js')

// session cookies require a unique secret key
app.keys = [simplePassword]

router.post('/api/twilio_incoming_message_webhook', async(ctx) => {
    console.log('incoming webhook request', ctx.request.body)
    const message = ctx.request.body.Body
    const timestamp = Date.now()
    const conversation = await db.getConversationByContactNumber(ctx.request.body.From)
    const conversationId = conversation.conversation_id
    const result = await db.createMessageInConversation(
        message,
        timestamp,
        conversationId,
        true
    )
    ctx.response.status = 200
    ctx.body = result
})

router.post('/api/auth', async (ctx) => {
    const inputPassword = ctx.request.body.password
    if(inputPassword === simplePassword) {
        ctx.session.authorized = true
        ctx.response.status = 200
        ctx.body = { success: true }
    } else {
        ctx.response.status = 403
        ctx.body = { success: false }
    }
})

router.get('/api/auth', async (ctx) => {
    if(ctx.session.authorized) {
        ctx.response.status = 200
        ctx.body = { success: true }
    } else {
        ctx.response.status = 403
        ctx.body = { success: false }
    }
})

const authBouncer = async (ctx, next) => {
    if(!ctx.session.authorized) {
        ctx.response.status = 403
        ctx.body = { error: 'Not Authorized' }
    } else {
        await next()
    }
}

router.use('/api/', authBouncer)

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
        console.log('recipientNumber', recipientNumber)
        try {
            const twilioResponse = await twilioClient.messages.create({
                body: message,
                from: twilioPhone,
                to: recipientNumber
            })
            console.log(twilioResponse.sid)
            const responseMessage = twilioResponse.body
            const timestamp = new Date(twilioResponse.dateUpdated).getTime()
            const result = await db.createMessageInConversation(
                responseMessage,
                timestamp,
                conversationId,
                false
            )
            ctx.response.status = 200
            ctx.body = result
        } catch (error) {
            ctx.response.status = 400
            ctx.body = error
        }
    } else {
        ctx.response.status = 400
        ctx.body = {
            status: 'error',
            error: 'message is required'
        }
    }
})

app.use(koaSession(app))
app.use(koaBody())
app.use(router.allowedMethods())
app.use(router.routes())
app.use(koaServe('../client/dist'))

app.listen(3000, () => {
    console.log('server started on port 3000')
})
