export default function Input({ label, id, className = '', ...props }) {
  return (
    <label className="ui-control">
      {label && <span className="ui-control__label">{label}</span>}
      <input id={id} className={`ui-input ${className}`.trim()} {...props} />
    </label>
  );
}
