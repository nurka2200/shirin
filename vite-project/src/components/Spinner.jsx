export default function Spinner({ label = 'Загрузка...' }) {
  return <span className="ui-spinner" role="status" aria-label={label} />;
}
