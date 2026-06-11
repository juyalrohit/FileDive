import Folder from '../models/Folder.js'
import cloudinary from '../config/cloudinary.js';
import Image from '../models/Image.js';
import { getPublicIdFromCloudinaryUrl } from '../utils/cloudinary.utils.js';
import updateFolderSize from '../utils/updateFolderSize.js';
import deleteFolderRecursive from '../utils/deleteFolderRecursive.js';

export const createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    const folder = await Folder.create({
      name,
      owner: req.user._id,
      parentFolder: parentFolder || null,
    });

    res.status(201).json({
      success: true,
      folder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getRootFolders = async (req, res) => {
  try {
    const folders = await Folder.find({
      owner: req.user._id,
      parentFolder: null,
    });

    const recentImages = await Image.find({
      owner : req.user._id}).
      sort({createdAt : -1}).limit(5)

    res.status(200).json({
      success: true,
      folders,
      recentImages
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getFolderContents = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const currentFolder =
      await Folder.findOne({
        _id: id,
        owner: req.user._id,
      });

    if (!currentFolder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const folders = await Folder.find({
      owner: req.user._id,
      parentFolder: id,
    });

    const images = await Image.find({
      owner: req.user._id,
      folderId: id,
    });

    res.json({
      success: true,
      folder: currentFolder,
      folders,
      images,
      breadcrumbs: [] // temporary
    });

  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

export const renameFolder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const trimmedName = typeof name === 'string' ? name.trim() : '';

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required.',
      });
    }

    const folder =
      await Folder.findOneAndUpdate(
        {
          _id: id,
          owner: req.user._id,
        },
        {
          name: trimmedName,
        },
        {
          new: true,
        }
      );

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found or you don't have permission to rename it.",
      });
    }
    res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Renamed from getFolders to getAllFolders for clarity and to avoid route conflict
export const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user._id });
    res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    console.error("Error getting all folders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user._id;

    // 1. Check if the folder exists and belongs to the user
    const folderToDelete = await Folder.findOne({ _id: id, owner: userId });
    if (!folderToDelete) {
      return res.status(404).json({
        success: false,
        message: "Folder not found or you don't have permission to delete it.",
      });
    }

    // // 2. Check for child folders
    // const hasChildren = await Folder.exists({ parentFolder: id, owner: userId });
    
    // if (hasChildren) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Folder contains subfolders. Please delete them first.",
    //   });
    // }

    await deleteFolderRecursive(
      id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message:
        "Folder deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
