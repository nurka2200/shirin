export default function CardHeader({ children, className = '' }) {
  return <div className={`ui-card__header ${className}`.trim()}>{children}</div>;
}
