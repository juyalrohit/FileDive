import Folder from "../models/Folder.js";
import Image from "../models/Image.js";
import cloudinary from "../config/cloudinary.js";
import { getPublicIdFromCloudinaryUrl } from "./cloudinary.utils.js";

const deleteFolderRecursive = async (
  folderId,
  userId
) => {

  // 1. Delete images in current folder
  const images = await Image.find({
    folderId,
    owner: userId,
  });

  for (const image of images) {

    const publicId =
      getPublicIdFromCloudinaryUrl(
        image.url
      );

    if (publicId) {
      await cloudinary.uploader.destroy(
        publicId
      );
    }

    await Image.deleteOne({
      _id: image._id,
    });
  }

  // 2. Find child folders
  const childFolders =
    await Folder.find({
      parentFolder: folderId,
      owner: userId,
    });

  // 3. Delete children recursively
  for (const child of childFolders) {

    await deleteFolderRecursive(
      child._id,
      userId
    );
  }

  // 4. Delete current folder
  await Folder.deleteOne({
    _id: folderId,
  });
};

export default deleteFolderRecursive;