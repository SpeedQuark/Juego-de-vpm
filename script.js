document.addEventListener("DOMContentLoaded", function() {
    // Configuración inicial
    const config = {
        articulos: ["el", "la", "los", "las", "un", "una", "unos", "unas"],
        sustantivos: ["perro", "gato", "casa", "libro", "mesa", "flor"],
        adjetivos: ["grande", "pequeño", "rojo", "azul"],
        verbos: ["corre", "salta", "lee"]
    };

    // Estado del juego
    const estado = {
        dificultad: 1,
        intentos: 0,
        vidas: 0,
        aciertos: 0,
        racha: 0,
        rachaMaxima: 0,
        esCorrecta: false
    };

    // Elementos del DOM
    const UI = {
        config: document.getElementById("configuracion"),
        juego: document.getElementById("juego"),
        resultados: document.getElementById("resultados"),
        combo: document.getElementById("combinacion"),
        vidas: document.getElementById("vidas-restantes"),
        nivel: document.getElementById("nivel-actual"),
        aciertos: document.getElementById("aciertos"),
        totalIntentos: document.getElementById("total-intentos"),
        rachaMaxima: document.getElementById("racha-maxima")
    };

    // Funciones clave
    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generarFrase() {
        const articulo = randomItem(config.articulos);
        const sustantivo = randomItem(config.sustantivos);
        estado.esCorrecta = Math.random() > 0.5;

        switch(estado.dificultad) {
            case 1:
                return estado.esCorrecta 
                    ? `${articulo} ${sustantivo}`
                    : `${randomItem(config.articulos.filter(a => a !== articulo))} ${sustantivo}`;
            case 2:
                return estado.esCorrecta
                    ? `${articulo} ${sustantivo} ${randomItem(config.adjetivos)}`
                    : `${articulo} ${sustantivo} ${randomItem(config.adjetivos)}x`;
            case 3:
                return estado.esCorrecta
                    ? `${articulo} ${sustantivo} ${randomItem(config.adjetivos)} ${randomItem(config.verbos)}`
                    : `${articulo} ${sustantivo} ${randomItem(config.adjetivos)} ${randomItem(config.verbos)}r`;
        }
    }

    function comenzarJuego() {
        estado.dificultad = parseInt(document.getElementById("dificultad").value);
        estado.intentos = parseInt(document.getElementById("intentos").value);
        estado.vidas = Math.max(1, Math.floor(estado.intentos * 0.1));
        
        UI.vidas.textContent = estado.vidas;
        UI.nivel.textContent = estado.dificultad;
        UI.config.classList.add("hidden");
        UI.juego.classList.remove("hidden");
        
        siguienteFrase();
    }

    function siguienteFrase() {
        if (estado.intentos <= 0 || estado.vidas <= 0) {
            finJuego();
            return;
        }
        UI.combo.textContent = generarFrase();
        estado.intentos--;
    }

    function finJuego() {
        UI.totalIntentos.textContent = estado.aciertos + (estado.vidasIniciales - estado.vidas);
        UI.aciertos.textContent = estado.aciertos;
        UI.rachaMaxima.textContent = estado.rachaMaxima;
        UI.juego.classList.add("hidden");
        UI.resultados.classList.remove("hidden");
    }

    function evaluar(respuesta) {
        if (respuesta === estado.esCorrecta) {
            estado.aciertos++;
            estado.racha++;
            estado.rachaMaxima = Math.max(estado.racha, estado.rachaMaxima);
        } else {
            estado.vidas--;
            UI.vidas.textContent = estado.vidas;
            estado.racha = 0;
        }
        siguienteFrase();
    }

    // Eventos
    document.getElementById("comenzar").addEventListener("click", comenzarJuego);
    document.getElementById("correcto").addEventListener("click", () => evaluar(true));
    document.getElementById("incorrecto").addEventListener("click", () => evaluar(false));
    document.getElementById("reintentar").addEventListener("click", () => {
        UI.resultados.classList.add("hidden");
        UI.config.classList.remove("hidden");
    });
});