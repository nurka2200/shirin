export default function Avatar({ name = '', src, size = 'medium' }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || '?';
  return src
    ? <img className={`ui-avatar ui-avatar--${size}`} src={src} alt={name} />
    : <span className={`ui-avatar ui-avatar--${size}`} aria-label={name || 'Аватар'}>{initials}</span>;
}
