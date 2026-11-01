export default function Button({ children, variant = 'primary', size = 'medium', className = '', ...props }) {
  return <button className={`ui-button ui-button--${variant} ui-button--${size} ${className}`.trim()} {...props}>{children}</button>;
}
