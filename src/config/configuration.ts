import CONSTANTS from '../shared/const/constants';

export default () => ({
  port: process.env.PORT || CONSTANTS.SERVER.DEFAULT_PORT,
  environment: process.env.NODE_ENV || CONSTANTS.SERVER.DEFAULT_ENV,
  db: {
    host: process.env.POSTGRES_HOST || CONSTANTS.DB.DEFAULT_HOST,
    port: process.env.POSTGRES_LOCAL_PORT || CONSTANTS.DB.DEFAULT_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  },
});