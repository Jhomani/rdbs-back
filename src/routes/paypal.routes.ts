import { Router } from "express";
import {
  errorCallback,
  successCallback,
  getPaymentCheckout
} from "@src/controllers/paypal.controller";

const router = Router();

router.route("/checkout").post(getPaymentCheckout);
router.route("/cancel").get(errorCallback);
router.route("/success").get(successCallback);

export default router;