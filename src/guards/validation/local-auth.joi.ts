import * as Joi from 'joi';

export const localAuthRequestSchema = Joi.object({
  username: Joi.string().alphanum().min(5).max(20),
  password: Joi.string().min(8),
});
