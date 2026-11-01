export default function CardFooter({ children, className = '' }) {
  return <div className={`ui-card__footer ${className}`.trim()}>{children}</div>;
}
