document.addEventListener("DOMContentLoaded", () => {
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

    const articulos = ["el", "la", "un", "una", "los", "las", "unos", "unas"];
    const sustantivos = ["casa", "perro", "gato", "árbol", "coche", "libro", "mesa", "silla"];

    let intentosTotales = 0;
    let intentosRealizados = 0; // ¡Nueva variable para contar intentos!
    let aciertos = 0;
    let errores = 0;
    let rachaMaxima = 0;
    let rachaActual = 0;
    let tiemposAciertos = [];
    let tiempoInicio = 0;
    let tiempoVisualizacion = 0;
    let esCorrecta = false;

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

    mostrarPantalla("configuracion");

    botonComenzar.addEventListener("click", () => {
        const separacion = parseInt(document.getElementById("separacion").value);
        intentosTotales = parseInt(document.getElementById("intentos").value);
        tiempoVisualizacion = parseInt(document.getElementById("tiempo").value);

        if (isNaN(separacion) || isNaN(intentosTotales) || isNaN(tiempoVisualizacion)) {
            alert("Por favor, ingresa valores numéricos válidos.");
            return;
        }

        reiniciarJuego();
        mostrarPantalla("juego");
        combinacion.style.gap = `${separacion}px`;
        mostrarSiguienteCombinacion();
    });

    // Función modificada para corregir el problema
    function mostrarSiguienteCombinacion() {
        if (intentosRealizados >= intentosTotales) { // Cambio clave aquí
            mostrarResultados();
            return;
        }

        const articulo = articulos[Math.floor(Math.random() * articulos.length)];
        const sustantivo = sustantivos[Math.floor(Math.random() * sustantivos.length)];
        esCorrecta = Math.random() < 0.5;

        combinacion.innerHTML = esCorrecta
            ? `<span>${articulo}</span> <span>${sustantivo}</span>`
            : `<span>${articulo}</span> <span>${sustantivos[Math.floor(Math.random() * sustantivos.length)]}</span>`;
        tiempoInicio = Date.now();

        botonIncorrecto.disabled = false;
        botonCorrecto.disabled = false;

        setTimeout(() => {
            combinacion.innerHTML = "";
        }, tiempoVisualizacion);

        intentosRealizados++; // Incrementamos aquí
    }

    function respuesta(usuarioRespondioCorrecto) {
        const tiempoTardado = Date.now() - tiempoInicio;

        botonIncorrecto.disabled = true;
        botonCorrecto.disabled = true;

        if (usuarioRespondioCorrecto === esCorrecta) {
            aciertos++;
            rachaActual++;
            if (rachaActual > rachaMaxima) rachaMaxima = rachaActual;
            tiemposAciertos.push(tiempoTardado);
            combinacion.textContent = `Correcto (${tiempoTardado} ms)`;
            combinacion.style.color = "green";
        } else {
            errores++;
            rachaActual = 0;
            combinacion.textContent = `Incorrecto (${tiempoTardado} ms)`;
            combinacion.style.color = "red";
        }

        setTimeout(() => {
            combinacion.textContent = "";
            mostrarSiguienteCombinacion();
        }, tiempoVisualizacion);
    }

    botonIncorrecto.addEventListener("click", () => respuesta(false));
    botonCorrecto.addEventListener("click", () => respuesta(true));

    botonCancelar.addEventListener("click", () => {
        mostrarPantalla("configuracion");
        reiniciarJuego();
    });

    function mostrarResultados() {
        mostrarPantalla("resultados");

        const tiempoMedioAciertos = tiemposAciertos.reduce((a, b) => a + b, 0) / tiemposAciertos.length || 0;
        const tiempoMedioTotal = (tiemposAciertos.reduce((a, b) => a + b, 0) + (errores * 2000)) / (aciertos + errores) || 0;

        document.getElementById("total-intentos").textContent = aciertos + errores;
        document.getElementById("aciertos").textContent = aciertos;
        document.getElementById("errores").textContent = errores;
        document.getElementById("racha-maxima").textContent = rachaMaxima;
        document.getElementById("tiempo-medio").textContent = Math.round(tiempoMedioAciertos);
        document.getElementById("tiempo-total").textContent = Math.round(tiempoMedioTotal);
    }

    botonReintentar.addEventListener("click", () => {
        mostrarPantalla("configuracion");
        reiniciarJuego();
    });

    function reiniciarJuego() {
        intentosRealizados = 0; // ¡Reiniciar el contador!
        aciertos = 0;
        errores = 0;
        rachaMaxima = 0;
        rachaActual = 0;
        tiemposAciertos = [];
    }
});