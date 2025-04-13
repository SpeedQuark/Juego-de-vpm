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

    // Vocabulario
    const vocabulario = {
        articulos: ["el", "la", "un", "una", "los", "las", "unos", "unas", "este", "esta"],
        sustantivos: ["casa", "perro", "gato", "árbol", "coche", "libro", "mesa", "silla", "ciudad", "flor"],
        adjetivos: ["grande", "pequeño", "rojo", "azul", "alto", "bajo", "bonito"],
        verbos: ["corre", "salta", "lee", "juega", "canta"]
    };

    // Gramática
    const gramatica = {
        "el": { genero: "masculino", numero: "singular" },
        "la": { genero: "femenino", numero: "singular" },
        "los": { genero: "masculino", numero: "plural" },
        "las": { genero: "femenino", numero: "plural" },
        "un": { genero: "masculino", numero: "singular" },
        "una": { genero: "femenino", numero: "singular" },
        "unos": { genero: "masculino", numero: "plural" },
        "unas": { genero: "femenino", numero: "plural" },
        "este": { genero: "masculino", numero: "singular" },
        "esta": { genero: "femenino", numero: "singular" }
    };

    // Estado del juego
    const estado = {
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
        dificultad: 1
    };

    // Funciones auxiliares
    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function mostrarPantalla(pantalla) {
        elementos.config.classList.add("hidden");
        elementos.juego.classList.add("hidden");
        elementos.resultados.classList.add("hidden");
        elementos.botonesRespuesta.classList.add("hidden");

        if (pantalla === "config") {
            elementos.config.classList.remove("hidden");
        } else if (pantalla === "juego") {
            elementos.juego.classList.remove("hidden");
            elementos.botonesRespuesta.classList.remove("hidden");
        } else if (pantalla === "resultados") {
            elementos.resultados.classList.remove("hidden");
        }
    }

    function generarFrase() {
        const sustantivo = randomItem(vocabulario.sustantivos);
        const { genero, numero } = gramatica[sustantivo] || { genero: "masculino", numero: "singular" };
        
        // 50% de probabilidad de ser correcta o incorrecta
        estado.esCorrecta = Math.random() > 0.5;
        
        // Seleccionar artículo
        let articulo;
        if (estado.esCorrecta) {
            articulo = randomItem(vocabulario.articulos.filter(a => 
                gramatica[a].genero === genero && 
                gramatica[a].numero === numero
            ));
        } else {
            articulo = randomItem(vocabulario.articulos.filter(a => 
                gramatica[a].genero !== genero || 
                gramatica[a].numero !== numero
            ));
        }
        
        // Construir frase según dificultad
        let frase = `${articulo} ${sustantivo}`;
        
        if (estado.dificultad === 2) {
            if (Math.random() > 0.5) { // Adjetivo
                let adjetivo = randomItem(vocabulario.adjetivos);
                
                if (!estado.esCorrecta && Math.random() > 0.5) {
                    // Hacer adjetivo incorrecto
                    adjetivo = randomItem(vocabulario.adjetivos.filter(a => 
                        gramatica[a]?.genero !== genero || 
                        gramatica[a]?.numero !== numero
                    ));
                }
                
                frase += ` ${adjetivo}`;
            } else { // Verbo
                frase += ` ${randomItem(vocabulario.verbos)}`;
            }
        }
        
        return frase;
    }

    function mostrarSiguienteCombinacion() {
        if (estado.intentosRestantes <= 0) {
            mostrarResultados();
            return;
        }
        
        elementos.combo.textContent = generarFrase();
        elementos.combo.style.color = "#000"; // Negro para la frase
        estado.tiempoInicio = Date.now();
        estado.intentosRestantes--;
        
        setTimeout(() => {
            elementos.combo.textContent = "";
        }, estado.tiempoVisualizacion);
    }

    function procesarRespuesta(respuestaUsuario) {
        const tiempoRespuesta = Date.now() - estado.tiempoInicio;
        
        if (respuestaUsuario === estado.esCorrecta) {
            estado.aciertos++;
            estado.rachaActual++;
            if (estado.rachaActual > estado.rachaMaxima) {
                estado.rachaMaxima = estado.rachaActual;
            }
            estado.tiemposRespuesta.push(tiempoRespuesta);
            elementos.combo.textContent = `✓ ${tiempoRespuesta}ms`;
            elementos.combo.className = "correcto";
        } else {
            estado.errores++;
            estado.rachaActual = 0;
            elementos.combo.textContent = `✗ ${tiempoRespuesta}ms`;
            elementos.combo.className = "incorrecto";
        }
        
        setTimeout(() => {
            elementos.combo.textContent = "";
            elementos.combo.className = "";
            mostrarSiguienteCombinacion();
        }, 1000);
    }

    function mostrarResultados() {
        const tiempoMedio = estado.tiemposRespuesta.length > 0 
            ? Math.round(estado.tiemposRespuesta.reduce((a, b) => a + b, 0) / estado.tiemposRespuesta.length)
            : 0;
        
        document.getElementById("total-intentos").textContent = estado.aciertos + estado.errores;
        document.getElementById("aciertos").textContent = estado.aciertos;
        document.getElementById("errores").textContent = estado.errores;
        document.getElementById("racha-maxima").textContent = estado.rachaMaxima;
        document.getElementById("tiempo-medio").textContent = tiempoMedio;
        
        mostrarPantalla("resultados");
    }

    function reiniciarJuego() {
        estado.aciertos = 0;
        estado.errores = 0;
        estado.rachaActual = 0;
        estado.rachaMaxima = 0;
        estado.tiemposRespuesta = [];
    }

    // Event Listeners
    elementos.btnComenzar.addEventListener("click", function() {
        estado.dificultad = parseInt(document.getElementById("dificultad").value);
        estado.intentosTotales = parseInt(document.getElementById("intentos").value);
        estado.tiempoVisualizacion = parseInt(document.getElementById("tiempo").value);
        const separacion = parseInt(document.getElementById("separacion").value);
        
        if (isNaN(estado.intentosTotales) || isNaN(estado.tiempoVisualizacion) || isNaN(separacion)) {
            alert("Por favor ingresa valores válidos");
            return;
        }
        
        estado.intentosRestantes = estado.intentosTotales;
        elementos.combo.style.gap = `${separacion}px`;
        reiniciarJuego();
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