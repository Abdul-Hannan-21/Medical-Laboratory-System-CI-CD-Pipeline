#!/usr/bin/env python3
"""
Simple Flask server to serve the static `public/` site and a health endpoint.
Run locally with a virtual environment:

python -m venv .venv
.venv\Scripts\Activate.ps1   # PowerShell on Windows
pip install -r requirements-python.txt
python scripts/python_server.py

Then open http://localhost:8000
"""
from pathlib import Path
from flask import Flask, send_from_directory, jsonify
import os

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'

app = Flask(__name__, static_folder=str(PUBLIC))


@app.route('/')
def index():
    # serve the CI dashboard by default
    return send_from_directory(app.static_folder, 'ci.html')


@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'source': 'python-server'
    })


@app.route('/<path:path>')
def static_proxy(path):
    # serve static files from public/
    return send_from_directory(app.static_folder, path)


if __name__ == '__main__':
    port = int(os.environ.get('PY_SERVER_PORT', 8000))
    app.run(host='0.0.0.0', port=port)
