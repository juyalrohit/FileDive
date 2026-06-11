import { Router } from 'express';
import { deleteImage, getImages, uploadImage } from '../controllers/image.controller.js';
import upload from '../middleware/upload.middleware.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, getImages);

router.post(
  "/upload",
  protect,
  upload.single("image"),
  uploadImage
);
router.delete('/:id', protect, deleteImage);

export default router;
