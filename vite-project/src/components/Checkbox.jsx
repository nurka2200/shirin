export default function Checkbox({ label, checked, onChange, ...props }) {
  return (
    <label className="ui-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} {...props} />
      <span>{label}</span>
    </label>
  );
}
