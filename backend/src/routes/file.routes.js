import { Router } from "express";
import { uploadController, downloadController } from "../controllers/file.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Routes supporting both /upload and /files/upload
router.post("/upload", upload.single("file"), uploadController);
router.post("/files/upload", upload.single("file"), uploadController);

router.get("/download/:token", downloadController);
router.get("/files/download/:token", downloadController);

export default router;
