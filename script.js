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
        nivelFinal: document.getElementById("nivel-final"),
        totalIntentos: document.getElementById("total-intentos"),
        aciertosDisplay: document.getElementById("aciertos"),
        erroresDisplay: document.getElementById("errores"),
        vidasFinal: document.getElementById("vidas-final"),
        rachaMaxima: document.getElementById("racha-maxima")
    };

    // Vocabulario completo
    const vocabulario = {
        articulos: ["el", "la", "los", "las", "un", "una", "unos", "unas", "este", "esta", "estos", "estas", "ese", "esa", "esos", "esas", "aquel", "aquella", "aquellos", "aquellas"],
        sustantivos: ["perro", "perros", "gato", "gatos", "libro", "libros", "coche", "coches", "árbol", "árboles", "pan", "pies", "lápiz", "lápices", "reloj", "relojes", "cielo", "cielos", "mar", "mares", "casa", "casas", "mesa", "mesas", "silla", "sillas", "flor", "flores", "playa", "playas", "ciudad", "ciudades", "película", "películas", "canción", "canciones", "nube", "nubes", "día", "mapa", "problema", "sistema", "mano", "foto", "moto", "radio"],
        adjetivos: ["alto", "altos", "bajo", "bajos", "grande", "grandes", "pequeño", "pequeños", "rojo", "rojos", "azul", "azules", "verde", "verdes", "negro", "negros", "alta", "altas", "baja", "bajas", "pequeña", "pequeñas", "roja", "rojas", "negra", "negras", "feliz", "triste", "eficaz", "joven", "débil"],
        verbos: ["correr", "saltar", "leer", "jugar", "cantar", "dormir", "corre", "salta", "lee", "juega", "canta", "duerme", "come", "baila", "escribe", "pinta", "estudia", "trabaja", "va", "hace", "dice", "tiene", "puede", "quiere"]
    };

    // Gramática detallada
    const gramatica = {
        // Artículos
        "el": { genero: "masculino", numero: "singular" },
        "la": { genero: "femenino", numero: "singular" },
        "los": { genero: "masculino", numero: "plural" },
        "las": { genero: "femenino", numero: "plural" },
        "un": { genero: "masculino", numero: "singular" },
        "una": { genero: "femenino", numero: "singular" },
        "unos": { genero: "masculino", numero: "plural" },
        "unas": { genero: "femenino", numero: "plural" },
        "este": { genero: "masculino", numero: "singular" },
        "esta": { genero: "femenino", numero: "singular" },
        "estos": { genero: "masculino", numero: "plural" },
        "estas": { genero: "femenino", numero: "plural" },
        // ... (agregar todos los artículos)
        
        // Sustantivos
        "perro": { genero: "masculino", numero: "singular" },
        "perros": { genero: "masculino", numero: "plural" },
        "gato": { genero: "masculino", numero: "singular" },
        // ... (agregar todos los sustantivos)
    };

    // Estado del juego
    const estado = {
        dificultad: 1,
        intentosTotales: 0,
        intentosRestantes: 0,
        aciertos: 0,
        errores: 0,
        rachaActual: 0,
        rachaMaxima: 0,
        tiemposRespuesta: [],
        tiempoInicio: 0,
        tiempoVisualizacion: 2000,
        esCorrecta: false,
        vidas: 0,
        vidasIniciales: 0,
        porcentajeErrorPermitido: 0.1 // 10%
    };

    // Funciones auxiliares
    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function mostrarPantalla(pantalla) {
        elementos.config.classList.add("hidden");
        elementos.juego.classList.add("hidden");
        elementos.resultados.classList.add("hidden");

        if (pantalla === "config") {
            elementos.config.classList.remove("hidden");
        } else if (pantalla === "juego") {
            elementos.juego.classList.remove("hidden");
        } else if (pantalla === "resultados") {
            elementos.resultados.classList.remove("hidden");
        }
    }

    function generarFrase(nivel) {
        const articulo = randomItem(vocabulario.articulos);
        const sustantivo = randomItem(vocabulario.sustantivos);
        const adjetivo = randomItem(vocabulario.adjetivos);
        const verbo = randomItem(vocabulario.verbos);
        
        // Obtener género y número del sustantivo
        const infoSustantivo = gramatica[sustantivo] || { 
            genero: sustantivo.endsWith('a') ? 'femenino' : 'masculino',
            numero: sustantivo.endsWith('s') ? 'plural' : 'singular'
        };
        
        // 50% de probabilidad de error
        estado.esCorrecta = Math.random() > 0.5;

        switch(nivel) {
            case 1: // Artículo + Sustantivo
                if (estado.esCorrecta) {
                    // Correcto: artículo concuerda
                    const articulosCorrectos = vocabulario.articulos.filter(a => 
                        gramatica[a]?.genero === infoSustantivo.genero && 
                        gramatica[a]?.numero === infoSustantivo.numero
                    );
                    return `${randomItem(articulosCorrectos)} ${sustantivo}`;
                } else {
                    // Incorrecto: artículo no concuerda
                    const articulosIncorrectos = vocabulario.articulos.filter(a => 
                        gramatica[a]?.genero !== infoSustantivo.genero || 
                        gramatica[a]?.numero !== infoSustantivo.numero
                    );
                    return `${randomItem(articulosIncorrectos)} ${sustantivo}`;
                }

            case 2: // + Adjetivo
                let fraseNivel2 = generarFrase(1).split(" ");
                const articuloActual = fraseNivel2[0];
                
                if (estado.esCorrecta) {
                    // Adjetivo correcto
                    const terminacion = infoSustantivo.genero === 'femenino' ? 'a' : 'o';
                    const terminacionNumero = infoSustantivo.numero === 'plural' ? 's' : '';
                    const adjetivosCorrectos = vocabulario.adjetivos.filter(a => 
                        a.endsWith(terminacion + terminacionNumero)
                    );
                    return `${articuloActual} ${sustantivo} ${randomItem(adjetivosCorrectos)}`;
                } else {
                    // Adjetivo incorrecto
                    const adjetivosIncorrectos = vocabulario.adjetivos.filter(a => 
                        !a.endsWith(infoSustantivo.genero === 'femenino' ? 'a' : 'o') || 
                        !a.endsWith(infoSustantivo.numero === 'plural' ? 's' : '')
                    );
                    return `${articuloActual} ${sustantivo} ${randomItem(adjetivosIncorrectos)}`;
                }

            case 3: // + Verbo
                let fraseNivel3 = generarFrase(2);
                if (estado.esCorrecta) {
                    // Verbo conjugado correctamente (simplificado)
                    return `${fraseNivel3} ${randomItem(vocabulario.verbos.filter(v => !v.endsWith('r')))}`;
                } else {
                    // Verbo en infinitivo (error)
                    return `${fraseNivel3} ${randomItem(vocabulario.verbos.filter(v => v.endsWith('r')))}`;
                }
        }
    }

    function mostrarSiguienteCombinacion() {
        if (estado.intentosRestantes <= 0 || estado.vidas <= 0) {
            mostrarResultados();
            return;
        }

        elementos.combo.textContent = generarFrase(estado.dificultad);
        estado.tiempoInicio = Date.now();
        estado.intentosRestantes--;

        setTimeout(() => {
            elementos.combo.textContent = "¿Correcto o Incorrecto?";
        }, estado.tiempoVisualizacion);
    }

    function procesarRespuesta(respuestaUsuario) {
        const tiempoRespuesta = Date.now() - estado.tiempoInicio;
        const acerto = respuestaUsuario === estado.esCorrecta;

        if (!acerto) {
            estado.errores++;
            estado.rachaActual = 0;
            estado.vidas--;
            elementos.vidasDisplay.textContent = estado.vidas;
            document.body.classList.add("perder-vida");
            setTimeout(() => document.body.classList.remove("perder-vida"), 500);
            elementos.combo.className = "incorrecto";
        } else {
            estado.aciertos++;
            estado.rachaActual++;
            if (estado.rachaActual > estado.rachaMaxima) {
                estado.rachaMaxima = estado.rachaActual;
            }
            estado.tiemposRespuesta.push(tiempoRespuesta);
            elementos.combo.className = "correcto";
        }

        elementos.combo.textContent = acerto ? `✓ ${tiempoRespuesta}ms` : `✗ ${tiempoRespuesta}ms`;

        setTimeout(() => {
            elementos.combo.className = "";
            mostrarSiguienteCombinacion();
        }, 1000);
    }

    function mostrarResultados() {
        const tiempoMedio = estado.tiemposRespuesta.length > 0 
            ? Math.round(estado.tiemposRespuesta.reduce((a, b) => a + b, 0) / estado.tiemposRespuesta.length)
            : 0;

        elementos.nivelFinal.textContent = estado.dificultad;
        elementos.totalIntentos.textContent = estado.aciertos + estado.errores;
        elementos.aciertosDisplay.textContent = estado.aciertos;
        elementos.erroresDisplay.textContent = estado.errores;
        elementos.vidasFinal.textContent = estado.vidas;
        elementos.rachaMaxima.textContent = estado.rachaMaxima;

        mostrarPantalla("resultados");
    }

    function reiniciarJuego() {
        estado.aciertos = 0;
        estado.errores = 0;
        estado.rachaActual = 0;
        estado.rachaMaxima = 0;
        estado.tiemposRespuesta = [];
        estado.vidas = estado.vidasIniciales;
        elementos.vidasDisplay.textContent = estado.vidas;
    }

    // Event Listeners
    elementos.btnComenzar.addEventListener("click", function() {
        estado.dificultad = parseInt(document.getElementById("dificultad").value);
        estado.intentosTotales = parseInt(document.getElementById("intentos").value);
        estado.tiempoVisualizacion = parseInt(document.getElementById("tiempo").value);
        
        estado.vidasIniciales = Math.max(1, Math.floor(estado.intentosTotales * estado.porcentajeErrorPermitido));
        estado.vidas = estado.vidasIniciales;
        
        elementos.nivelDisplay.textContent = `Nivel ${estado.dificultad}`;
        elementos.vidasDisplay.textContent = estado.vidas;
        
        reiniciarJuego();
        estado.intentosRestantes = estado.intentosTotales;
        mostrarPantalla("juego");
        mostrarSiguienteCombinacion();
    });

    elementos.btnCorrecto.addEventListener("click", function() {
        procesarRespuesta(true);
    });

    elementos.btnIncorrecto.addEventListener("click", function() {
        procesarRespuesta(false);
    });

    elementos.btnReintentar.addEventListener("click", function() {
        mostrarPantalla("config");
    });

    // Inicialización
    mostrarPantalla("config");
});