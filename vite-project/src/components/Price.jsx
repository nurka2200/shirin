export default function Price({ value, currency = 'сом' }) {
  return <span className="ui-price">{new Intl.NumberFormat('ru-RU').format(value)} <span>{currency}</span></span>;
}
