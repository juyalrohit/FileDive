import Folder from "../models/Folder.js";

const updateFolderSize = async (
  folderId,
  sizeChange
) => {
  let currentFolderId = folderId;

  while (currentFolderId) {

    const folder =
      await Folder.findByIdAndUpdate(
        currentFolderId,
        {
          $inc: {
            totalSize: sizeChange,
          },
        },
        {
          new: true,
        }
      );

    currentFolderId =
      folder?.parentFolder;
  }
};

export default updateFolderSize;