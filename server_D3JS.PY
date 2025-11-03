from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

@app.route("/datos")
def datos():
    try:
        conn = mysql.connector.connect(
            host="3.16.155.25",
            port=3306,
            user="Marcos",
            password="bd2025",
            database="biblioteca"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT id_material, titulo, num_paginas FROM Material_bibliografico WHERE num_paginas IS NOT NULL AND num_paginas > 0;")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        # ⚠️ Aquí el cambio importante: no convertir id_material a int
        data = [
            {
                "id": r[0],  # puede ser texto como 'M-0001'
                "titulo": r[1],
                "paginas": int(r[2]) if r[2] else 0
            }
            for r in rows
        ]

        print(f"📦 Datos enviados: {len(data)} registros")
        return jsonify(data)
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
