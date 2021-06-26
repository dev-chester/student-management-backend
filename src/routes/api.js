import express from "express";

import { validate } from "express-validation";

import * as apiController from "../controllers/api.controller";
import * as apiValidator from "../controllers/api.validator";

const router = express.Router();


router.get("/getcommonstudents", validate(apiValidator.getcommonstudent, {keyByField: true}), apiController.getcommonstudents);

router.post("/register", validate(apiValidator.register, { keyByField: true }), apiController.register);

router.post("/suspend", validate(apiValidator.suspendStudent, { keyByField: true }), apiController.suspendStudent);

router.post("/retrievenotifications", validate(apiValidator.retrieveNotifications, { keyByField: true }), apiController.retrieveNotifications);

module.exports = router;
