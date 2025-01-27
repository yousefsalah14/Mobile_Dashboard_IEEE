import { Router } from "express";
import * as authController from "./auth.controller.js";
import * as authSchema from "./auth.schema.js";
import { validation } from "../../middlewares/validation.js";
const router = Router();

router.post(
  "/register",
  validation(authSchema.register),
  authController.register
);

router.post("/login", validation(authSchema.login), authController.login);

router.get(
  "/activate_account/:token",
  validation(authSchema.activate),
  authController.activate
);

router.patch('/forgetCode',
    validation(authSchema.forgetCode),
    authController.forgetCode
)

router.patch('/reset_password',
    validation(authSchema.resetPassword),
    authController.resetPassword

)
export default router;
