import { useEffect } from 'react';
import './UIComponents.css';

export function Button({ children, variant = 'primary', size = 'medium', className = '', ...props }) {
  return <button className={`ui-button ui-button--${variant} ui-button--${size} ${className}`.trim()} {...props}>{children}</button>;
}

export function IconButton({ label, children, className = '', ...props }) {
  return <button type="button" className={`ui-icon-button ${className}`.trim()} aria-label={label} {...props}>{children}</button>;
}

export function Card({ children, className = '', ...props }) {
  return <article className={`ui-card ${className}`.trim()} {...props}>{children}</article>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={`ui-card__header ${className}`.trim()}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`ui-card__body ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`ui-card__footer ${className}`.trim()}>{children}</div>;
}

export function Badge({ children, variant = 'neutral' }) {
  return <span className={`ui-badge ui-badge--${variant}`}>{children}</span>;
}

export function Avatar({ name = '', src, size = 'medium' }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || '?';
  return src
    ? <img className={`ui-avatar ui-avatar--${size}`} src={src} alt={name} />
    : <span className={`ui-avatar ui-avatar--${size}`} aria-label={name || 'Аватар'}>{initials}</span>;
}

export function Input({ label, id, className = '', ...props }) {
  return (
    <label className="ui-control">
      {label && <span className="ui-control__label">{label}</span>}
      <input id={id} className={`ui-input ${className}`.trim()} {...props} />
    </label>
  );
}

export function Textarea({ label, id, className = '', ...props }) {
  return (
    <label className="ui-control">
      {label && <span className="ui-control__label">{label}</span>}
      <textarea id={id} className={`ui-input ui-textarea ${className}`.trim()} {...props} />
    </label>
  );
}

export function Select({ label, id, options = [], className = '', ...props }) {
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

export function Checkbox({ label, checked, onChange, ...props }) {
  return (
    <label className="ui-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} {...props} />
      <span>{label}</span>
    </label>
  );
}

export function Switch({ label, checked, onChange, ...props }) {
  return (
    <label className="ui-switch">
      <span>{label}</span>
      <button type="button" role="switch" aria-checked={checked} className={`ui-switch__track ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)} {...props}>
        <span className="ui-switch__thumb" />
      </button>
    </label>
  );
}

export function FormField({ label, htmlFor, hint, error, children }) {
  return (
    <div className="ui-control">
      {label && <label className="ui-control__label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? <span className="ui-control__error">{error}</span> : hint && <span className="ui-control__hint">{hint}</span>}
    </div>
  );
}

export function SearchField({ value, onChange, placeholder = 'Поиск...', ...props }) {
  return (
    <label className="ui-search">
      <span aria-hidden="true">⌕</span>
      <input value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder} {...props} />
    </label>
  );
}

export function Rating({ value = 0, onChange, label = 'Рейтинг' }) {
  return (
    <div className="ui-rating" role={onChange ? 'group' : 'img'} aria-label={`${label}: ${value} из 5`}>
      {[1, 2, 3, 4, 5].map(star => onChange ? (
        <button type="button" key={star} aria-label={`${star} из 5`} onClick={() => onChange(star)} className={star <= value ? 'is-active' : ''}>★</button>
      ) : <span key={star} className={star <= value ? 'is-active' : ''}>★</span>)}
      <span className="ui-rating__value">{value}</span>
    </div>
  );
}

export function Price({ value, currency = 'сом' }) {
  return <span className="ui-price">{new Intl.NumberFormat('ru-RU').format(value)} <span>{currency}</span></span>;
}

export function Alert({ children, variant = 'info', title }) {
  return <div className={`ui-alert ui-alert--${variant}`} role="status">{title && <strong>{title}</strong>}<span>{children}</span></div>;
}

export function EmptyState({ title = 'Пока ничего нет', description, action }) {
  return <div className="ui-empty"><span className="ui-empty__icon" aria-hidden="true">◇</span><strong>{title}</strong>{description && <p>{description}</p>}{action}</div>;
}

export function Spinner({ label = 'Загрузка...' }) {
  return <span className="ui-spinner" role="status" aria-label={label} />;
}

export function Skeleton({ width = '100%', height = 16, className = '' }) {
  return <span className={`ui-skeleton ${className}`.trim()} style={{ width, height }} aria-hidden="true" />;
}

export function Divider({ label }) {
  return <div className="ui-divider">{label && <span>{label}</span>}</div>;
}

export function Stack({ children, direction = 'column', gap = 'medium', className = '' }) {
  return <div className={`ui-stack ui-stack--${direction} ui-stack--gap-${gap} ${className}`.trim()}>{children}</div>;
}

export function Grid({ children, columns = 2, className = '' }) {
  return <div className={`ui-grid ${className}`.trim()} style={{ '--ui-grid-columns': columns }}>{children}</div>;
}

export function Container({ children, className = '' }) {
  return <div className={`ui-container ${className}`.trim()}>{children}</div>;
}

export function StatCard({ label, value, trend, icon }) {
  return <Card className="ui-stat"><CardBody><div className="ui-stat__top"><span>{label}</span>{icon && <span aria-hidden="true">{icon}</span>}</div><strong>{value}</strong>{trend && <small>{trend}</small>}</CardBody></Card>;
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ui-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="ui-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <CardHeader><h3>{title}</h3><IconButton label="Закрыть окно" onClick={onClose}>×</IconButton></CardHeader>
        <CardBody>{children}</CardBody>
      </section>
    </div>
  );
}

export function Drawer({ open, onClose, title, children, side = 'right' }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ui-overlay ui-overlay--drawer" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <aside className={`ui-drawer ui-drawer--${side}`} role="dialog" aria-modal="true" aria-label={title}>
        <CardHeader><h3>{title}</h3><IconButton label="Закрыть панель" onClick={onClose}>×</IconButton></CardHeader>
        <CardBody>{children}</CardBody>
      </aside>
    </div>
  );
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="ui-tabs" role="tablist">
      {tabs.map(tab => <button type="button" role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? 'is-active' : ''} key={tab.id} onClick={() => onChange(tab.id)}>{tab.label}</button>)}
    </div>
  );
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="ui-pagination" aria-label="Страницы">
      <Button variant="secondary" size="small" disabled={page <= 1} onClick={() => onChange(page - 1)}>Назад</Button>
      <span>{page} / {totalPages}</span>
      <Button variant="secondary" size="small" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Далее</Button>
    </nav>
  );
}
