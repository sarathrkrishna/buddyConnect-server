export const getExistingDisplayPictureUrl = `
    SELECT display_picture_url FROM client_master WHERE id=$1;
`;

export const uploadFileQuery = `
    UPDATE client_master SET display_picture_url=$1 WHERE id=$2 RETURNING 1 as done, display_picture_url;
`;
