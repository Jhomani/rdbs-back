import { Router } from "express";
import { auth } from '../midlewares/auth.middle';
import {
  getMethod,
  postMethod,
  singleGet,
  updateById,
  deleteById,
  addPricesItem,
  removePricesItem,
} from "@src/controllers/region-prices.controller";

const router = Router();

router.route("/").get(getMethod);
router.route("/").post(auth, postMethod);
router.route("/:id/prices/:pid").delete(auth, removePricesItem);
router.route("/:id/prices").patch(auth, addPricesItem);
router.route("/:id").patch(updateById);
router.route("/:id").get(singleGet);
router.route("/:id").delete(auth, deleteById);

export default router;
