export default function Grid({ children, columns = 2, className = '' }) {
  return <div className={`ui-grid ${className}`.trim()} style={{ '--ui-grid-columns': columns }}>{children}</div>;
}
