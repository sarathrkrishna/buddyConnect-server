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
    RETURNING id, username, full_name, description, is_disabled, create_at;
`;

export const usernameAlreadyExistsQuery = `
    SELECT 1 as exists FROM client_master WHERE username=$1;
`;

export const uploadFileQuery = `
    UPDATE client_master SET display_picture_url=$1 WHERE id=$2 RETURNING 1 as done, display_picture_url;
`;
