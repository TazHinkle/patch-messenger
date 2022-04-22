const sqlite3 = require('@vscode/sqlite3')
const sqlite = require('sqlite')

const openDb = sqlite.open(
    {
        filename: '../.data/db.sqlite',
        driver: sqlite3.Database
    }
)

const getAllConversations = async () => {
    const db = await openDb
    let statement = await db.prepare('SELECT * FROM conversations')
    return statement.all()
}

const findConversationById = async (conversation_id) => {}

const findConversationByContactNumber = async (contact_number) => {}

const getMessagesByConversationId = async (conversation_id) => {
    const db = await openDb
    let statement = await db.prepare('SELECT * FROM messages WHERE conversation_id = @conversation_id'
    )
    statement.bind({
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

const updateConversation = async (conversation_id, is_incoming) => {
    if(is_incoming) {

    }else {

    }
}

module.exports = { getAllConversations, getMessagesByConversationId, startConversation }