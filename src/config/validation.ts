import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'testing'),
  SECRET: Joi.string().required(),
  PORT: Joi.number().default(3000),
});
