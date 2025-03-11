// frontend/src/App.js
import { useState } from 'react';
import PDFViewer from './components/PDFViewer';
import Highlights from './components/Highlights';

export default function Home() {
  const [file, setFile] = useState(null);
  const [highlights, setHighlights] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    
    // Upload to backend
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });
  };

  const handleHighlight = async (highlightData) => {
    const response = await fetch('http://localhost:5000/highlights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...highlightData,
        pdfName: file.name
      })
    });
    const data = await response.json();
    setHighlights([...highlights, { ...highlightData, id: data.id }]);
  };

  const handleDeleteHighlight = async (id) => {
    await fetch(`http://localhost:5000/highlights/${id}`, {
      method: 'DELETE'
    });
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const handleExportHighlights = async () => {
    const response = await fetch(`http://localhost:5000/highlights/${file.name}`);
    const data = await response.json();
    // Handle the export data (e.g., download as JSON)
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'highlights.json';
    a.click();
  };

  return (
    <div className="container">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
      />
      <div className="content">
        <PDFViewer
          file={file}
          onHighlight={handleHighlight}
        />
        <Highlights
          highlights={highlights}
          onDelete={handleDeleteHighlight}
          onExport={handleExportHighlights}
        />
      </div>
    </div>
  );
}