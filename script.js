// ============================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ============================================================
const car = document.getElementById("car");
const obstacle = document.getElementById("obstacle");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");

// ============================================================
// VARIABLES DEL JUEGO
// ============================================================
let carPosition = 175;        // Posición X del auto
let obstaclePosition = -100;   // Posición Y del obstáculo
let obstacleSpeed = 6;        // Velocidad del obstáculo
let gameInterval;             // ID del intervalo
let isGameOver = false;       // Estado del juego

// ============================================================
// VARIABLES PARA LA MÚSICA DE FONDO (MARIO BROS NORMAL)
// ============================================================
let musicaFondo = null;
let musicaFondoIniciada = false;

// ============================================================
// VARIABLES PARA LA MÚSICA DE GAME OVER (MARIO)
// ============================================================
let musicaGameOver = null;

// ============================================================
// CONTROLES (FLECHAS IZQUIERDA Y DERECHA)
// ============================================================
document.addEventListener("keydown", (e) => {
    if (isGameOver) return;  // Si el juego terminó, no se mueve

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
// FUNCIONES PARA LA MÚSICA DE FONDO (NORMAL)
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
        musicaGameOver.loop = false;  // Suena una sola vez
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

    // Mover el obstáculo hacia abajo
    obstaclePosition += obstacleSpeed;
    obstacle.style.top = obstaclePosition + "px";

    // Si sale de la pantalla, reaparece arriba en una posición aleatoria
    if (obstaclePosition > 600) {
        obstaclePosition = -100;
        obstacle.style.left = Math.random() * 340 + 5 + "px";
        // Aumentar velocidad progresivamente (dificultad)
        obstacleSpeed += 0.1;
    }

    // ============================================================
    // DETECCIÓN DE COLISIÓN
    // ============================================================
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
// FUNCIÓN DE GAME OVER (OPCIÓN 2)
// ============================================================
function gameOver() {
    if (isGameOver) return;
    isGameOver = true;

    // Detener el movimiento
    clearInterval(gameInterval);

    // ============================================================
    // 1. DETENER LA MÚSICA DE FONDO (MARIO BROS NORMAL)
    // ============================================================
    detenerMusicaFondo();

    // ============================================================
    // 2. REPRODUCIR SONIDO DE EXPLOSIÓN
    // ============================================================
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

    // ============================================================
    // 3. REPRODUCIR GRITO
    // ============================================================
    try {
        const audioPersonalizado = new Audio('grito.mp3');
        audioPersonalizado.volume = 0.5;
        audioPersonalizado.play();
        console.log("🔊 Grito");
    } catch (e) {
        console.log("Audio personalizado no disponible:", e);
    }

    // ============================================================
    // 4. REPRODUCIR MÚSICA DE GAME OVER (MARIO)
    // ============================================================
    reproducirMusicaGameOver();

    // ============================================================
    // 5. MOSTRAR JUMPSACRE
    // ============================================================
    gameOverScreen.style.display = "flex";
    document.getElementById("gameArea").style.animation = "shake 0.5s";
}

// ============================================================
// FUNCIÓN PARA REINICIAR EL JUEGO
// ============================================================
function restartGame() {
    // ============================================================
    // DETENER MÚSICA DE GAME OVER
    // ============================================================
    detenerMusicaGameOver();

    // ============================================================
    // OCULTAR PANTALLA DE GAME OVER
    // ============================================================
    gameOverScreen.style.display = "none";

    // ============================================================
    // REINICIAR POSICIONES
    // ============================================================
    carPosition = 175;
    car.style.left = carPosition + "px";

    obstaclePosition = -100;
    obstacle.style.top = obstaclePosition + "px";
    obstacle.style.left = Math.random() * 340 + 5 + "px";

    obstacleSpeed = 4;
    isGameOver = false;

    document.getElementById("gameArea").style.animation = "";

    // ============================================================
    // REINICIAR MÚSICA DE FONDO (MARIO NORMAL)
    // ============================================================
    iniciarMusicaFondo();

    // ============================================================
    // REINICIAR EL JUEGO
    // ============================================================
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(moveObstacle, 20);
}

// ============================================================
// EVENTO DEL BOTÓN DE REINICIO
// ============================================================
restartBtn.addEventListener("click", restartGame);

// ============================================================
// INICIAR EL JUEGO
// ============================================================
gameInterval = setInterval(moveObstacle, 20);
iniciarMusicaFondo();  // Arranca la música de Mario Bros normal

// ============================================================
// EFECTO DE VIBRACIÓN PARA EL JUMPSACRE
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