from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from backend.hongo import Hongo
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

# Crea la aplicación Flask
app = Flask(__name__)
CORS(app)


# Configura la conexión a la base de datos
app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST")
app.config['MYSQL_USER'] = os.getenv("MYSQL_USER")
app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD")
app.config['MYSQL_DB'] = os.getenv("MYSQL_DB")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")



# Crea una instancia de MySQL
mysql = MySQL(app)

# Rutas para CRUD de Hongos

# Obtener todos los hongos
@app.route('/api/hongos', methods=['GET'])
def get_mushrooms():
    cursor = mysql.connection.cursor()
    sql = 'SELECT * FROM hongos'
    cursor.execute(sql)
    rows = cursor.fetchall()
    print(rows)
    hongos = []
    for fila in rows: #Objeto 
            objHongo = Hongo(fila)
            hongos.append(objHongo.to_json())
    return jsonify(hongos)

# Crear un nuevo hongo
@app.route('/api/hongos', methods=['POST'])
def crear_hongo():
    # Obtener datos del JSON del request
    datos = request.get_json()

    # Validar campos requeridos
    if not datos or not all(campo in datos for campo in ['nombre', 'cepa']):
        return jsonify({"mensaje": "Faltan datos requeridos (nombre y cepa)"}), 400

    # Extraer datos del request
    nombre = datos['nombre']
    cepa = datos['cepa']
    tiempo_fructificacion = datos.get('tiempo_fructificacion')
    color_sombrero = datos.get('color_sombrero')
    color_pie = datos.get('color_pie')
    efectos = datos.get('efectos')
    intensidad = datos.get('intensidad')

    # Crear una nueva entrada en la tabla 'hongos'
    cursor = mysql.connection.cursor()
    sql = 'INSERT INTO hongos (nombre, cepa, tiempo_fructificacion, color_sombrero, color_pie, efectos, intensidad) VALUES (%s, %s, %s, %s, %s, %s, %s)'
    parametros = (nombre, cepa, tiempo_fructificacion, color_sombrero, color_pie, efectos, intensidad)
    cursor.execute(sql, parametros)
    mysql.connection.commit()
    cursor.close()

    # Obtener el ID del hongo creado
    cursor = mysql.connection.cursor()
    sql = 'SELECT LAST_INSERT_ID()'
    cursor.execute(sql)
    hongo_id = cursor.fetchone()[0]
    cursor.close()

    # Crear un objeto Hongo con los datos
    hongo = {
        "id": hongo_id,
        "nombre": nombre,
        "cepa": cepa,
        "tiempo_fructificacion": tiempo_fructificacion,
        "color_sombrero": color_sombrero,
        "color_pie": color_pie,
        "efectos": efectos,
        "intensidad": intensidad
    }

    # Retornar el objeto Hongo en formato JSON
    return jsonify({"mensaje": "Hongo creado exitosamente", "hongo": hongo}), 201




# Actualizar un hongo existente
@app.route('/api/hongos/<int:hongo_id>', methods=['PUT'])
def actualizar_hongo(hongo_id):
    if request.method == 'PUT':
        # Obtener datos del JSON del request
        datos = request.get_json()

        # se obtienen los datos del JSON del request, si no está se establece NONE
        nombre = datos.get('nombre', None)
        cepa = datos.get('cepa', None)
        tiempo_fructificacion = datos.get('tiempoFructificacion', None)
        color_sombrero = datos.get('colorSombrero', None)
        color_pie = datos.get('colorPie', None)
        efectos = datos.get('efectos', None)
        intensidad = datos.get('intensidad', None)

        # Validar que al menos uno de los campos a actualizar esté presente
        if not nombre and not cepa and tiempo_fructificacion is None and color_sombrero is None and color_pie is None and efectos is None and intensidad is None:
            return jsonify({"mensaje": "No se proporcionaron datos para actualizar"}), 400

        # Verificar si el hongo existe
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM hongos WHERE id = %s', (hongo_id,))
        hongo_existente = cursor.fetchone()

        if not hongo_existente:
            cursor.close()
            return jsonify({"mensaje": "No se encontró un hongo con ese ID"}), 404

        # Actualizar los datos del hongo en la tabla 'hongos'
        cursor.execute('UPDATE hongos SET nombre = %s, cepa = %s, tiempo_fructificacion = %s, color_sombrero = %s, color_pie = %s, efectos = %s, intensidad = %s WHERE id = %s',
                        (nombre, cepa, tiempo_fructificacion, color_sombrero, color_pie, efectos, intensidad, hongo_id))
        mysql.connection.commit()
        cursor.close()

        # Retornar un mensaje de éxito
        return jsonify({"mensaje": "Hongo actualizado correctamente"}), 200


# Eliminar un hongo por ID
@app.route('/api/hongos/<int:hongo_id>', methods=['DELETE'])
def eliminar_hongo(hongo_id):
    # Verificar si el hongo a eliminar existe
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM hongos WHERE id = %s', (hongo_id,))
    hongo_existente = cursor.fetchone()
    cursor.close()

    if not hongo_existente:
        return jsonify({"mensaje": "No se encontró un hongo con ese ID"}), 404

    # Eliminar el hongo de la tabla 'hongos' basado en el ID
    cursor = mysql.connection.cursor()
    cursor.execute('DELETE FROM hongos WHERE id = %s', (hongo_id,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"mensaje": "Hongo eliminado exitosamente"}), 200



# Maneja errores 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Página no encontrada'}), 404

# Inicia la aplicación
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
