export default function Stack({ children, direction = 'column', gap = 'medium', className = '' }) {
  return <div className={`ui-stack ui-stack--${direction} ui-stack--gap-${gap} ${className}`.trim()}>{children}</div>;
}
