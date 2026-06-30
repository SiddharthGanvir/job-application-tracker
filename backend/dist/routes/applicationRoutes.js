"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applicationController_1 = require("../controllers/applicationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authenticateToken, applicationController_1.createApplication);
router.get("/", authMiddleware_1.authenticateToken, applicationController_1.getApplications);
router.put("/:id", authMiddleware_1.authenticateToken, applicationController_1.updateApplication);
router.delete("/:id", authMiddleware_1.authenticateToken, applicationController_1.deleteApplication);
exports.default = router;
