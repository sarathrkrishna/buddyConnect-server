export default {
  SERVER: {
    DEFAULT_PORT: 3000,
    DEFAULT_ENV: 'development',
  },
  DB: {
    DEFAULT_PORT: 5432,
    DEFAULT_HOST: 'localhost',
  },
  AUTH: {
    DEFAULT_JWT_EXPIRY: 3600,
  },
  MULTER: {
    SUPPORTED_IMAGE_TYPES: [
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
    ],
  },
};
