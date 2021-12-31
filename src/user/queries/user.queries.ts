export const findOneUserByUsernameQuery = `
    SELECT id, username, password FROM client_master WHERE username=$1;
`;
