import cloudinary from "../config/cloudinary.js";
import Image from "../models/Image.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { getPublicIdFromCloudinaryUrl } from "../utils/cloudinary.utils.js";
import updateFolderSize from "../utils/updateFolderSize.js";

const notImplemented = (res, action) => {
  return res.status(501).json({
    success: false,
    message: `Image ${action} is not implemented yet.`,
  });
};


export const uploadImage = async (
  req,
  res
) => {
  try {

    const { folderId } = req.body;

        if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "Folder id is required",
      });
    }

    const result =
      await uploadToCloudinary(
        req.file.buffer
      );

    const image =
      await Image.create({
        name: req.file.originalname,

        url: result.secure_url,

        size: req.file.size,

        owner: req.user._id,

        folderId,
      });

    await updateFolderSize(
      folderId,
      image.size
    );

    res.status(201).json({
      success: true,
      image,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Upload Failed",
    });
  }
};

// Helper function for deleting a single image (can be used internally or by route)
const deleteSingleImage = async (imageId, userId) => {
  const image = await Image.findOne({ _id: imageId, owner: userId });

  if (!image) {
    return { success: false, status: 404, message: "Image not found" };

    
  }

  const publicId = getPublicIdFromCloudinaryUrl(image.url);

  

  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }

    await updateFolderSize(
    image.folderId,
    -image.size
  );

  

  await Image.deleteOne({ _id: imageId });
  return { success: true, message: "Image deleted successfully" };
};


export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params; // Image ID
    const userId = req.user._id;

    const result = await deleteSingleImage(id, userId);

    if (!result.success) {
      return res.status(result.status || 500).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getImages = async (req, res) => {
  try {
    const { folderId } = req.query; // Allow filtering by folderId
    const userId = req.user._id;

    let query = { owner: userId };
    if (folderId) {
      query.folderId = folderId;
    }

    const images = await Image.find(query);

    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Error getting images:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
