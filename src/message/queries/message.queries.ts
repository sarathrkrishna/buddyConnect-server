export const createMessageQuery = `
    WITH
	user_chat_exists AS (
		SELECT * FROM chat_master 
		WHERE chat_id=$2 AND client_id=$1 AND NOT is_deleted
	),
 	create_message AS (
 		INSERT INTO message_data (message_body, sender_id, chat_id)
 		SELECT $3, (SELECT client_id FROM user_chat_exists), (SELECT chat_id FROM user_chat_exists) WHERE EXISTS (SELECT * FROM user_chat_exists)
		RETURNING *
 	),
	update_chat_last_updated AS (
		UPDATE chat_data SET last_updated=NOW() WHERE id=(SELECT chat_id FROM create_message) RETURNING *
	)
    SELECT (SELECT id FROM create_message) AS message_id, (SELECT chat_id FROM create_message), (SELECT message_body FROM create_message), (SELECT sender_id FROM create_message), (SELECT create_at FROM create_message) 
    FROM update_chat_last_updated
`;

export const getAllMessagesFromChatQuery = `
    WITH
	select_user_chat_messages AS (
		SELECT md.id AS message_id, md.message_body, md.sender_id, md.create_at, cm.chat_id FROM chat_master cm
		INNER JOIN message_data md ON cm.chat_id=md.chat_id
		WHERE cm.chat_id=$2 AND cm.client_id=$1 AND NOT is_deleted
		ORDER BY md.create_at DESC
-- 		last sent message should be the first result
	),
	total_message_count AS (
		SELECT COUNT(*) AS total_count FROM select_user_chat_messages
	)
    SELECT (SELECT total_count FROM total_message_count), * FROM select_user_chat_messages LIMIT $3 OFFSET $4
`;

export const searchMessagesFromChatQuery = `
    WITH
	select_user_chat_messages AS (
		SELECT md.id AS message_id, md.message_body, md.sender_id, md.create_at, cm.chat_id FROM chat_master cm
		INNER JOIN message_data md ON cm.chat_id=md.chat_id
		WHERE cm.chat_id=$2 AND cm.client_id=$1 AND NOT is_deleted
		AND md.message_body ILIKE $3
		ORDER BY md.create_at DESC
-- 		last sent message should be the first result
-- 		disable ordering for most accurate result per search
	),
	total_message_count AS (
		SELECT COUNT(*) AS total_count FROM select_user_chat_messages
	)
    SELECT (SELECT total_count FROM total_message_count), * FROM select_user_chat_messages LIMIT $4 OFFSET $5
`;
