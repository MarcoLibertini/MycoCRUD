class Hongo:
    def __init__(self, fila):
        self._id = fila[0]
        self._nombre = fila[1]
        self._cepa = fila[2]
        self._tiempo_fructificacion = fila[3]
        self._color_sombrero = fila[4]
        self._color_pie = fila[5]
        self._efectos = fila[6]
        self._intensidad = fila[7]
        

    def to_json(self):
        return {
            "id": self._id,
            "nombre": self._nombre,
            "cepa": self._cepa,
            "tiempo_fructificacion": self._tiempo_fructificacion,
            "color_sombrero": self._color_sombrero,
            "color_pie": self._color_pie,
            "efectos": self._efectos,
            "intensidad": self._intensidad,
            
        }

