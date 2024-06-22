from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image, ImageFilter
import io
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
EDITED_FOLDER = 'edited'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EDITED_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200

@app.route('/edit', methods=['POST'])
def edit_image():
    data = request.json
    file_path = data.get('file_path')
    action = data.get('action')
    
    if not file_path or not action:
        return jsonify({'error': 'Invalid request'}), 400
    
    try:
        img = Image.open(file_path)
        if action == 'crop':
            img = img.crop((100, 100, 400, 400))
        elif action == 'resize':
            img = img.resize((200, 200))
        elif action == 'filter':
            img = img.filter(ImageFilter.BLUR)
        
        edited_path = os.path.join(EDITED_FOLDER, os.path.basename(file_path))
        img.save(edited_path)
        return jsonify({'message': 'Image edited successfully', 'edited_path': edited_path}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download_image(filename):
    file_path = os.path.join(EDITED_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)