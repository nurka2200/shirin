export default function EmptyState({ title = 'Пока ничего нет', description, action }) {
  return <div className="ui-empty"><span className="ui-empty__icon" aria-hidden="true">◇</span><strong>{title}</strong>{description && <p>{description}</p>}{action}</div>;
}
