export const findOneUserByUsernameQuery = `
    SELECT id, username, password FROM client_master WHERE username=$1;
`;
export const insertNewClientQuery = `
    WITH
    client_exists AS (
    	SELECT 1 FROM client_master WHERE username=$1
    )
    INSERT INTO client_master (
    	username,
    	password,
    	full_name,
    	description
    )
    SELECT $1, $2, $3, $4
    WHERE NOT EXISTS (
    	SELECT * FROM client_exists
    ) 
    RETURNING id, username, full_name, description, create_at;
`;

export const usernameAlreadyExistsQuery = `
    SELECT 1 as exists FROM client_master WHERE username=$1;
`;

export const uploadFileQuery = `
    UPDATE client_master SET display_picture_url=$1 WHERE id=$2 RETURNING 1 as done, display_picture_url;
`;

export const getUserQuery = `
    SELECT id, username, full_name, description, display_picture_url, create_at 
    FROM client_master WHERE NOT is_disabled AND %I=%L
`;

export const searchUserQuery = `
    WITH
	non_disabled_users AS (
		SELECT * FROM client_master WHERE NOT is_disabled
	),
	search_users AS (
		SELECT id, username, full_name, description, display_picture_url, create_at FROM non_disabled_users
		WHERE (username ILIKE $1 OR full_name ILIKE $1) AND id <> $2
	),
	results_count AS (
		SELECT COUNT (*) AS total_results FROM search_users
	)
    SELECT *, (SELECT * FROM results_count) FROM search_users LIMIT $3 OFFSET $4;
`;

export const userUpdateQuery = `
    UPDATE client_master SET %s WHERE id = %L;
`;
