// NOTE: Eventually migrate all constants to this file

export const GET_USER_SEARCH_BY_KEYS = {
  ID: 'id',
  USERNAME: 'username',
};

export const GET_USER_SEARCH_BY_LIST = [
  GET_USER_SEARCH_BY_KEYS.ID,
  GET_USER_SEARCH_BY_KEYS.USERNAME,
];

export const UUID_REGEX =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/gi;

export const SEARCH_PAGINATION_CONSTS = {
  LIMIT: 5,
  OFFSET: 0,
};

export const DFLAG_CONSTS = {
  DELETE: 'delete',
  DISABLE: 'disable',
};

export const DFLAG_LIST = [DFLAG_CONSTS.DELETE, DFLAG_CONSTS.DISABLE];
