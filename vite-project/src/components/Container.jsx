export default function Container({ children, className = '' }) {
  return <div className={`ui-container ${className}`.trim()}>{children}</div>;
}
