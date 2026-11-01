export default function Select({ label, id, options = [], className = '', ...props }) {
  return (
    <label className="ui-control">
      {label && <span className="ui-control__label">{label}</span>}
      <select id={id} className={`ui-input ui-select ${className}`.trim()} {...props}>
        {options.map(option => {
          const item = typeof option === 'string' ? { label: option, value: option } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
    </label>
  );
}
