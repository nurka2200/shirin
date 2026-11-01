export default function Textarea({ label, id, className = '', ...props }) {
  return (
    <label className="ui-control">
      {label && <span className="ui-control__label">{label}</span>}
      <textarea id={id} className={`ui-input ui-textarea ${className}`.trim()} {...props} />
    </label>
  );
}
