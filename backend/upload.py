from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def upload():
    if request.method == 'GET':
        return "GET request received", 200

    if 'file' not in request.files:
        return "No file part", 400
    
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    # Read the file as binary data
    file_data = file.read()

    # Print some debugging information
    print("Received file:", file.filename)

    # Handle file upload logic here, for example, save the file to disk
    save_path = '/home/george/Downloads/backend/' + file.filename
    try:
        with open(save_path, 'wb') as f:
            f.write(file_data)
        print("File saved successfully to:", save_path)
        return "Upload successful", 200
    except Exception as e:
        print("Error saving file:", str(e))
        return "Failed to save file", 500

if __name__ == "__main__":
    app.run(port=5000)
