export default function SearchField({ value, onChange, placeholder = 'Поиск...', ...props }) {
  return (
    <label className="ui-search">
      <span aria-hidden="true">⌕</span>
      <input value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder} {...props} />
    </label>
  );
}
