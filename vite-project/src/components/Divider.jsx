export default function Divider({ label }) {
  return <div className="ui-divider">{label && <span>{label}</span>}</div>;
}
