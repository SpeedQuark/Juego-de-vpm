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
    let aciertos = 0;
    let errores = 0;
    let rachaMaxima = 0;
    let rachaActual = 0;
    let tiemposAciertos = [];
    let tiempoInicio = 0;
    let tiempoVisualizacion = 0;
    let esCorrecta = false;

    botonComenzar.addEventListener("click", () => {
        const separacion = parseInt(document.getElementById("separacion").value);
        intentosTotales = parseInt(document.getElementById("intentos").value);
        tiempoVisualizacion = parseInt(document.getElementById("tiempo").value);

        if (isNaN(separacion) || isNaN(intentosTotales) || isNaN(tiempoVisualizacion)) {
            alert("Por favor, ingresa valores numéricos válidos.");
            return;
        }

        // Aplicar la separación entre palabras
        combinacion.style.gap = `${separacion}px`;

        configuracion.classList.add("hidden");
        juego.classList.remove("hidden");
        botonesRespuesta.classList.remove("hidden");
        botonCancelar.classList.remove("hidden");
        mostrarSiguienteCombinacion();
    });

    function mostrarSiguienteCombinacion() {
        if (intentosTotales <= 0) {
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

        // Habilitar botones para responder
        botonIncorrecto.disabled = false;
        botonCorrecto.disabled = false;

        // Ocultar las palabras después del tiempo de visualización
        setTimeout(() => {
            combinacion.innerHTML = "";
        }, tiempoVisualizacion);
    }

    function respuesta(usuarioRespondioCorrecto) {
        const tiempoTardado = Date.now() - tiempoInicio;
        intentosTotales--;

        // Deshabilitar botones después de responder
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

        // Esperar 1 segundo antes de mostrar la siguiente combinación
        setTimeout(() => {
            combinacion.textContent = "";
            mostrarSiguienteCombinacion();
        }, 1000);
    }

    botonIncorrecto.addEventListener("click", () => respuesta(false));
    botonCorrecto.addEventListener("click", () => respuesta(true));

    botonCancelar.addEventListener("click", () => {
        configuracion.classList.remove("hidden");
        juego.classList.add("hidden");
        resultados.classList.add("hidden");
        botonesRespuesta.classList.add("hidden");
        botonCancelar.classList.add("hidden");
        reiniciarJuego();
    });

    function mostrarResultados() {
        juego.classList.add("hidden");
        resultados.classList.remove("hidden");
        botonesRespuesta.classList.add("hidden");
        botonCancelar.classList.add("hidden");

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
        resultados.classList.add("hidden");
        configuracion.classList.remove("hidden");
        reiniciarJuego();
    });

    function reiniciarJuego() {
        intentosTotales = 0;
        aciertos = 0;
        errores = 0;
        rachaMaxima = 0;
        rachaActual = 0;
        tiemposAciertos = [];
    }
});
