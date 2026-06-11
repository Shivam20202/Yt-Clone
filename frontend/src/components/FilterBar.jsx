import './FilterBar.css';

//Filter component 
const categories = [
  'All',
  'Web Development',
  'JavaScript',
  'Data Structures',
  'Server',
  'Music',
  'Information Technology',
  'Gaming',
  'Live',
  'Spring Framework',
  'Education',
  'Entertainment',
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${active === cat ? 'filter-chip-active' : ''}`}
            onClick={() => onChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
