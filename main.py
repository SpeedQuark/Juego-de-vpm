import tkinter as tk
from tkinter import messagebox
import random
import time

class SpeedTrainingApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Entrenamiento de Velocidad de Respuesta")
        
        self.articulos = []
        self.sustantivos = []
        self.cargar_palabras()
        
        self.intentos_totales = 0
        self.aciertos = 0
        self.errores = 0
        self.racha_maxima = 0
        self.racha_actual = 0
        self.tiempos_aciertos = []
        self.tiempo_inicio = 0
        
        self.crear_interfaz_inicial()
    
    def cargar_palabras(self):
        with open("palabras.txt", "r") as file:
            lineas = file.readlines()
            for linea in lineas:
                if "artículos:" in linea:
                    self.articulos = linea.strip().split(":")[1].split(",")
                elif "sustantivos:" in linea:
                    self.sustantivos = linea.strip().split(":")[1].split(",")
    
    def crear_interfaz_inicial(self):
        self.frame_inicial = tk.Frame(self.root)
        self.frame_inicial.pack(pady=20)
        
        tk.Label(self.frame_inicial, text="Separación entre palabras (ms):").grid(row=0, column=0, padx=10, pady=5)
        self.entry_separacion = tk.Entry(self.frame_inicial)
        self.entry_separacion.grid(row=0, column=1, padx=10, pady=5)
        
        tk.Label(self.frame_inicial, text="Número de intentos:").grid(row=1, column=0, padx=10, pady=5)
        self.entry_intentos = tk.Entry(self.frame_inicial)
        self.entry_intentos.grid(row=1, column=1, padx=10, pady=5)
        
        tk.Label(self.frame_inicial, text="Tiempo de visualización (ms):").grid(row=2, column=0, padx=10, pady=5)
        self.entry_tiempo = tk.Entry(self.frame_inicial)
        self.entry_tiempo.grid(row=2, column=1, padx=10, pady=5)
        
        tk.Button(self.frame_inicial, text="Comenzar", command=self.iniciar_juego).grid(row=3, column=0, columnspan=2, pady=10)
    
    def iniciar_juego(self):
        try:
            self.separacion = int(self.entry_separacion.get())
            self.intentos_totales = int(self.entry_intentos.get())
            self.tiempo_visualizacion = int(self.entry_tiempo.get())
        except ValueError:
            messagebox.showerror("Error", "Por favor, ingresa valores numéricos válidos.")
            return
        
        self.frame_inicial.pack_forget()
        self.crear_interfaz_juego()
        self.mostrar_siguiente_combinacion()
    
    def crear_interfaz_juego(self):
        self.frame_juego = tk.Frame(self.root)
        self.frame_juego.pack(pady=20)
        
        self.label_combinacion = tk.Label(self.frame_juego, text="", font=("Arial", 24))
        self.label_combinacion.pack(pady=20)
        
        self.frame_botones = tk.Frame(self.frame_juego)
        self.frame_botones.pack(pady=10)
        
        self.boton_incorrecto = tk.Button(self.frame_botones, text="Incorrecto", command=lambda: self.respuesta(False), bg="red", fg="white")
        self.boton_incorrecto.pack(side=tk.LEFT, padx=10)
        
        self.boton_correcto = tk.Button(self.frame_botones, text="Correcto", command=lambda: self.respuesta(True), bg="green", fg="white")
        self.boton_correcto.pack(side=tk.RIGHT, padx=10)
    
    def mostrar_siguiente_combinacion(self):
        if self.intentos_totales <= 0:
            self.mostrar_resultados()
            return
        
        articulo = random.choice(self.articulos)
        sustantivo = random.choice(self.sustantivos)
        self.combinacion_actual = f"{articulo} {sustantivo}"
        self.es_correcta = random.choice([True, False])
        
        if not self.es_correcta:
            sustantivo_incorrecto = random.choice(self.sustantivos)
            while sustantivo_incorrecto == sustantivo:
                sustantivo_incorrecto = random.choice(self.sustantivos)
            self.combinacion_actual = f"{articulo} {sustantivo_incorrecto}"
        
        self.label_combinacion.config(text=self.combinacion_actual)
        self.tiempo_inicio = time.time()
        self.root.after(self.tiempo_visualizacion, self.limpiar_pantalla)
    
    def limpiar_pantalla(self):
        self.label_combinacion.config(text="")
    
    def respuesta(self, es_correcta):
        tiempo_tardado = (time.time() - self.tiempo_inicio) * 1000  # Convertir a ms
        self.intentos_totales -= 1
        
        if es_correcta == self.es_correcta:
            self.aciertos += 1
            self.racha_actual += 1
            if self.racha_actual > self.racha_maxima:
                self.racha_maxima = self.racha_actual
            self.tiempos_aciertos.append(tiempo_tardado)
            mensaje = f"Correcto ({int(tiempo_tardado)} ms)"
            color = "green"
        else:
            self.errores += 1
            self.racha_actual = 0
            mensaje = f"Incorrecto ({int(tiempo_tardado)} ms)"
            color = "red"
        
        self.label_combinacion.config(text=mensaje, fg=color)
        self.root.after(self.separacion, self.mostrar_siguiente_combinacion)
    
    def mostrar_resultados(self):
        self.frame_juego.pack_forget()
        
        self.frame_resultados = tk.Frame(self.root)
        self.frame_resultados.pack(pady=20)
        
        tiempo_medio_aciertos = sum(self.tiempos_aciertos) / len(self.tiempos_aciertos) if self.tiempos_aciertos else 0
        tiempo_medio_total = (sum(self.tiempos_aciertos) + (self.errores * 2000)) / (self.aciertos + self.errores) if (self.aciertos + self.errores) else 0
        
        tk.Label(self.frame_resultados, text="RESULTADOS FINALES", font=("Arial", 16)).pack(pady=10)
        tk.Label(self.frame_resultados, text=f"Intentos totales: {self.aciertos + self.errores}").pack()
        tk.Label(self.frame_resultados, text=f"Aciertos: {self.aciertos}").pack()
        tk.Label(self.frame_resultados, text=f"Errores: {self.errores}").pack()
        tk.Label(self.frame_resultados, text=f"Racha máxima: {self.racha_maxima}").pack()
        tk.Label(self.frame_resultados, text=f"Tiempo medio (solo aciertos): {int(tiempo_medio_aciertos)} ms").pack()
        tk.Label(self.frame_resultados, text=f"Tiempo medio total: {int(tiempo_medio_total)} ms").pack()
        
        tk.Button(self.frame_resultados, text="Reintentar", command=self.reiniciar_juego).pack(pady=10)
    
    def reiniciar_juego(self):
        self.frame_resultados.pack_forget()
        self.intentos_totales = 0
        self.aciertos = 0
        self.errores = 0
        self.racha_maxima = 0
        self.racha_actual = 0
        self.tiempos_aciertos = []
        self.crear_interfaz_inicial()

if __name__ == "__main__":
    root = tk.Tk()
    app = SpeedTrainingApp(root)
    root.mainloop()
