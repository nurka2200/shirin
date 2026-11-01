export default function Switch({ label, checked, onChange, ...props }) {
  return (
    <label className="ui-switch">
      <span>{label}</span>
      <button type="button" role="switch" aria-checked={checked} className={`ui-switch__track ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)} {...props}>
        <span className="ui-switch__thumb" />
      </button>
    </label>
  );
}
