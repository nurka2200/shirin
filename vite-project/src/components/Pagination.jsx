import Button from './Button.jsx';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="ui-pagination" aria-label="Страницы">
      <Button variant="secondary" size="small" disabled={page <= 1} onClick={() => onChange(page - 1)}>Назад</Button>
      <span>{page} / {totalPages}</span>
      <Button variant="secondary" size="small" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Далее</Button>
    </nav>
  );
}
