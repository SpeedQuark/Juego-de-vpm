document.addEventListener("DOMContentLoaded", function() {
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

    // Vocabulario
    const articulos = ["el", "la", "un", "una", "los", "las", "unos", "unas", "este", "esta", "estos", "estas"];
    const sustantivos = ["casa", "perro", "gato", "árbol", "coche", "libro", "mesa", "silla", "ciudad", "flor"];
    const adjetivos = ["grande", "pequeño", "rojo", "azul", "alto", "bajo", "bonito", "feo"];
    const verbos = ["corre", "salta", "lee", "juega", "canta", "dibuja"];

    // Gramática
    const generoNumero = {
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
        "estas": { genero: "femenino", numero: "plural" }
    };

    const diccionario = {
        "casa": { genero: "femenino", numero: "singular" },
        "perro": { genero: "masculino", numero: "singular" },
        "gato": { genero: "masculino", numero: "singular" },
        "árbol": { genero: "masculino", numero: "singular" },
        "coche": { genero: "masculino", numero: "singular" },
        "libro": { genero: "masculino", numero: "singular" },
        "mesa": { genero: "femenino", numero: "singular" },
        "silla": { genero: "femenino", numero: "singular" },
        "ciudad": { genero: "femenino", numero: "singular" },
        "flor": { genero: "femenino", numero: "singular" },
        "grande": { genero: "ambos", numero: "ambos" },
        "pequeño": { genero: "masculino", numero: "singular" },
        "pequeña": { genero: "femenino", numero: "singular" },
        "rojo": { genero: "masculino", numero: "singular" },
        "roja": { genero: "femenino", numero: "singular" },
        "azul": { genero: "ambos", numero: "ambos" },
        "alto": { genero: "masculino", numero: "singular" },
        "alta": { genero: "femenino", numero: "singular" },
        "bajo": { genero: "masculino", numero: "singular" },
        "baja": { genero: "femenino", numero: "singular" },
        "bonito": { genero: "masculino", numero: "singular" },
        "bonita": { genero: "femenino", numero: "singular" },
        "feo": { genero: "masculino", numero: "singular" },
        "fea": { genero: "femenino", numero: "singular" }
    };

    // Estado del juego
    let estado = {
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
        configuracion.classList.add("hidden");
        juego.classList.add("hidden");
        resultados.classList.add("hidden");
        botonesRespuesta.classList.add("hidden");
        botonCancelar.classList.add("hidden");

        if (pantalla === "configuracion") {
            configuracion.classList.remove("hidden");
        } else if (pantalla === "juego") {
            juego.classList.remove("hidden");
            botonesRespuesta.classList.remove("hidden");
            botonCancelar.classList.remove("hidden");
        } else if (pantalla === "resultados") {
            resultados.classList.remove("hidden");
        }
    }

    function verificarConcordancia(articulo, palabra) {
        if (!generoNumero[articulo] || !diccionario[palabra]) return true;
        if (diccionario[palabra].genero === "ambos") return true;
        
        return generoNumero[articulo].genero === diccionario[palabra].genero && 
               generoNumero[articulo].numero === diccionario[palabra].numero;
    }

    function generarFrase() {
        const sustantivo = randomItem(sustantivos);
        const { genero, numero } = diccionario[sustantivo];
        
        // 50% de probabilidad de ser correcta o incorrecta
        const esCorrecta = Math.random() > 0.5;
        estado.esCorrecta = esCorrecta;
        
        // Seleccionar artículo
        let articulo;
        if (esCorrecta) {
            // Seleccionar artículo correcto
            articulo = randomItem(articulos.filter(a => 
                generoNumero[a].genero === genero && 
                generoNumero[a].numero === numero
            ));
        } else {
            // Seleccionar artículo incorrecto
            articulo = randomItem(articulos.filter(a => 
                generoNumero[a].genero !== genero || 
                generoNumero[a].numero !== numero
            ));
        }
        
        // Construir frase según dificultad
        let frase = `${articulo} ${sustantivo}`;
        
        if (estado.dificultad === 2) {
            // Añadir adjetivo o verbo
            if (Math.random() > 0.5) {
                // Añadir adjetivo
                let adjetivo;
                if (esCorrecta) {
                    adjetivo = randomItem(adjetivos.filter(a => 
                        !diccionario[a] || 
                        diccionario[a].genero === "ambos" || 
                        diccionario[a].genero === genero
                    ));
                } else {
                    // Adjetivo incorrecto
                    adjetivo = randomItem(adjetivos.filter(a => 
                        diccionario[a] && 
                        diccionario[a].genero !== "ambos" && 
                        diccionario[a].genero !== genero
                    ));
                }
                frase += ` ${adjetivo}`;
            } else {
                // Añadir verbo
                frase += ` ${randomItem(verbos)}`;
            }
        }
        
        return frase;
    }

    function mostrarSiguienteCombinacion() {
        if (estado.intentosRestantes <= 0) {
            mostrarResultados();
            return;
        }
        
        combinacion.textContent = generarFrase();
        estado.tiempoInicio = Date.now();
        estado.intentosRestantes--;
        
        setTimeout(() => {
            combinacion.textContent = "";
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
            combinacion.textContent = `✓ ${tiempoRespuesta}ms`;
            combinacion.style.color = "#4CAF50";
        } else {
            estado.errores++;
            estado.rachaActual = 0;
            combinacion.textContent = `✗ ${tiempoRespuesta}ms`;
            combinacion.style.color = "#ff4444";
        }
        
        setTimeout(() => {
            combinacion.textContent = "";
            mostrarSiguienteCombinacion();
        }, 1000);
    }

    function mostrarResultados() {
        mostrarPantalla("resultados");
        
        const tiempoMedio = estado.tiemposRespuesta.length > 0 
            ? Math.round(estado.tiemposRespuesta.reduce((a, b) => a + b, 0) / estado.tiemposRespuesta.length)
            : 0;
        
        document.getElementById("total-intentos").textContent = estado.intentosTotales;
        document.getElementById("aciertos").textContent = estado.aciertos;
        document.getElementById("errores").textContent = estado.errores;
        document.getElementById("racha-maxima").textContent = estado.rachaMaxima;
        document.getElementById("tiempo-medio").textContent = tiempoMedio;
    }

    function reiniciarJuego() {
        estado.aciertos = 0;
        estado.errores = 0;
        estado.rachaActual = 0;
        estado.rachaMaxima = 0;
        estado.tiemposRespuesta = [];
    }

    // Event Listeners
    botonComenzar.addEventListener("click", function() {
        estado.dificultad = parseInt(document.getElementById("dificultad").value);
        estado.intentosTotales = parseInt(document.getElementById("intentos").value);
        estado.tiempoVisualizacion = parseInt(document.getElementById("tiempo").value);
        const separacion = parseInt(document.getElementById("separacion").value);
        
        if (isNaN(estado.intentosTotales) || isNaN(estado.tiempoVisualizacion) || isNaN(separacion)) {
            alert("Por favor, ingresa valores válidos");
            return;
        }
        
        estado.intentosRestantes = estado.intentosTotales;
        combinacion.style.gap = `${separacion}px`;
        reiniciarJuego();
        mostrarPantalla("juego");
        mostrarSiguienteCombinacion();
    });

    botonCorrecto.addEventListener("click", function() {
        procesarRespuesta(true);
    });

    botonIncorrecto.addEventListener("click", function() {
        procesarRespuesta(false);
    });

    botonReintentar.addEventListener("click", function() {
        mostrarPantalla("configuracion");
    });

    botonCancelar.addEventListener("click", function() {
        if (confirm("¿Cancelar el entrenamiento?")) {
            mostrarPantalla("configuracion");
        }
    });

    // Inicialización
    mostrarPantalla("configuracion");
});