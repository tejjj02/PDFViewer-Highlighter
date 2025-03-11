import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ file, onHighlight, onPageChange, onTotalPagesChange, highlights }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [selectedColor, setSelectedColor] = useState('#ffeb3b');
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const highlightColors = [
    { color: '#ffeb3b', name: 'Yellow' },
    { color: '#4caf50', name: 'Green' },
    { color: '#ff9800', name: 'Orange' },
    { color: '#f44336', name: 'Red' },
    { color: '#2196f3', name: 'Blue' }
  ];

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    onTotalPagesChange(numPages);
    setLoading(false);
  };

  const changePage = (offset) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      onPageChange(newPage);
    }
  };

  const handleZoom = (delta) => {
    setScale(prevScale => {
      const newScale = prevScale + delta;
      return Math.min(Math.max(0.5, newScale), 3);
    });
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();
    
    if (selectedText.length > 0) {
      const textLayer = pageRef.current.querySelector('.react-pdf__Page__textContent');
      if (!textLayer) return;

      const textLayerRect = textLayer.getBoundingClientRect();
      const rangeRects = Array.from(range.getClientRects());
      
      const positions = rangeRects.map(rect => ({
        top: (rect.top - textLayerRect.top) / scale,
        left: (rect.left - textLayerRect.left) / scale,
        width: rect.width / scale,
        height: rect.height / scale
      }));

      onHighlight({
        text: selectedText,
        pageNumber: pageNumber,
        color: selectedColor,
        positions: positions
      });

      selection.removeAllRanges();
    }
  };

  const renderHighlights = () => {
    const pageHighlights = highlights.filter(h => h.pageNumber === pageNumber);
    
    return pageHighlights.map((highlight, index) => (
      <div key={highlight.id || index} className="highlight-container">
        {(highlight.positions || []).map((position, posIndex) => (
          <div
            key={`${highlight.id}-${posIndex}`}
            className="pdf-highlight"
            style={{
              position: 'absolute',
              top: `${position.top * scale}px`,
              left: `${position.left * scale}px`,
              width: `${position.width * scale}px`,
              height: `${position.height * scale}px`,
              backgroundColor: `${highlight.color}80`, // Adjust opacity for smoothness
              borderRadius: '4px', // Rounded corners for smoothness
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <div className="navigation-controls">
          <button 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1}
            className="control-button"
          >
            Previous
          </button>
          <span>Page {pageNumber} of {numPages || 0}</span>
          <button 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= numPages}
            className="control-button"
          >
            Next
          </button>
        </div>
        <div className="zoom-controls">
          <button 
            onClick={() => handleZoom(-0.1)}
            className="control-button"
          >
            Zoom Out
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button 
            onClick={() => handleZoom(0.1)}
            className="control-button"
          >
            Zoom In
          </button>
        </div>
        <div className="highlight-colors">
          {highlightColors.map(({ color, name }) => (
            <button
              key={color}
              className={`color-button ${selectedColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={name}
            />
          ))}
        </div>
      </div>
      <div 
        className="pdf-container" 
        ref={containerRef}
        onMouseUp={handleTextSelection}
      >
        {loading && <div className="loading">Loading PDF...</div>}
        {file && (
          <div ref={pageRef} className="pdf-page-container">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.error('Error loading PDF:', error)}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page"
              />
              {renderHighlights()}
            </Document>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;