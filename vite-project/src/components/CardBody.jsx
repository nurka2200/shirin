export default function CardBody({ children, className = '' }) {
  return <div className={`ui-card__body ${className}`.trim()}>{children}</div>;
}
