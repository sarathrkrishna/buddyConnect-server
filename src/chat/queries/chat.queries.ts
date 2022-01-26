export const selectExistingChat = `
	WITH
 	user_chats AS (
 		SELECT chat_id FROM chat_master cm INNER JOIN chat_data cd ON cm.chat_id=cd.id 
 		WHERE cm.client_id=$1
 	),
	member_chats AS (
		SELECT * FROM chat_master cmaster WHERE chat_id IN (SELECT chat_id FROM user_chats) AND client_id <> $1
	)
 	SELECT client.id AS member_id, members.id AS chat_master_id, chat_id, is_deleted FROM client_master client
 	LEFT JOIN member_chats members ON client.id=members.client_id
 	WHERE client.id=$2
	--  0 rows -> the member doesnt exist
	-- row with no chat_master_id, chat_id and is_deleted -> the member is eligible for a fresh chat
	-- row with all filled -> chat already exists
`;

export const createChatQuery = `
	WITH
	create_chat AS (
		INSERT INTO chat_data (creator_id, last_updated) VALUES ($1, NOW()) RETURNING creator_id AS client_id, id AS chat_id
	),
	chat_master_data AS (
		SELECT * FROM create_chat
		UNION
		SELECT $2 AS client_id, (SELECT chat_id FROM create_chat)
	),
	insert_chat_master AS (
		INSERT INTO chat_master (client_id, chat_id)
		SELECT * FROM chat_master_data RETURNING chat_id, client_id
	)
SELECT chat_id, client_id, username, full_name, description, display_picture_url FROM insert_chat_master icm
INNER JOIN client_master clm ON icm.client_id=clm.id
WHERE icm.client_id <> $1
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

export const selectMemberChatMasterData = `
	WITH 
	user_chats AS (
		SELECT chat_id FROM chat_master cm INNER JOIN chat_data cd ON cm.chat_id=cd.id WHERE client_id=$1
	)
	SELECT client_id, cm.chat_id, is_deleted FROM chat_master cm 
	INNER JOIN user_chats uc ON cm.chat_id=uc.chat_id 
	INNER JOIN chat_data cd ON cm.chat_id=cd.id
	WHERE cm.chat_id=$2 AND cm.client_id <> $1 AND NOT cd.is_group
`;

export const softDeleteChatForUser = `
	UPDATE chat_master SET is_deleted=true WHERE client_id=$1 AND chat_id=$2 RETURNING chat_id;
`;

export const hardDeleteChatForBoth = `
	DELETE FROM chat_data WHERE id=$1 RETURNING id AS chat_id;
`;
