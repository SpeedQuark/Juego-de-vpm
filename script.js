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

    // Vocabulario
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
        aciertos: 0,
        rachaActual: 0,
        rachaMaxima: 0,
        vidas: 0,
        esCorrecta: false
    };

    // Funciones
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
        
        // 50% de probabilidad de error
        estado.esCorrecta = Math.random() > 0.5;

        switch(estado.dificultad) {
            case 1:
                return estado.esCorrecta 
                    ? `${articulo} ${sustantivo}`
                    : `${randomItem(vocabulario.articulos.filter(a => a !== articulo))} ${sustantivo}`;
            case 2:
                const adjetivo = randomItem(vocabulario.adjetivos);
                return estado.esCorrecta
                    ? `${articulo} ${sustantivo} ${adjetivo}`
                    : `${articulo} ${sustantivo} ${randomItem(vocabulario.adjetivos.filter(a => a !== adjetivo))}`;
            case 3:
                const verbo = randomItem(vocabulario.verbos);
                return estado.esCorrecta
                    ? `${articulo} ${sustantivo} ${randomItem(vocabulario.adjetivos)} ${verbo}`
                    : `${articulo} ${sustantivo} ${randomItem(vocabulario.adjetivos)} ${randomItem(vocabulario.verbos.filter(v => v !== verbo))}`;
        }
    }

    function siguienteFrase() {
        if (estado.intentosTotales <= 0) {
            mostrarResultados();
            return;
        }
        elementos.combo.textContent = generarFrase();
        estado.intentosTotales--;
    }

    function procesarRespuesta(respuesta) {
        if (respuesta === estado.esCorrecta) {
            estado.aciertos++;
            estado.rachaActual++;
            if (estado.rachaActual > estado.rachaMaxima) {
                estado.rachaMaxima = estado.rachaActual;
            }
        } else {
            estado.vidas--;
            elementos.vidasDisplay.textContent = estado.vidas;
            estado.rachaActual = 0;
            if (estado.vidas <= 0) {
                mostrarResultados();
                return;
            }
        }
        siguienteFrase();
    }

    function mostrarResultados() {
        elementos.totalIntentos.textContent = estado.aciertos + (estado.vidasIniciales - estado.vidas);
        elementos.aciertosDisplay.textContent = estado.aciertos;
        elementos.rachaMaxima.textContent = estado.rachaMaxima;
        mostrarPantalla("resultados");
    }

    // Eventos
    elementos.btnComenzar.addEventListener("click", function() {
        estado.dificultad = parseInt(document.getElementById("dificultad").value);
        estado.intentosTotales = parseInt(document.getElementById("intentos").value);
        estado.vidas = Math.max(1, Math.floor(estado.intentosTotales * 0.1));
        estado.vidasIniciales = estado.vidas;
        
        elementos.vidasDisplay.textContent = estado.vidas;
        elementos.nivelDisplay.textContent = `Nivel ${estado.dificultad}`;
        
        estado.aciertos = 0;
        estado.rachaActual = 0;
        estado.rachaMaxima = 0;
        
        mostrarPantalla("juego");
        siguienteFrase();
    });

    elementos.btnCorrecto.addEventListener("click", () => procesarRespuesta(true));
    elementos.btnIncorrecto.addEventListener("click", () => procesarRespuesta(false));
    elementos.btnReintentar.addEventListener("click", () => mostrarPantalla("config"));

    // Inicio
    mostrarPantalla("config");
});