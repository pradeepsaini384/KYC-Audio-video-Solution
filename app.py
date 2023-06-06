from flask import Flask, render_template, request
from flask_socketio import SocketIO
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save', methods=['POST'])
def save():
    video = request.files['video']
    video.save(os.path.join('Downloads', video.filename))
    return 'OK'

if __name__ == '__main__':
    socketio.run(app, debug=True)
   