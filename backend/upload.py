from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

UPLOAD_FOLDER = '/home/george/Downloads/backend' # Update the upload folder path
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'mp4', 'mp3'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file extension'}), 400

    filename = secure_filename(file.filename) # Secure the filename
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    selected_option = request.form.get('selectedOption') # Get the selected option
    slider_value = request.form.get('sliderValue') # Get the slider value

    print("Received file:", filename)
    print("Selected option:", selected_option)
    print("Slider value:", slider_value)

    return jsonify({'message': 'File uploaded successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
