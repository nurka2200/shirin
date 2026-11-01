export default function FormField({ label, htmlFor, hint, error, children }) {
  return (
    <div className="ui-control">
      {label && <label className="ui-control__label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? <span className="ui-control__error">{error}</span> : hint && <span className="ui-control__hint">{hint}</span>}
    </div>
  );
}
