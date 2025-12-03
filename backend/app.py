from flask import Flask, request, jsonify
import pyodbc
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow all origins


# MS SQL connection
conn_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=BAND-C-00164\\SQLEXPRESS;"
    "DATABASE=TodoApp;"
    "UID=raj;"
    "PWD=#@Raj270598$;"
)

def get_conn():
    return pyodbc.connect(conn_str)

@app.route("/tasks", methods=["GET"])
def get_tasks():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, completed FROM Tasks")
    tasks = [{"id": row[0], "title": row[1], "completed": row[2]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(tasks)

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Tasks (title, completed) VALUES (?, 0)", (data["title"],))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added"}), 201

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("UPDATE Tasks SET completed=? WHERE id=?", (data["completed"], task_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task updated"})

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Tasks WHERE id=?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task deleted"})


if __name__ == "__main__":
    app.run(debug=True)
