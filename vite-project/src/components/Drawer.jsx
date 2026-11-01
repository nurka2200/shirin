import { useEffect } from 'react';
import CardHeader from './CardHeader.jsx';
import CardBody from './CardBody.jsx';
import IconButton from './IconButton.jsx';

export default function Drawer({ open, onClose, title, children, side = 'right' }) {
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
