CREATE TABLE IF NOT EXISTS conversations
(
    conversation_id          integer
        constraint conversations_pk
            primary key autoincrement,
    contact_number           text not null,
    unread_message_count     integer,
    created_at               integer,
    last_incoming_message_at integer
);

CREATE TABLE IF NOT EXISTS messages
(
    message_id      integer
        constraint messages_pk
            primary key autoincrement,
    conversation_id integer not null,
    is_incoming     integer,
    timestamp       integer,
    message_body    text
);
