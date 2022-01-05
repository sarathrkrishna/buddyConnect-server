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
    	description,
    	display_picture_url
    )
    SELECT $1, $2, $3, $4, $5 
    WHERE NOT EXISTS (
    	SELECT * FROM client_exists
    ) 
    RETURNING id, username, full_name, description, display_picture_url, is_disabled, create_at;
`;
