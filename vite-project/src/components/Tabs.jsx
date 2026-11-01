export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="ui-tabs" role="tablist">
      {tabs.map(tab => <button type="button" role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? 'is-active' : ''} key={tab.id} onClick={() => onChange(tab.id)}>{tab.label}</button>)}
    </div>
  );
}
