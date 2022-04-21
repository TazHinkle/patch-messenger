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

module.exports = {getAllConversations}