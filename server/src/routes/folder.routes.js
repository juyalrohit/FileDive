import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createFolder,
  getRootFolders,
  deleteFolder,
  getAllFolders,
  renameFolder,
  getFolderContents,
} from '../controllers/folder.controller.js';


const router = express.Router();

router.post("/", protect, createFolder);
router.get("/", protect, getRootFolders);
router.get('/all', protect, getAllFolders);
router.get('/:id', protect, getFolderContents);
router.patch('/:id', protect, renameFolder);
router.delete('/:id', protect, deleteFolder);

export default router;
