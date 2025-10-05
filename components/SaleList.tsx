import { SaleListing } from '../lib/types';

interface SaleListProps {
  sales: SaleListing[];
  onSelect: (sale: SaleListing) => void;
}

export function SaleList({ sales, onSelect }: SaleListProps) {
  if (sales.length === 0) {
    return (
      <div className="sale-list empty">
        <p>No sales found just yet. Try expanding your search!</p>
      </div>
    );
  }

  return (
    <div className="sale-list">
      {sales.map((sale) => (
        <button key={sale.id} className="sale-card" onClick={() => onSelect(sale)}>
          <div className="sale-card-header">
            <h3>{sale.title}</h3>
            <span className={`tag ${sale.source}`}>{sale.source}</span>
          </div>
          <p className="address">{sale.address}</p>
          <p className="dates">
            {new Date(sale.startDate).toLocaleDateString()} –{' '}
            {new Date(sale.endDate).toLocaleDateString()}
            {sale.startTime && sale.endTime
              ? ` • ${sale.startTime} to ${sale.endTime}`
              : ''}
          </p>
          {sale.tags && sale.tags.length > 0 ? (
            <div className="tag-list">
              {sale.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}
