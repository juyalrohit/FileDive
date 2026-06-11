export function formatSize(bytes) {
  if (bytes == null || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${value} ${units[i]}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDisplayName(value) {
  const fallback = 'Untitled image';

  if (!value) return fallback;

  const raw = String(value).trim();
  if (!raw) return fallback;

  const withoutQuery = raw.split('?')[0];
  const lastSegment = withoutQuery.split('/').pop() || raw;
  const withoutExtension = lastSegment.replace(/\.[^.]+$/, '');
  const cleaned = withoutExtension
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || fallback;
}