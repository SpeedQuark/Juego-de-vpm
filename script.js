document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const elementos = {
        config: document.getElementById("configuracion"),
        juego: document.getElementById("juego"),
        resultados: document.getElementById("resultados"),
        combo: document.getElementById("combinacion"),
        botones: document.getElementById("botones"),
        btnComenzar: document.getElementById("comenzar"),
        btnIncorrecto: document.getElementById("incorrecto"),
        btnCorrecto: document.getElementById("correcto"),
        btnReintentar: document.getElementById("reintentar"),
        btnCancelar: document.getElementById("cancelar")
    };

    // Diccionarios de palabras
    const vocabulario = {
        articulos: ["el", "la", "un", "una", "los", "las", "unos", "unas", "este", "esta", "estos", "estas"],
        sustantivos: ["casa", "perro", "gato", "árbol", "coche", "libro", "mesa", "silla", "ciudad", "flor"],
        adjetivos: ["grande", "pequeño", "rojo", "azul", "alto", "bajo", "bonito", "feo"],
        verbos: ["corre", "salta", "lee", "juega", "canta", "dibuja"]
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
        "esta": { genero: "femenino", numero: "singular" },
        "estos": { genero: "masculino", numero: "plural" },
        "estas": { genero: "femenino", numero: "plural" }
    };

    // Estado del juego
    const estado = {
        intentos: 0,
        aciertos: 0,
        errores: 0,
        racha: 0,
        rachaMax: 0,
        tiempos: [],
        inicio: 0,
        tiempoMostrar: 0,
        esCorrecta: false,
        dificultad: 1
    };

    // Funciones auxiliares
    const aleatorio = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const mostrarPantalla = (pantalla) => {
        Object.values(elementos).forEach(el => {
            if (el !== elementos.btnCancelar) el.classList.add("hidden");
        });
        if (pantalla === "config") elementos.config.classList.remove("hidden");
        if (pantalla === "juego") {
            elementos.juego.classList.remove("hidden");
            elementos.botones.classList.remove("hidden");
            elementos.btnCancelar.classList.remove("hidden");
        }
        if (pantalla === "resultados") elementos.resultados.classList.remove("hidden");
    };

    // Generador de frases
    const generarFrase = () => {
        const sustantivo = aleatorio(vocabulario.sustantivos);
        const { genero, numero } = gramatica[sustantivo] || { genero: "masculino", numero: "singular" };
        
        // Decidir si será correcta (50/50)
        estado.esCorrecta = Math.random() > 0.5;
        
        // Artículo (correcto o incorrecto)
        let articulo;
        if (estado.esCorrecta) {
            articulo = aleatorio(vocabulario.articulos.filter(a => 
                gramatica[a].genero === genero && 
                gramatica[a].numero === numero
            ));
        } else {
            articulo = aleatorio(vocabulario.articulos.filter(a => 
                gramatica[a].genero !== genero || 
                gramatica[a].numero !== numero
            ));
        }
        
        // Construir frase según dificultad
        let frase = `${articulo} ${sustantivo}`;
        
        if (estado.dificultad === 2) {
            if (Math.random() > 0.5) { // Adjetivo
                let adjetivo = aleatorio(vocabulario.adjetivos);
                
                if (!estado.esCorrecta && Math.random() > 0.5) {
                    // Hacer adjetivo incorrecto (50% de las frases incorrectas)
                    adjetivo = aleatorio(vocabulario.adjetivos.filter(a => 
                        gramatica[a]?.genero !== genero || 
                        gramatica[a]?.numero !== numero
                    ));
                }
                
                frase += ` ${adjetivo}`;
            } else { // Verbo
                frase += ` ${aleatorio(vocabulario.verbos)}`;
            }
        }
        
        return frase;
    };

    // Control del juego
    const siguienteFrase = () => {
        if (estado.intentos <= 0) {
            finalizarJuego();
            return;
        }
        
        elementos.combo.textContent = generarFrase();
        estado.inicio = Date.now();
        estado.intentos--;
        
        setTimeout(() => {
            elementos.combo.textContent = "";
        }, estado.tiempoMostrar);
    };

    const procesarRespuesta = (respuesta) => {
        const tiempo = Date.now() - estado.inicio;
        
        if (respuesta === estado.esCorrecta) {
            estado.aciertos++;
            estado.racha++;
            if (estado.racha > estado.rachaMax) estado.rachaMax = estado.racha;
            estado.tiempos.push(tiempo);
            elementos.combo.textContent = `✓ ${tiempo}ms`;
            elementos.combo.style.color = "#4CAF50";
        } else {
            estado.errores++;
            estado.racha = 0;
            elementos.combo.textContent = `✗ ${tiempo}ms`;
            elementos.combo.style.color = "#ff4444";
        }
        
        setTimeout(siguienteFrase, 1000);
    };

    const finalizarJuego = () => {
        const tiempoPromedio = estado.tiempos.length > 0 
            ? Math.round(estado.tiempos.reduce((a, b) => a + b, 0) / estado.tiempos.length)
            : 0;
        
        document.getElementById("total-intentos").textContent = estado.aciertos + estado.errores;
        document.getElementById("aciertos").textContent = estado.aciertos;
        document.getElementById("errores").textContent = estado.errores;
        document.getElementById("racha-maxima").textContent = estado.rachaMax;
        document.getElementById("tiempo-medio").textContent = tiempoPromedio;
        
        mostrarPantalla("resultados");
    };

    const reiniciar = () => {
        estado.aciertos = 0;
        estado.errores = 0;
        estado.racha = 0;
        estado.rachaMax = 0;
        estado.tiempos = [];
    };

    // Eventos
    elementos.btnComenzar.addEventListener("click", () => {
        estado.dificultad = parseInt(document.getElementById("dificultad").value);
        estado.tiempoMostrar = parseInt(document.getElementById("tiempo").value);
        estado.intentos = parseInt(document.getElementById("intentos").value);
        const separacion = parseInt(document.getElementById("separacion").value);
        
        if ([estado.tiempoMostrar, estado.intentos, separacion].some(isNaN)) {
            alert("Ingresa valores válidos");
            return;
        }
        
        elementos.combo.style.gap = `${separacion}px`;
        reiniciar();
        mostrarPantalla("juego");
        siguienteFrase();
    });

    elementos.btnCorrecto.addEventListener("click", () => procesarRespuesta(true));
    elementos.btnIncorrecto.addEventListener("click", () => procesarRespuesta(false));
    elementos.btnReintentar.addEventListener("click", () => mostrarPantalla("config"));
    elementos.btnCancelar.addEventListener("click", () => {
        if (confirm("¿Cancelar el entrenamiento?")) mostrarPantalla("config");
    });

    // Iniciar
    mostrarPantalla("config");
});