import express from "express";
const router = express.Router();
router.route("/orders/new").post(isAuthenticatedUser, newOrders);
import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getOrderDetails,
  myOrders,
  newOrders,
  updateOrder,
} from "../controllers/orderControllers.js";
//import { newOrder }  from "../controllers/orderControllers.js";

router.route("/orders/new").post(isAuthenticatedUser, newOrders);
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser, myOrders);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);

  router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;
