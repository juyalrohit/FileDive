const getPublicIdFromCloudinaryUrl = (url) => {
  // Cloudinary URLs typically follow a pattern like:
  // https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<extension>
  // We want to extract <public_id> which might include subfolders.

  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');

  if (uploadIndex > -1 && uploadIndex + 2 < parts.length) {
    // The public ID starts after 'upload' and the version number (e.g., 'v12345')
    const publicIdParts = parts.slice(uploadIndex + 2);
    const fullPublicId = publicIdParts.join('/');

    // Remove the file extension if present
    const lastDotIndex = fullPublicId.lastIndexOf('.');
    if (lastDotIndex > -1) {
      return fullPublicId.substring(0, lastDotIndex);
    }
    return fullPublicId;
  }
  return null;
};

export { getPublicIdFromCloudinaryUrl };