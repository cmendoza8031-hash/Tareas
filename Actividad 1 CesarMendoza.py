# Actividad 1

# 1. Clase Cliente (responsabilidad unica: datos del cliente)
# se aplica: SRP, Encapsulamiento, Reutilización
class Cliente:
    def __init__(self, nombre):
        #  Encapsulamiento con __atributo
        self.__nombre = nombre

    # reutilización y simplicidad
    def obtener_nombre(self):
        return self.__nombre

    def __str__(self):
        # imprimir el objeto directamente (Cohesión)
        return self.__nombre

# 2. Clase Reserva (responsabilidad unica: gestión del estado de una transacción)
# se aplica: SRP, Encapsulamiento, Cohesión, Modularidad
class Reserva:
    def __init__(self, cliente, plato):
        # Modularidad: Dependiendo del cliente (composicion)
        self.__cliente = cliente
        self.__plato = plato
        self.__activa = False  # encapsulamiento del estado

    def confirmar(self):
        self.__activa = True

    def cancelar(self):
        self.__activa = False

    # Metodos para reutilización
    def esta_activa(self):
        return self.__activa

    def obtener_cliente(self):
        return self.__cliente

    def obtener_plato(self):
        return self.__plato


# 3. Clase Factura (responsabilidad unica: documentación y pago)
# se aplica: SRP, Cohesión, Modularidad, KISS
class Factura:
    def __init__(self, reserva):
        # Modularidad: depende de reserva (composición)
        self.__reserva = reserva
        self.__precio_simulado = 25.00  # encapsulamiento

    def imprimir_factura(self):
        # simplicidad: se encarga de la obtención de datos a la reserva y cliente
        cliente = self.__reserva.obtener_cliente()
        plato = self.__reserva.obtener_plato()

       
        print("      FACTURA EMITIDA      ")
        print(f"Cliente: {cliente}")
        print(f"Plato: {plato}")
        print(f"Total: ${self.__precio_simulado:.2f}")
       


# 4. Clase Restaurante (responsabilidad unica: coordinación y gestion de recursos)
# se aplica: SRP, Encapsulamiento, OCP, Modularidad
class Restaurante:
    def __init__(self, mesas_totales=10):
        # encapsulamiento del recurso
        self.__mesas_disponibles = mesas_totales
        self.__reservas_activas = []

    # cohesión y modularidad: coordina las tareas delegando responsabilidades
    def hacer_reserva(self, nombre_cliente, plato):
        if self.__mesas_disponibles > 0:
            # crea y utiliza los objetos cliente y reserva
            cliente = Cliente(nombre_cliente)
            nueva_reserva = Reserva(cliente, plato)

            nueva_reserva.confirmar()
            self.__reservas_activas.append(nueva_reserva)
            self.__mesas_disponibles -= 1

            print(f" Reserva exitosa para {cliente}. Mesas restantes: {self.__mesas_disponibles}")
            return nueva_reserva  # se devuelve el objeto para usarlo luego

        print(" No hay mesas disponibles en este momento.")
        return None

    def terminar_y_facturar(self, reserva):
        if reserva.esta_activa():
            # 1. libera el recurso (mesa)
            reserva.cancelar()
            self.__reservas_activas.remove(reserva)
            self.__mesas_disponibles += 1

            # 2. genera la documentación (delega a factura)
            factura = Factura(reserva)
            factura.imprimir_factura()

            print(f" Mesa liberada. Mesas restantes: {self.__mesas_disponibles}")
        else:
            print(" La reserva ya fue cancelada o no existe.")

# =======================================================
# PRUEBA DE EJECUCIÓN (Configuración del Entorno de Desarrollo)
# =======================================================
if __name__ == "__main__":
    print(" - INICIO DE PRUEBA DE SISTEMA MODULAR - ")
    mi_restaurante = Restaurante(mesas_totales=2) # Solo 2 mesas para prueba rápida

    # 1. Reservas de clientes
    res_maria = mi_restaurante.hacer_reserva("María López", "Sushi")
    res_pedro = mi_restaurante.hacer_reserva("Pedro Gómez", "Pizza")

    # 2. Intento de reserva que debe fallar
    print("\n- Intento de reserva fallido -")
    mi_restaurante.hacer_reserva("Ana Martínez", "Ensalada") 

    # 3. Facturación y Liberación de mesa
    print("\n-- Pedro termina y se factura --")
    if res_pedro:
        mi_restaurante.terminar_y_facturar(res_pedro)
    
    # 4. Nueva reserva que ahora debe funcionar (mesa liberada)
    print("\n-- Nueva reserva exitosa --")
    mi_restaurante.hacer_reserva("Juan Nuevo", "Pasta")
    
    print("\n- PRUEBA FINALIZADA -")