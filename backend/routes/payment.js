import express from "express";

const router = express.Router();
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { stripeChekoutSession, stripeWebhook } from "../controllers/paymentController.js";

router
  .route("/payment/checkout_session")
  .post(isAuthenticatedUser, stripeChekoutSession);

  router
  .route("/payment/webhook")
  .post(stripeWebhook);

export default router;
