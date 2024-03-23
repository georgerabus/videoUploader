from flask import Flask, request, send_file


# Set up Flask app
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

@app.route("/", methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        prompt = request.json.get('url', '')
        if prompt:
            print(prompt)
            return "Waau"
        else:
            return "No prompt provided", 400
    else:
        return "Please send a POST request with a url", 200

# Set up ngrok
port_no = 5000

# Run the app
app.run(port=port_no)