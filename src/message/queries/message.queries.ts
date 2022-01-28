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
