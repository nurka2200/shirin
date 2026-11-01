import { useEffect } from 'react';
import CardHeader from './CardHeader.jsx';
import CardBody from './CardBody.jsx';
import IconButton from './IconButton.jsx';

export default function Modal({ open, onClose, title, children }) {
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
