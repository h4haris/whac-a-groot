const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const countdownBoard = document.querySelector('.countdown');
const startButton = document.querySelector('.startButton');

let lastHole;
let timeUp = false;
let timeLimit = 30000; //30 secs
let score = 0;
let countdown;
let bgMusicAudio;
let characterAudio;

//Pick random hole for mole  
function pickRandomHole(holes) {
    const randomHole = Math.floor(Math.random() * holes.length);
    const hole = holes[randomHole];
    if (hole === lastHole) { // Re-pick hole if same hole pick as last hole
        return pickRandomHole(holes);
    }
    lastHole = hole;
    return hole;
}

//Controls random time for each mole to pop out and then hide back in
function popOut() {
    const time = Math.random() * 1300 + 400 // random time between 400 & 1300
    const hole = pickRandomHole(holes);
    hole.classList.add('up');
    setTimeout(function() {
        hole.classList.remove('up');
        if (!timeUp) popOut();
    }, time);
}

//Start timer, refresh score board, play background music until timer runs out
function startGame() {
    countdown = timeLimit / 1000;
    scoreBoard.textContent = 0;
    scoreBoard.style.display = 'block';
    startButton.style.display = 'none';
    countdownBoard.textContent = "Time Left :" + countdown;
    timeUp = false;
    score = 0;

    popOut();

    setTimeout(function() {
        timeUp = true;
    }, timeLimit);

    playBackgroundSound();

    let startCountdown = setInterval(function() {
        countdown -= 1;
        countdownBoard.textContent = "Time Left :" + countdown;
        if (countdown < 0) {
            countdown = 0;
            clearInterval(startCountdown);
            countdownBoard.textContent = 'Times UP!! NICE TRY! Thank you for protecting our planet!';
            startButton.style.display = 'block';
            stopBackgroundSound();
        }
    }, 1000);

}

//Player hit sound
function playPlayerHitSound() {
    if (!characterAudio)
        characterAudio = new sound("audio/pain.mp3");
    characterAudio.play();
}

//Background music play
function playBackgroundSound() {
    if (!bgMusicAudio)
        bgMusicAudio = new sound("audio/bg.mp3");
    bgMusicAudio.play();
}

//Background music stop
function stopBackgroundSound() {
    bgMusicAudio.pause();
    bgMusicAudio.currentTime = 0;
}

//Create and return Sound element and append in DOM
function sound(src) {
    var sound = document.createElement("audio");
    sound.src = src;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    return sound;
}

startButton.addEventListener('click', startGame);

//Controls score on mole hit and animate mole expression  
function whack(e) {
    score++;
    playPlayerHitSound();
    this.style.backgroundImage = 'url("images/player2.png")';
    this.style.pointerEvents = 'none';
    setTimeout(() => {
        this.style.backgroundImage = 'url("images/player1.png")';
        this.style.pointerEvents = 'all';
    }, 800);
    scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', whack));