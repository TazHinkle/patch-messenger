const sqlite3 = require('@vscode/sqlite3')
const sqlite = require('sqlite')
const fs = require('fs')
const dataDirPath = '../.data'
const dataDirExists = fs.existsSync(dataDirPath)
const dbFilePath = '../.data/db.sqlite'
const seedFilePath = './dbseed.sql'

if(!dataDirExists) {
    fs.mkdirSync(dataDirPath)
}

const openDb = sqlite.open({
    filename: dbFilePath,
    driver: sqlite3.Database
}).then( async (db) => {
    const dbSeedScript = fs.readFileSync(seedFilePath, 'utf-8')
    console.log('Running db seed script to ensure tables exist', dbSeedScript)
    await db.exec(dbSeedScript)
    return db
})

const getAllConversations = async () => {
    const db = await openDb
    let statement = await db.prepare('SELECT * FROM conversations')
    return statement.all()
}

const getConversationById = async (conversation_id) => {
    const db = await openDb
    let statement = await db.prepare('SELECT * FROM conversations WHERE conversation_id = @conversation_id'
    )
    statement.bind({
        '@conversation_id': conversation_id,
    })
    return statement.get()
}

const getConversationByContactNumber = async (contact_number) => {
    const db = await openDb
    let statement = await db.prepare('SELECT * FROM conversations WHERE contact_number = @contact_number'
    )
    statement.bind({
        '@contact_number': contact_number,
    })
    return statement.get()
}

const getMessagesByConversationId = async (conversation_id) => {
    const db = await openDb
    let statement = await db.prepare('SELECT * FROM messages WHERE conversation_id = @conversation_id'
    )
    await statement.bind({
        '@conversation_id': conversation_id,
    })
    await db.run(
        'UPDATE CONVERSATIONS SET unread_message_count = 0 WHERE conversation_id = ?',
        conversation_id
    )
    return statement.all()
}

const startConversation = async (contact_number) => {
    const db = await openDb
    const result = await db.run(
        'INSERT INTO CONVERSATIONS (contact_number, unread_message_count, created_at) VALUES(?, 0, ?)',
        contact_number,
        Date.now()
    )
    const row = await db.prepare('SELECT * FROM CONVERSATIONS WHERE conversation_id = @id')
    await row.bind({'@id': result.lastID})
    return row.get()
}

const updateConversation = async (conversation_id) => {
    const db = await openDb
    let timestamp = Date.now()
    await db.run(
        'UPDATE CONVERSATIONS SET last_incoming_message_at = ?, unread_message_count = unread_message_count + 1 WHERE conversation_id = ?',
        timestamp,
        conversation_id
    )
}

const createMessageInConversation = async (message_body, timestamp, conversation_id, is_incoming) => {
    const db = await openDb
    const messageInsert = await db.run(
        'INSERT INTO MESSAGES (conversation_id, message_body, is_incoming, timestamp) ' +
        'VALUES(?, ?, ?, ?)',
        conversation_id,
        message_body,
        is_incoming,
        timestamp
    )
    const row = await db.prepare('SELECT * FROM MESSAGES WHERE message_id = @id')
    await row.bind({'@id': messageInsert.lastID})
    if (is_incoming) {
        await updateConversation(conversation_id, timestamp)
    }
    return row.get()
}

module.exports = {
    getAllConversations,
    getMessagesByConversationId,
    startConversation,
    getConversationById,
    createMessageInConversation,
    getConversationByContactNumber
}
