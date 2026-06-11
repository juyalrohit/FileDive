import Folder from "../models/Folder.js";
import Image from "../models/Image.js";

export const getStats = async (
  req,
  res
) => {
  try {

    const userId = req.user._id;

    const rootFolders = await Folder.find({
      owner: userId,
      parentFolder: null,
    }, {totalSize : 1});
    

    const totalFolders =
      await Folder.countDocuments({
        owner: userId,
        parentFolder: null,
      });

    const totalImages =
      await Image.countDocuments({
        owner: userId,
      });

    

    const totalStorage =
      rootFolders.reduce(
        (sum, folder) =>
          sum + (folder.totalSize || 0),
        0
      );

    res.status(200).json({
      success: true,
      totalFolders,
      totalImages,
      totalStorage,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};