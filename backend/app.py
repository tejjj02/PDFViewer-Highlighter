# backend/app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

UPLOAD_FOLDER = 'uploads'
HIGHLIGHTS_FILE = 'highlights.json'

# Create directories if they don't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize highlights.json if it doesn't exist
if not os.path.exists(HIGHLIGHTS_FILE):
    with open(HIGHLIGHTS_FILE, 'w') as f:
        json.dump({}, f)

def load_highlights():
    try:
        with open(HIGHLIGHTS_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}

def save_highlights(highlights):
    with open(HIGHLIGHTS_FILE, 'w') as f:
        json.dump(highlights, f, indent=2)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Save the file
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    # Initialize highlights for this PDF if not exists
    highlights = load_highlights()
    if file.filename not in highlights:
        highlights[file.filename] = []
        save_highlights(highlights)

    return jsonify({'message': 'File uploaded successfully'})

@app.route('/highlights', methods=['POST'])
def save_highlight():
    data = request.json
    pdf_name = data.get('pdfName')
    
    if not pdf_name:
        return jsonify({'error': 'PDF name is required'}), 400

    highlights = load_highlights()
    
    # Create new highlight with ID and multiple positions
    new_highlight = {
        'id': len(highlights.get(pdf_name, [])) + 1,
        'text': data['text'],
        'pageNumber': data['pageNumber'],
        'positions': data['positions'],  # Now storing multiple positions
        'color': data['color'],
        'timestamp': datetime.now().isoformat()
    }

    if pdf_name not in highlights:
        highlights[pdf_name] = []
    highlights[pdf_name].append(new_highlight)
    
    save_highlights(highlights)
    return jsonify(new_highlight)

@app.route('/highlights/<pdf_name>', methods=['GET'])
def get_highlights(pdf_name):
    highlights = load_highlights()
    return jsonify(highlights.get(pdf_name, []))

@app.route('/highlights/<pdf_name>/<int:highlight_id>', methods=['DELETE'])
def delete_highlight(pdf_name, highlight_id):
    highlights = load_highlights()
    
    if pdf_name in highlights:
        highlights[pdf_name] = [h for h in highlights[pdf_name] if h['id'] != highlight_id]
        save_highlights(highlights)
        
    return jsonify({'message': 'Highlight deleted'})

if __name__ == '__main__':
    app.run(debug=True)