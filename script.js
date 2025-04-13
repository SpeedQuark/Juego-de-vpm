document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM (mantener igual)
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

    // Vocabulario ampliado (nuevo)
    const articulos = ["el", "la", "un", "una", "los", "las", "unos", "unas", "este", "esta"];
    const sustantivos = ["casa", "perro", "gato", "árbol", "coche", "libro", "mesa", "silla", "ciudad", "flor"];
    const adjetivos = ["grande", "pequeño", "rojo", "azul", "alto", "bajo", "bonito"];
    const verbos = ["corre", "salta", "lee", "juega", "canta", "dibuja"];

    // Variables de estado (mantener igual)
    let intentosTotales = 0;
    let aciertos = 0;
    let errores = 0;
    let rachaMaxima = 0;
    let rachaActual = 0;
    let tiemposAciertos = [];
    let tiempoInicio = 0;
    let tiempoVisualizacion = 0;
    let esCorrecta = false;

    // ---- NUEVAS FUNCIONES ---- //
    function generarFraseAleatoria() {
        const estructura = Math.floor(Math.random() * 3);
        let frase = "";
        let articulo = articulos[Math.floor(Math.random() * articulos.length)];
        let sustantivo = sustantivos[Math.floor(Math.random() * sustantivos.length)];

        switch(estructura) {
            case 0: // Artículo + Sustantivo
                frase = `${articulo} ${sustantivo}`;
                esCorrecta = verificarConcordancia(articulo, sustantivo);
                break;
            case 1: // Artículo + Sustantivo + Adjetivo
                const adjetivo = adjetivos[Math.floor(Math.random() * adjetivos.length)];
                frase = `${articulo} ${sustantivo} ${adjetivo}`;
                esCorrecta = verificarConcordancia(articulo, sustantivo) && 
                             verificarConcordancia(articulo, adjetivo);
                break;
            case 2: // Artículo + Sustantivo + Verbo
                const verbo = verbos[Math.floor(Math.random() * verbos.length)];
                frase = `${articulo} ${sustantivo} ${verbo}`;
                esCorrecta = verificarConcordancia(articulo, sustantivo);
                break;
        }
        return frase;
    }

    function verificarConcordancia(articulo, palabra) {
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
            "esta": { genero: "femenino", numero: "singular" }
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
            "bonita": { genero: "femenino", numero: "singular" }
        };

        if (!generoNumero[articulo] || !diccionario[palabra]) return true;
        if (diccionario[palabra].genero === "ambos") return true;
        
        return generoNumero[articulo].genero === diccionario[palabra].genero && 
               generoNumero[articulo].numero === diccionario[palabra].numero;
    }

    // ---- FUNCIONES EXISTENTES (MODIFICADAS) ---- //
    function mostrarSiguienteCombinacion() {
        if (intentosTotales <= 0) {
            mostrarResultados();
            return;
        }
        
        combinacion.textContent = generarFraseAleatoria();
        tiempoInicio = Date.now();
        intentosTotales--;
        
        setTimeout(() => {
            if (intentosTotales >= 0) combinacion.textContent = "";
        }, tiempoVisualizacion);
    }

    // [MANTÉN TODO LO DEMÁS IGUAL (funciones mostrarPantalla, respuesta, reiniciarJuego, etc.)]
    // ... (incluyendo los event listeners)
});