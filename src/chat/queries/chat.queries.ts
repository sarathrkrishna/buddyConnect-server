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
	user_ids_from_search AS (
		SELECT id, username, full_name, display_picture_url FROM client_master 
		WHERE (username ILIKE $1 OR full_name ILIKE $1) 
		AND NOT is_disabled AND id <> $2
-- 		if the user is searching his name, no result should appear
	),
	chats_by_client_ids AS (
		SELECT uifs.username, uifs.full_name, cm.client_id, cm.chat_id, display_picture_url FROM user_ids_from_search uifs 
		INNER JOIN chat_master cm ON uifs.id = cm.client_id
	),
  	this_client_included_chats AS (
 		SELECT username, full_name, cbci.client_id, cbci.chat_id, display_picture_url FROM chats_by_client_ids cbci INNER JOIN chat_master cm ON cbci.chat_id=cm.chat_id 
		WHERE cm.client_id = $2
 	),
	chat_infos AS (
		SELECT client_id, chat_id, username, full_name, display_picture_url, last_updated FROM this_client_included_chats tcic 
		INNER JOIN chat_data cd ON tcic.chat_id=cd.id WHERE NOT is_group
	),
	total_results_count AS (
		SELECT COUNT(*) AS total_results_count FROM chat_infos
	)
SELECT *, (SELECT * FROM total_results_count) FROM chat_infos ORDER BY last_updated DESC LIMIT $3 OFFSET $4 
`;

export const getAllChatsQuery = `
	WITH 
	client_non_group_chats AS (
		SELECT cm.chat_id FROM chat_master cm INNER JOIN chat_data cd ON cm.chat_id = cd.id
		WHERE cm.client_id = $1 AND NOT cd.is_group
	),
	chat_and_member_info AS (
		SELECT cm.client_id, cm.chat_id, username, full_name, display_picture_url, cd.last_updated FROM chat_master cm 
		INNER JOIN client_master clm ON cm.client_id = clm.id
		INNER JOIN chat_data cd ON cm.chat_id = cd.id
		WHERE cm.chat_id IN (SELECT chat_id FROM client_non_group_chats) AND cm.client_id <> $1
	),
	total_results_count AS (
		SELECT COUNT (*) as total_results_count FROM chat_and_member_info
	)
	SELECT *, (SELECT total_results_count FROM total_results_count) FROM chat_and_member_info ORDER BY last_updated DESC LIMIT $2 OFFSET $3;
`;
