import joi from "joi";

export const register = joi
  .object({
    userName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    confirmPassword: joi.string().min(8).required(),
    phone: joi
      .string()
      .pattern(/^01[0125][0-9]{8}$/)
      .required(),
    gender: joi.string().valid("male", "female").required(),
    role: joi.string().valid("Chair", "Director", "Volunteer", "Participant"),
  })
  .required();

export const login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  })
  .required();

export const activate = joi
  .object({
    token: joi.string().required(),
  })
  .required();


  export const forgetCode = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

  export const resetPassword = joi
  .object({
    code: joi.string().required().max(6).min(6),
    newPassword: joi.string().min(8).required(),
    confirmPassword: joi.string().min(8).required(),
    email:joi.string().email().required()

  })
  .required();
