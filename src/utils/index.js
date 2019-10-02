import is from 'is';

export function s(value) {
  if (is.string(value)) return value;
  if (typeof value === 'symbol') return value.toString();
  try {
    return `${value}`;
  } catch (err) {
    return '-unreadable-string-';
  }
}
