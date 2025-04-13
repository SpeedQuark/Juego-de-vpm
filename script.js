document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const configuracion = document.getElementById("configuracion");
    const juego = document.getElementById("juego");
    const resultados = document.getElementById("resultados");
    const combinacion = document.getElementById("combinacion");
    const botonComenzar = document.getElementById("comenzar");
    const botonIncorrecto = document.getElementById("incorrecto");
    const botonCorrecto = document.getElementById("correcto");
    const botonReintentar = document.getElementById("reintentar");
    const botonCancelar = document.getElementById("cancelar");
    const botonesRespuesta = document.getElementById("botones");

    // Datos del juego
    const articulos = ["el", "la", "un", "una", "los", "las", "unos", "unas"];
    const sustantivos = ["casa", "perro", "gato", "árbol", "coche", "libro", "mesa", "silla"];

    // Variables de estado
    let intentosTotales = 0;
    let aciertos = 0;
    let errores = 0;
    let rachaMaxima = 0;
    let rachaActual = 0;
    let tiemposAciertos = [];
    let tiempoInicio = 0;
    let tiempoVisualizacion = 0;
    let esCorrecta = false;

    // Funciones principales
    function mostrarPantalla(pantalla) {
        configuracion.classList.add("hidden");
        juego.classList.add("hidden");
        resultados.classList.add("hidden");
        botonesRespuesta.classList.add("hidden");
        botonCancelar.classList.add("hidden");

        if (pantalla === "configuracion") configuracion.classList.remove("hidden");
        if (pantalla === "juego") {
            juego.classList.remove("hidden");
            botonesRespuesta.classList.remove("hidden");
            botonCancelar.classList.remove("hidden");
        }
        if (pantalla === "resultados") resultados.classList.remove("hidden");
    }

    function mostrarSiguienteCombinacion() {
        if (intentosTotales <= 0) {
            mostrarResultados();
            return;
        }
        
        const articulo = articulos[Math.floor(Math.random() * articulos.length)];
        const sustantivo = sustantivos[Math.floor(Math.random() * sustantivos.length)];
        esCorrecta = Math.random() > 0.3; // 70% correctas
        
        combinacion.innerHTML = esCorrecta
            ? `${articulo} ${sustantivo}`
            : `${articulo} ${sustantivos.filter(s => s !== sustantivo)[Math.floor(Math.random() * (sustantivos.length-1))]}`;
        
        tiempoInicio = Date.now();
        intentosTotales--;
        
        setTimeout(() => {
            if (intentosTotales >= 0) combinacion.textContent = "";
        }, tiempoVisualizacion);
    }

    function procesarRespuesta(respuestaUsuario) {
        const tiempoRespuesta = Date.now() - tiempoInicio;
        
        if (respuestaUsuario === esCorrecta) {
            aciertos++;
            rachaActual++;
            if (rachaActual > rachaMaxima) rachaMaxima = rachaActual;
            tiemposAciertos.push(tiempoRespuesta);
            combinacion.textContent = `✓ (${tiempoRespuesta}ms)`;
            combinacion.style.color = "#4CAF50";
        } else {
            errores++;
            rachaActual = 0;
            combinacion.textContent = `✗ (${tiempoRespuesta}ms)`;
            combinacion.style.color = "#ff4444";
        }
        
        setTimeout(() => {
            combinacion.textContent = "";
            mostrarSiguienteCombinacion();
        }, 1000);
    }

    function mostrarResultados() {
        document.getElementById("total-intentos").textContent = aciertos + errores;
        document.getElementById("aciertos").textContent = aciertos;
        document.getElementById("errores").textContent = errores;
        document.getElementById("racha-maxima").textContent = rachaMaxima;
        document.getElementById("tiempo-medio").textContent = 
            tiemposAciertos.length > 0 ? Math.round(tiemposAciertos.reduce((a, b) => a + b, 0) / tiemposAciertos.length) : 0;
        
        mostrarPantalla("resultados");
    }

    function reiniciarJuego() {
        aciertos = 0;
        errores = 0;
        rachaMaxima = 0;
        rachaActual = 0;
        tiemposAciertos = [];
    }

    // Event listeners
    botonComenzar.addEventListener("click", () => {
        const separacion = parseInt(document.getElementById("separacion").value);
        intentosTotales = parseInt(document.getElementById("intentos").value);
        tiempoVisualizacion = parseInt(document.getElementById("tiempo").value);
        
        if ([separacion, intentosTotales, tiempoVisualizacion].some(isNaN)) {
            alert("Por favor ingresa valores válidos");
            return;
        }
        
        combinacion.style.gap = `${separacion}px`;
        reiniciarJuego();
        mostrarPantalla("juego");
        mostrarSiguienteCombinacion();
    });

    botonCorrecto.addEventListener("click", () => procesarRespuesta(true));
    botonIncorrecto.addEventListener("click", () => procesarRespuesta(false));
    botonReintentar.addEventListener("click", () => mostrarPantalla("configuracion"));
    botonCancelar.addEventListener("click", () => {
        if (confirm("¿Cancelar el entrenamiento?")) mostrarPantalla("configuracion");
    });

    // Iniciar
    mostrarPantalla("configuracion");
});