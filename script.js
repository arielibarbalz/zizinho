// ============================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ============================================================
const car = document.getElementById("car");
const obstacle = document.getElementById("obstacle");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");

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

    obstaclePosition += obstacleSpeed;
    obstacle.style.top = obstaclePosition + "px";

    if (obstaclePosition > 600) {
        obstaclePosition = -100;
        obstacle.style.left = Math.random() * 340 + 5 + "px";
        obstacleSpeed += 0.1;
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
    isGameOver = true;

    clearInterval(gameInterval);
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
// FUNCIÓN PARA REINICIAR EL JUEGO
// ============================================================
function restartGame() {
    detenerMusicaGameOver();
    gameOverScreen.style.display = "none";

    carPosition = 175;
    car.style.left = carPosition + "px";

    obstaclePosition = -100;
    obstacle.style.top = obstaclePosition + "px";
    obstacle.style.left = Math.random() * 340 + 5 + "px";

    obstacleSpeed = 6;
    isGameOver = false;

    document.getElementById("gameArea").style.animation = "";
    iniciarMusicaFondo();

    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(moveObstacle, 20);
}

restartBtn.addEventListener("click", restartGame);

// ============================================================
// INICIAR EL JUEGO
// ============================================================
gameInterval = setInterval(moveObstacle, 20);
iniciarMusicaFondo();

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