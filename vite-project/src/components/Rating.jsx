export default function Rating({ value = 0, onChange, label = 'Рейтинг' }) {
  return (
    <div className="ui-rating" role={onChange ? 'group' : 'img'} aria-label={`${label}: ${value} из 5`}>
      {[1, 2, 3, 4, 5].map(star => onChange ? (
        <button type="button" key={star} aria-label={`${star} из 5`} onClick={() => onChange(star)} className={star <= value ? 'is-active' : ''}>★</button>
      ) : <span key={star} className={star <= value ? 'is-active' : ''}>★</span>)}
      <span className="ui-rating__value">{value}</span>
    </div>
  );
}
