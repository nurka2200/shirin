export default function IconButton({ label, children, className = '', ...props }) {
  return <button type="button" className={`ui-icon-button ${className}`.trim()} aria-label={label} {...props}>{children}</button>;
}
