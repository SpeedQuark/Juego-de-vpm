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
        vidasDisplay: document.getElementById("vidas-restantes"),
        nivelDisplay: document.getElementById("nivel-actual"),
        totalIntentos: document.getElementById("total-intentos"),
        aciertosDisplay: document.getElementById("aciertos"),
        rachaMaxima: document.getElementById("racha-maxima")
    };

    // Vocabulario completo
    const vocabulario = {
        articulos: ["el", "la", "los", "las", "un", "una", "unos", "unas"],
        sustantivos: ["perro", "gato", "casa", "árbol", "libro", "mesa", "flor", "ciudad"],
        adjetivos: ["grande", "pequeño", "rojo", "azul", "alto", "bajo"],
        verbos: ["corre", "salta", "lee", "juega", "canta"]
    };

    // Estado del juego
    const estado = {
        dificultad: 1,
        intentosTotales: 0,
        intentosRestantes: 0,
        aciertos: 0,
        rachaActual: 0,
        rachaMaxima: 0,
        vidas: 0,
        esCorrecta: false
    };

    // Funciones básicas
    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function mostrarPantalla(pantalla) {
        elementos.config.classList.add("hidden");
        elementos.juego.classList.add("hidden");
        elementos.resultados.classList.add("hidden");
        document.getElementById(pantalla).classList.remove("hidden");
    }

    function generarFrase() {
        const articulo = randomItem(vocabulario.articulos);
        const sustantivo = randomItem(vocabulario.sustantivos);
        
        // 50% de probabilidad de error gramatical
        estado.esCorrecta = Math.random() > 0.5;

        switch(estado.dificultad) {
            case 1: // Artículo + Sustantivo
                if (estado.esCorrecta) {
                    return `${articulo} ${sustantivo}`;
                } else {
                    // Forzar error de concordancia
                    const articuloIncorrecto = randomItem(
                        vocabulario.articulos.filter(a => a !== articulo)
                    );
                    return `${articuloIncorrecto} ${sustantivo}`;
                }
                
            case 2: // + Adjetivo
                const adjetivo = randomItem(vocabulario.adjetivos);
                if (estado.esCorrecta) {
                    return `${articulo} ${sustantivo} ${adjetivo}`;
                } else {
                    // Adjetivo con error de concordancia
                    return `${articulo} ${sustantivo} ${adjetivo}x`;
                }
                
            case 3: // + Verbo
                const verbo = randomItem(vocabulario.verbos);
                if (estado.esCorrecta) {
                    return `${articulo} ${sustantivo} ${randomItem(vocabulario.adjetivos)} ${verbo}`;
                } else {
                    // Verbo en infinitivo (error)
                    return `${articulo} ${sustantivo} ${randomItem(vocabulario.adjetivos)} ${verbo}r`;
                }
        }
    }

    function iniciarJuego() {
        estado.dificultad = parseInt(document.getElementById("dificultad").value);
        estado.intentosTotales = parseInt(document.getElementById("intentos").value);
        estado.intentosRestantes = estado.intentosTotales;
        
        // Calcular vidas (10% de intentos)
        estado.vidas = Math.max(1, Math.floor(estado.intentosTotales * 0.1));
        
        // Reiniciar contadores
        estado.aciertos = 0;
        estado.rachaActual = 0;
        estado.rachaMaxima = 0;
        
        // Actualizar UI
        elementos.vidasDisplay.textContent = estado.vidas;
        elementos.nivelDisplay.textContent = `Nivel ${estado.dificultad}`;
        
        mostrarPantalla("juego");
        mostrarSiguienteFrase();
    }

    function mostrarSiguienteFrase() {
        if (estado.intentosRestantes <= 0 || estado.vidas <= 0) {
            mostrarResultados();
            return;
        }
        
        elementos.combo.textContent = generarFrase();
        estado.intentosRestantes--;
    }

    function procesarRespuesta(respuestaUsuario) {
        if (respuestaUsuario === estado.esCorrecta) {
            estado.aciertos++;
            estado.rachaActual++;
            if (estado.rachaActual > estado.rachaMaxima) {
                estado.rachaMaxima = estado.rachaActual;
            }
        } else {
            estado.vidas--;
            elementos.vidasDisplay.textContent = estado.vidas;
            estado.rachaActual = 0;
        }
        mostrarSiguienteFrase();
    }

    function mostrarResultados() {
        elementos.totalIntentos.textContent = estado.intentosTotales;
        elementos.aciertosDisplay.textContent = estado.aciertos;
        elementos.rachaMaxima.textContent = estado.rachaMaxima;
        mostrarPantalla("resultados");
    }

    // Event listeners
    elementos.btnComenzar.addEventListener("click", iniciarJuego);
    elementos.btnCorrecto.addEventListener("click", () => procesarRespuesta(true));
    elementos.btnIncorrecto.addEventListener("click", () => procesarRespuesta(false));
    elementos.btnReintentar.addEventListener("click", () => mostrarPantalla("config"));

    // Iniciar en pantalla de configuración
    mostrarPantalla("config");
});