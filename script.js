document.addEventListener("DOMContentLoaded", function() {
    // Elementos del DOM
    const elementos = {
        config: document.getElementById("configuracion"),
        juego: document.getElementById("juego"),
        resultados: document.getElementById("resultados"),
        combo: document.getElementById("combinacion"),
        btnComenzar: document.getElementById("comenzar"),
        btnIncorrecto: document.getElementById("incorrecto"),
        btnCorrecto: document.getElementById("correcto"),
        btnReintentar: document.getElementById("reintentar"),
        botonesRespuesta: document.getElementById("botones")
    };

    // Verificación inicial
    console.log("Botón Comenzar:", elementos.btnComenzar);
    if (!elementos.btnComenzar) {
        alert("Error crítico: No se encontró el botón Comenzar");
        return;
    }

    // Vocabulario
    const vocabulario = {
        articulos: ["el", "la", "un", "una", "los", "las", "unos", "unas"],
        sustantivos: ["casa", "perro", "gato", "árbol", "coche", "libro", "mesa", "silla"],
        adjetivos: ["grande", "pequeño", "rojo", "azul"],
        verbos: ["corre", "salta", "lee", "juega"]
    };

    // Estado del juego
    const estado = {
        dificultad: 1,
        intentos: 0,
        aciertos: 0,
        errores: 0,
        racha: 0,
        rachaMax: 0,
        tiempos: [],
        esCorrecta: false
    };

    // Función para mostrar pantallas
    function mostrarPantalla(pantalla) {
        elementos.config.classList.add("hidden");
        elementos.juego.classList.add("hidden");
        elementos.resultados.classList.add("hidden");
        elementos.botonesRespuesta.classList.add("hidden");

        if (pantalla === "config") elementos.config.classList.remove("hidden");
        if (pantalla === "juego") {
            elementos.juego.classList.remove("hidden");
            elementos.botonesRespuesta.classList.remove("hidden");
        }
        if (pantalla === "resultados") elementos.resultados.classList.remove("hidden");
    }

    // Evento del botón Comenzar
    elementos.btnComenzar.addEventListener("click", function() {
        estado.dificultad = parseInt(document.getElementById("dificultad").value);
        estado.intentos = parseInt(document.getElementById("intentos").value);
        const tiempoVisualizacion = parseInt(document.getElementById("tiempo").value);
        const separacion = parseInt(document.getElementById("separacion").value);

        // Validación
        if (isNaN(estado.intentos) {
            alert("Por favor ingresa un número válido de intentos");
            return;
        }

        // Iniciar juego
        estado.aciertos = 0;
        estado.errores = 0;
        estado.racha = 0;
        estado.rachaMax = 0;
        estado.tiempos = [];
        
        elementos.combo.style.gap = `${separacion}px`;
        mostrarPantalla("juego");
        generarFrase();
    });

    // [Resto de las funciones del juego...]
    
    // Inicialización
    mostrarPantalla("config");
});