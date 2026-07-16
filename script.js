// ============================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ============================================================
const car = document.getElementById("car");
const obstacle = document.getElementById("obstacle");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");
const premio = document.getElementById("premio");
const contadorPuntos = document.getElementById("contadorPuntos");
const victoriaScreen = document.getElementById("victoriaScreen");
const reiniciarVictoriaBtn = document.getElementById("reiniciarVictoriaBtn");

// ============================================================
// REFERENCIAS A BOTONES TÁCTILES
// ============================================================
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");

// ============================================================
// VARIABLES DEL JUEGO
// ============================================================
let carPosition = 175;
let obstaclePosition = -100;
let obstacleSpeed = 7;
let gameInterval;
let isGameOver = false;

// ============================================================
// VARIABLES PARA LA MÚSICA DE FONDO (MARIO BROS)
// ============================================================
let musicaFondo = null;
let musicaFondoIniciada = false;

// ============================================================
// VARIABLES PARA LA MÚSICA DE GAME OVER (MARIO)
// ============================================================
let musicaGameOver = null;

// ============================================================
// VARIABLES PARA EL PREMIO (CHORIZO)
// ============================================================
let puntaje = 0;
let premioActivo = false;
let intervaloPremio = null;

// ============================================================
// VARIABLE PARA CONTROLAR LA DIFICULTAD
// ============================================================
let velocidadBase = 7;
let incrementoDificultad = 0;

// ============================================================
// CONTROLES DE TECLADO
// ============================================================
document.addEventListener("keydown", (e) => {
    if (isGameOver) return;

    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (carPosition > 5) {
            carPosition -= 25;
            car.style.left = carPosition + "px";
        }
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (carPosition < 345) {
            carPosition += 25;
            car.style.left = carPosition + "px";
        }
    }
});

// ============================================================
// CONTROLES TÁCTILES PARA MÓVILES
// ============================================================
function moverIzquierda() {
    if (isGameOver) return;
    if (carPosition > 5) {
        carPosition -= 25;
        car.style.left = carPosition + "px";
    }
}

function moverDerecha() {
    if (isGameOver) return;
    if (carPosition < 345) {
        carPosition += 25;
        car.style.left = carPosition + "px";
    }
}

btnLeft.addEventListener("click", moverIzquierda);
btnLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moverIzquierda();
});

btnRight.addEventListener("click", moverDerecha);
btnRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moverDerecha();
});

// ============================================================
// FUNCIONES PARA LA MÚSICA DE FONDO
// ============================================================
function iniciarMusicaFondo() {
    try {
        if (!musicaFondoIniciada) {
            musicaFondo = new Audio('mario-bross.mp3');
            musicaFondo.volume = 0.3;
            musicaFondo.loop = true;
            musicaFondo.play();
            musicaFondoIniciada = true;
            console.log("🎵 Música de Mario Bros (fondo) iniciada");
        }
    } catch (e) {
        console.log("❌ Error con la música de fondo:", e);
    }
}

function detenerMusicaFondo() {
    if (musicaFondo) {
        musicaFondo.pause();
        musicaFondo.currentTime = 0;
        musicaFondo = null;
        musicaFondoIniciada = false;
        console.log("🔇 Música de Mario Bros (fondo) detenida");
    }
}

// ============================================================
// FUNCIONES PARA LA MÚSICA DE GAME OVER
// ============================================================
function reproducirMusicaGameOver() {
    try {
        musicaGameOver = new Audio('mario-bros game over.mp3');
        musicaGameOver.volume = 0.4;
        musicaGameOver.loop = false;
        musicaGameOver.play();
        console.log("🎵 Música de Game Over de Mario");
    } catch (e) {
        console.log("❌ Error con la música de Game Over:", e);
    }
}

function detenerMusicaGameOver() {
    if (musicaGameOver) {
        musicaGameOver.pause();
        musicaGameOver.currentTime = 0;
        musicaGameOver = null;
        console.log("🔇 Música de Game Over detenida");
    }
}

// ============================================================
// FUNCIÓN PARA MOVER EL OBSTÁCULO Y DETECTAR COLISIONES
// ============================================================
function moveObstacle() {
    if (isGameOver) return;

    incrementoDificultad += 0.002;
    let velocidadActual = velocidadBase + incrementoDificultad;
    if (velocidadActual > 18) velocidadActual = 18;

    obstaclePosition += velocidadActual;
    obstacle.style.top = obstaclePosition + "px";

    if (obstaclePosition > 600) {
        obstaclePosition = -100;
        obstacle.style.left = Math.random() * 340 + 5 + "px";
        velocidadBase += 0.15;
    }

    const carRect = car.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        carRect.left < obstacleRect.right &&
        carRect.right > obstacleRect.left &&
        carRect.top < obstacleRect.bottom &&
        carRect.bottom > obstacleRect.top
    ) {
        gameOver();
    }
}

// ============================================================
// FUNCIÓN DE GAME OVER
// ============================================================
function gameOver() {
    if (isGameOver) return;
    if (puntaje >= 5) return; // Si ya ganó, no hacer game over
    
    isGameOver = true;

    clearInterval(gameInterval);
    if (intervaloPremio) clearInterval(intervaloPremio);
    premio.style.display = "none";
    premioActivo = false;
    detenerMusicaFondo();

    try {
        const explosionSound = sfxr("explosion");
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.9;
        const source = audioCtx.createBufferSource();
        source.buffer = explosionSound;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        source.start();
    } catch (e) {
        console.log("Sonido de explosión no disponible:", e);
    }

    try {
        const audioPersonalizado = new Audio('grito.mp3');
        audioPersonalizado.volume = 0.5;
        audioPersonalizado.play();
    } catch (e) {
        console.log("Audio personalizado no disponible:", e);
    }

    reproducirMusicaGameOver();
    gameOverScreen.style.display = "flex";
    document.getElementById("gameArea").style.animation = "shake 0.5s";
}

// ============================================================
// FUNCIÓN PARA APARECER EL PREMIO (CHORIZO)
// ============================================================
function generarPremio() {
    if (isGameOver || premioActivo) return;

    console.log("🥩 ¡Generando chorizo!");

    premioActivo = true;
    premio.style.display = "block";
    premio.style.left = Math.random() * 330 + 10 + "px";
    premio.style.top = "-50px";

    let posY = -50;
    const caerPremio = setInterval(() => {
        if (isGameOver) {
            clearInterval(caerPremio);
            premio.style.display = "none";
            premioActivo = false;
            return;
        }

        posY += 5;
        premio.style.top = posY + "px";

        if (posY > 620) {
            clearInterval(caerPremio);
            premio.style.display = "none";
            premioActivo = false;
            return;
        }

        const carRect = car.getBoundingClientRect();
        const premioRect = premio.getBoundingClientRect();

        if (
            carRect.left < premioRect.right &&
            carRect.right > premioRect.left &&
            carRect.top < premioRect.bottom &&
            carRect.bottom > premioRect.top
        ) {
            clearInterval(caerPremio);
            premio.style.display = "none";
            premioActivo = false;

            puntaje++;
            contadorPuntos.textContent = puntaje;
            console.log("🎉 ¡Chorizo recogido! Puntaje:", puntaje);

            // === VERIFICAR SI GANÓ ===
if (puntaje >= 4) {
    isGameOver = true;
    clearInterval(gameInterval);
    if (intervaloPremio) clearInterval(intervaloPremio);
    detenerMusicaFondo();
    
    victoriaScreen.style.display = "flex";
    premio.style.display = "none";
    premioActivo = false;
    
    // === REPRODUCIR "LA CAMISA" ===
    try {
        const audioCamisa = new Audio('lacamisa.mp3');
        audioCamisa.volume = 0.7;
        audioCamisa.loop = false;
        audioCamisa.play();
        console.log("🎵 Reproduciendo: La Camisa");
    } catch(e) {
        console.log("❌ Error con el audio 'lacamisa.mp3':", e);
        // Si no encuentra el audio, intenta con el alternativo
        try {
            const audioVictoria = new Audio('victoria.mp3');
            audioVictoria.volume = 0.5;
            audioVictoria.play();
        } catch(e2) {
            console.log("Sonido de victoria alternativo no disponible");
        }
    }
    return;
}

            car.style.boxShadow = "0 0 30px rgba(255, 200, 0, 0.9)";
            setTimeout(() => {
                car.style.boxShadow = "0 0 15px rgba(255, 68, 68, 0.5)";
            }, 300);

            try {
                const audioPremio = new Audio('chorizo.mp3');
                audioPremio.volume = 0.3;
                audioPremio.play();
            } catch(e) {}
        }
    }, 30);
}

// ============================================================
// FUNCIÓN PARA REINICIAR EL JUEGO
// ============================================================
function restartGame() {
    victoriaScreen.style.display = "none";
    detenerMusicaGameOver();
    gameOverScreen.style.display = "none";

    carPosition = 175;
    car.style.left = carPosition + "px";

    obstaclePosition = -100;
    obstacle.style.top = obstaclePosition + "px";
    obstacle.style.left = Math.random() * 340 + 5 + "px";

    obstacleSpeed = 6;
    velocidadBase = 7;
    incrementoDificultad = 0;
    isGameOver = false;
    puntaje = 0;
    contadorPuntos.textContent = "0";
    premioActivo = false;
    premio.style.display = "none";

    document.getElementById("gameArea").style.animation = "";
    iniciarMusicaFondo();

    if (gameInterval) clearInterval(gameInterval);
    if (intervaloPremio) clearInterval(intervaloPremio);

    gameInterval = setInterval(moveObstacle, 20);
    intervaloPremio = setInterval(() => {
        if (!isGameOver) {
            generarPremio();
        }
    }, 4000);
}

restartBtn.addEventListener("click", restartGame);

// ============================================================
// FUNCIÓN PARA REINICIAR DESDE LA VICTORIA
// ============================================================
function reiniciarDesdeVictoria() {
    victoriaScreen.style.display = "none";
    restartGame();
}

reiniciarVictoriaBtn.addEventListener("click", reiniciarDesdeVictoria);

// ============================================================
// INICIAR EL JUEGO
// ============================================================
gameInterval = setInterval(moveObstacle, 20);
iniciarMusicaFondo();

intervaloPremio = setInterval(() => {
    if (!isGameOver) {
        generarPremio();
    }
}, 4000);

// ============================================================
// EFECTO DE VIBRACIÓN
// ============================================================
const styleShake = document.createElement("style");
styleShake.textContent = `
    @keyframes shake {
        0% { transform: translateX(0); }
        10% { transform: translateX(-15px); }
        20% { transform: translateX(15px); }
        30% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        50% { transform: translateX(-5px); }
        60% { transform: translateX(5px); }
        70% { transform: translateX(-2px); }
        80% { transform: translateX(2px); }
        90% { transform: translateX(-1px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(styleShake);