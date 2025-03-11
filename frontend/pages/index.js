// pages/index.js
import { useState, useCallback, useEffect } from 'react';
import PDFViewer from '../src/components/PDFViewer';
import Highlights from '../src/components/Highlights';
import PDFDetails from '../src/components/PDFDetails';
import ErrorBoundary from '../src/components/ErrorBoundary';

export default function Home() {
  const [file, setFile] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDetails, setPdfDetails] = useState(null);

  const loadHighlights = async (pdfName) => {
    try {
      const response = await fetch(`http://localhost:5000/highlights/${pdfName}`);
      if (response.ok) {
        const data = await response.json();
        setHighlights(data);
      }
    } catch (error) {
      console.error('Error loading highlights:', error);
      setError('Failed to load highlights');
    }
  };

  const handleFileUpload = useCallback(async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      // Create a blob URL for the PDF
      const fileUrl = URL.createObjectURL(uploadedFile);
      setFile(fileUrl);
      
      setPdfDetails({
        name: uploadedFile.name,
        size: `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`,
        type: uploadedFile.type,
        lastModified: new Date(uploadedFile.lastModified).toLocaleDateString()
      });

      // Upload to backend
      const formData = new FormData();
      formData.append('file', uploadedFile);
      
      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          // Load highlights for this PDF
          await loadHighlights(uploadedFile.name);
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload file');
      }
    }
  }, []);

  const handleHighlight = async (highlightData) => {
    try {
      const response = await fetch('http://localhost:5000/highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...highlightData,
          pdfName: pdfDetails?.name
        })
      });

      if (response.ok) {
        const newHighlight = await response.json();
        setHighlights(prev => [...prev, newHighlight]);
      } else {
        throw new Error('Failed to save highlight');
      }
    } catch (error) {
      console.error('Error saving highlight:', error);
      setError('Failed to save highlight');
    }
  };

  const handleDeleteHighlight = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/highlights/${pdfDetails.name}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setHighlights(prev => prev.filter(h => h.id !== id));
      } else {
        throw new Error('Failed to delete highlight');
      }
    } catch (error) {
      console.error('Error deleting highlight:', error);
      setError('Failed to delete highlight');
    }
  };

  const handleExportHighlights = async () => {
    try {
      const response = await fetch(`http://localhost:5000/highlights/${pdfDetails?.name}`);
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `highlights_${pdfDetails.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting highlights:', error);
      setError('Failed to export highlights');
    }
  };

  // Clean up blob URL when component unmounts or new file is uploaded
  useEffect(() => {
    return () => {
      if (file && file.startsWith('blob:')) {
        URL.revokeObjectURL(file);
      }
    };
  }, [file]);

  return (
    <div className="app-container">
      <div className="pdf-upload">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>
      <div className="main-content">
        <div className="left-sidebar">
          <PDFDetails 
            details={pdfDetails}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
        <div className="pdf-container">
          <ErrorBoundary>
            <PDFViewer
              file={file}
              onHighlight={handleHighlight}
              onPageChange={setCurrentPage}
              onTotalPagesChange={setTotalPages}
              highlights={highlights}
            />
          </ErrorBoundary>
        </div>
        <div className="right-sidebar">
          <Highlights
            highlights={highlights}
            onDelete={handleDeleteHighlight}
            onExport={handleExportHighlights}
          />
        </div>
      </div>
    </div>
  );
}