from flask import Flask, jsonify
import mysql.connector  # si usas MySQL

app = Flask(__name__)

from flask_cors import CORS
app = Flask(__name__)
CORS(app)


def get_db_connection():
    conn = mysql.connector.connect(
        host="3.16.155.25",     # ej. "3.234.55.10"
        user="Marcos",
        password="bd2025",
        database="Biblioteca"
    )
    return conn

@app.route("/datos")
def datos():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # EJEMPLO: trae total de libros por categoría
    cursor.execute("SELECT titulo, num_paginas from material_bibliografico")
    
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    data = [["titulo", "num_paginas"]]
    for categoria, total in rows:
        data.append([categoria, int(total)])

    return jsonify(data)

if __name__ == "__main__":
    # para probar local
    app.run(host="0.0.0.0", port=5000, debug=True)
