# PDF Highlighter

PDF Highlighter is a web application that allows users to upload, view, and highlight text in PDF documents. The application provides a user-friendly interface for selecting text, choosing highlight colors, and managing highlights.

## Tech Stack

- **Frontend:** Next.js, React, PDF.js
- **Backend:** Flask, Python
- **Storage:** JSON file for highlights

## Features

- Upload and view PDF documents
- Highlight text with multiple colors
- Zoom in/out and navigate pages
- Store highlights locally in JSON format
- Responsive UI with sidebar for highlights

## PDF.js Library

The application uses PDF.js to render PDF documents in the browser. PDF.js is a powerful library that provides a complete solution for displaying PDFs, including text selection and annotation layers.

## UI Elements

- **PDF Viewer:** Displays the PDF with text selection and highlighting capabilities.
- **Highlight Colors:** Allows users to choose from multiple colors for highlighting.
- **Navigation Controls:** Provides buttons for page navigation and zooming.
- **Highlights Sidebar:** Displays a list of all highlights with options to delete or export.

## Python Backend

The backend is built with Flask and handles file uploads and highlight management. Highlights are stored in a JSON file, making it easy to manage and retrieve data.

## Setup Project

### Clone the Repository

1. Open your terminal and navigate to the directory where you want to clone the project.
2. Run the following command:

   ```bash
   git clone https://github.com/tejjj02/PDFViewer-Highlighter.git
   cd PDFViewer-Highlighter

### Set Backend

1. Navigate to backend:

   ```bash
   cd backend

2. Create a virtual environment.
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

3. Install the requirements.
   ```bash
   pip install -r requirements.txt

4. Run Flask server
   ```bash
   pip install -r requirements.txt


### Set Frontend

1. Navigate to frontend:

   ```bash
   cd frontend

2. Install required packages.
   ```bash
   npm install

3. Start the dev server.
   ```bash
   npm run dev

### Server available at - http://localhost:3000
  

