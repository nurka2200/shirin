import Card from './Card.jsx';
import CardBody from './CardBody.jsx';

export default function StatCard({ label, value, trend, icon }) {
  return <Card className="ui-stat"><CardBody><div className="ui-stat__top"><span>{label}</span>{icon && <span aria-hidden="true">{icon}</span>}</div><strong>{value}</strong>{trend && <small>{trend}</small>}</CardBody></Card>;
}
