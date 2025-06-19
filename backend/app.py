from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Use environment variable or fallback local
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql+pymysql://admin:password@localhost:3306/userdata')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class UserEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notes = db.Column(db.Text)
    date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "message": self.message,
            "notes": self.notes,
            "date": self.date.strftime('%Y-%m-%d')
        }

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    new_entry = UserEntry(
        name=data['name'],
        email=data['email'],
        message=data['message'],
        notes=data['notes'],
        date=datetime.strptime(data['date'], '%Y-%m-%d')
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"message": "Data stored successfully."}), 201

@app.route('/entries/<name>', methods=['GET'])
def get_entries(name):
    entries = UserEntry.query.filter_by(name=name).all()
    return jsonify([e.to_dict() for e in entries])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
