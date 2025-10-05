import { SaleListing } from '../lib/types';

interface SaleDetailDrawerProps {
  sale: SaleListing | null;
  onClose: () => void;
}

export function SaleDetailDrawer({ sale, onClose }: SaleDetailDrawerProps) {
  return (
    <aside className={`detail-drawer ${sale ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose} aria-label="Close details">
        ×
      </button>
      {sale ? (
        <div className="detail-content">
          <h2>{sale.title}</h2>
          <p className="address">{sale.address}</p>
          <p className="dates">
            {new Date(sale.startDate).toLocaleDateString()} –{' '}
            {new Date(sale.endDate).toLocaleDateString()}
            {sale.startTime && sale.endTime
              ? ` • ${sale.startTime} to ${sale.endTime}`
              : ''}
          </p>
          <p className="description">{sale.description}</p>
          {sale.tags && sale.tags.length > 0 ? (
            <div className="tag-list">
              {sale.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {sale.sourceUrl ? (
            <a href={sale.sourceUrl} target="_blank" rel="noreferrer" className="source-link">
              View original listing ↗
            </a>
          ) : null}
        </div>
      ) : (
        <div className="detail-placeholder">
          <p>Select a sale to see the details.</p>
        </div>
      )}
    </aside>
  );
}
