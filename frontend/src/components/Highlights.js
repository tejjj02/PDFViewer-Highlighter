// src/components/Highlights.js
const Highlights = ({ highlights, onDelete, onExport }) => {
  return (
    <div className="highlights-panel">
      <h3>Highlights</h3>
      <div className="highlights-list">
        {highlights.map((highlight) => (
          <div 
            key={highlight.id} 
            className="highlight-item"
            style={{ borderLeft: `4px solid ${highlight.color}` }}
          >
            <div className="highlight-text">{highlight.text}</div>
            <div className="highlight-meta">
              Page {highlight.pageNumber}
            </div>
            <div className="highlight-actions">
              <button 
                onClick={() => onDelete(highlight.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={onExport} 
        className="export-button"
        disabled={highlights.length === 0}
      >
        Export Highlights
      </button>
    </div>
  );
};

export default Highlights;