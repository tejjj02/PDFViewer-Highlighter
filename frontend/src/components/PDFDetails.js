// components/PDFDetails.js
const PDFDetails = ({ details, currentPage, totalPages }) => {
    if (!details) {
      return (
        <div className="pdf-details">
          <h3>PDF Details</h3>
          <p>No PDF loaded</p>
        </div>
      );
    }
  
    return (
      <div className="pdf-details">
        <h3>PDF Details</h3>
        <div className="details-content">
          <p><strong>Name:</strong> {details.name}</p>
          <p><strong>Size:</strong> {details.size}</p>
          <p><strong>Type:</strong> {details.type}</p>
          <p><strong>Last Modified:</strong> {details.lastModified}</p>
          <p><strong>Current Page:</strong> {currentPage} of {totalPages}</p>
        </div>
      </div>
    );
  };
  
  export default PDFDetails;