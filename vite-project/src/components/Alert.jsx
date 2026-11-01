export default function Alert({ children, variant = 'info', title }) {
  return <div className={`ui-alert ui-alert--${variant}`} role="status">{title && <strong>{title}</strong>}<span>{children}</span></div>;
}
