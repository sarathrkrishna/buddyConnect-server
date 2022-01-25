export const createChatQuery = `
    WITH
	select_creator_chat AS (
		SELECT DISTINCT cm.chat_id FROM chat_master cm 
		INNER JOIN chat_data cd ON cm.chat_id = cd.id 
		WHERE NOT cd.is_group AND cm.client_id= $1
	),
	chat_exists AS (
		SELECT 1 AS exists FROM select_creator_chat sdc 
		INNER JOIN chat_master cm ON sdc.chat_id=cm.chat_id 
		WHERE cm.client_id = $2
	),
	create_chat AS (
		INSERT INTO chat_data (
			creator_id, last_updated
		) SELECT $1 AS creator_id, NOW() AS last_updated WHERE NOT EXISTS (SELECT * FROM chat_exists) RETURNING creator_id AS client_id, id AS chat_id
	),
	chat_clients AS (
		SELECT * FROM create_chat
		UNION
		SELECT id AS client_id, (SELECT chat_id FROM create_chat) FROM client_master 
		WHERE id = $2
	),
	insert_to_chat_master AS (
		INSERT INTO chat_master (
		client_id,
		chat_id
		)  
		SELECT * FROM chat_clients WHERE NOT EXISTS (SELECT * FROM chat_exists) RETURNING chat_id
	)
	SELECT DISTINCT chat_id FROM insert_to_chat_master
`;

export const searchChatQuery = `
	WITH
	chats_of_user AS (
		SELECT chat_id FROM chat_master WHERE client_id=$2 AND NOT is_deleted
	),
	user_chat_data_by_chat_id AS (
		SELECT cm.chat_id, cm.client_id, username, full_name, display_picture_url, last_updated FROM chat_data cd 
		INNER JOIN chat_master cm ON cd.id=cm.chat_id
		INNER JOIN client_master clm ON cm.client_id=clm.id
		WHERE cd.id IN (SELECT chat_id FROM chats_of_user) AND NOT cd.is_group AND cm.client_id <> $2
 		AND (clm.username ILIKE $1 OR clm.full_name ILIKE $1)
	),
	total_count AS (
		SELECT COUNT (*) AS total_results_count FROM user_chat_data_by_chat_id
	)
	SELECT *, (SELECT * FROM total_count) FROM user_chat_data_by_chat_id ORDER BY last_updated DESC LIMIT $3 OFFSET $4
`;

export const getAllChatsQuery = `
	WITH
	chats_of_user AS (
		SELECT chat_id FROM chat_master WHERE client_id=$1 AND NOT is_deleted
	),
	user_chat_data_by_chat_id AS (
		SELECT cm.chat_id, cm.client_id, username, full_name, display_picture_url, last_updated FROM chat_data cd 
		INNER JOIN chat_master cm ON cd.id=cm.chat_id
		INNER JOIN client_master clm ON cm.client_id=clm.id
		WHERE cd.id IN (SELECT chat_id FROM chats_of_user) AND NOT cd.is_group AND cm.client_id <> $1
	),
	total_count AS (
		SELECT COUNT (*) AS total_results_count FROM user_chat_data_by_chat_id
	)
	SELECT *, (SELECT * FROM total_count) FROM user_chat_data_by_chat_id ORDER BY last_updated DESC LIMIT $2 OFFSET $3
`;
