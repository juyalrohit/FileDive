const getEntrySize = (entry) => {
  if (typeof entry === 'number' && Number.isFinite(entry)) {
    return entry;
  }

  if (!entry || typeof entry !== 'object') {
    return 0;
  }

  if (typeof entry.size === 'number' && Number.isFinite(entry.size)) {
    return entry.size;
  }

  const children = entry.files || entry.items || entry.children || [];

  if (!Array.isArray(children)) {
    return 0;
  }

  return children.reduce((total, child) => total + getEntrySize(child), 0);
};

export const getFolderSize = (folderOrEntries) => {
  if (Array.isArray(folderOrEntries)) {
    return folderOrEntries.reduce((total, entry) => total + getEntrySize(entry), 0);
  }

  return getEntrySize(folderOrEntries);
};
