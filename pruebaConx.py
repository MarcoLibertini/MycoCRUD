import mysql.connector

# Define la información de conexión
host = "localhost"
user = "root"
password = "1234"
database = "dbmushroom"

try:
    # Crea una conexión a la base de datos
    connection = mysql.connector.connect(
        host=host, user=user, password=password, database=database
    )

    # Si la conexión se realiza correctamente, se ejecuta este código
    print("¡Conectado a la base de datos!")

    # Cierra la conexión
    connection.close()

except Exception as e:
    # Si hay un error, se muestra el mensaje de error
    print(f"Error al conectar a la base de datos: {e}")
