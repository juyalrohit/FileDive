export function FoldersSkeleton({ count = 4 }) {
  return (
    <div className="grid-folders">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-folder" />
      ))}
    </div>
  );
}

export function ImagesSkeleton({ count = 6 }) {
  return (
    <div className="grid-images">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-image card">
          <div className="skeleton skeleton-image-thumb" />
          <div className="skeleton-image-info">
            <div className="skeleton skeleton-text" style={{ width: '70%' }} />
            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}