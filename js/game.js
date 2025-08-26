const emojiThemes = [
    // Quốc kỳ
    ['🇻🇳','🇺🇸','🇯🇵','🇰🇷','🇨🇳','🇫🇷','🇩🇪','🇬🇧','🇮🇳','🇷🇺','🇧🇷','🇹🇭'],
    // Nghệ thuật
    ['🎨','🎭','🎬','🎤','🎧','🎹','🎷','🎸','🎻','🥁','🖼️','📸'],
    // Không gian
    ['🌌','🌠','🚀','🛰️','🪐','🌙','⭐','☄️','🌑','🌕','🛸','👽'],
    // Gia đình
    ['👨‍👩‍👧','👨‍👩‍👦','👨‍👩‍👧‍👦','👩‍👧','👨‍👦','👩‍👦','👨‍👧','👵','👴','🧒','👶','👧']
    // Trái cây
    ['🍎','🍌','🍇','🍒','🍉','🍋','🍓','🥝','🍍','🥥','🍈','🍊'],
    // Động vật
    ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮'],
    // Biển
    ['🐟','🐠','🐡','🦈','🐬','🐳','🐋','🦭','🦑','🐙','🦐','🦞'],
    // Mặt cười
    ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎'],
    // Thể thao
    ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🥏','🎱','🏓','🏸','🥅'],
    // Đồ ăn
    ['🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥗','🍿','🧀','🥚','🍗'],
    // Công nghệ
    ['💻','🖥️','🖱️','⌨️','📱','🕹️','🎧','📷','🔋','🔌','🧲','🗜️'],
    // Du lịch
    ['✈️','🚗','🚆','🚢','🏝️','🏔️','🏨','🗺️','🎒','🧳','🌍','🛤️'],
    // Thời tiết
    ['☀️','🌤️','⛅','🌧️','⛈️','🌩️','❄️','🌪️','🌈','🌫️','🌦️','🌨️']
];
let symbols = emojiThemes[0]; // mặc định chủ đề đầu tiên
let cards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

const board = document.getElementById('game-board');
const movesSpan = document.getElementById('moves');
const timerSpan = document.getElementById('timer');
const resultDiv = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');
const flipSound = document.getElementById('flip-sound');
const winSound = document.getElementById('win-sound');
const failSound = document.getElementById('fail-sound');
const startSound = document.getElementById('start-sound');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');
let soundEnabled = true;
const matchSound = document.getElementById('match-sound');
const helpBtn = document.getElementById('help-btn');

// Scene elements
const splashScene = document.getElementById('splash-scene');
const loadingScene = document.getElementById('loading-scene');
const gameScene = document.getElementById('game-scene');
const effectScene = document.getElementById('effect-scene');
const confettiCanvas = document.getElementById('confetti-canvas');
const startBtn = document.getElementById('start-btn');
let currentScene = 'splash';

function showScene(scene) {
    splashScene.style.display = (scene === 'splash') ? '' : 'none';
    loadingScene.style.display = (scene === 'loading') ? '' : 'none';
    gameScene.style.display = (scene === 'game') ? '' : 'none';
    effectScene.style.display = (scene === 'effect') ? '' : 'none';
    currentScene = scene;
}

function fakeLoadingResources(callback) {
    showScene('loading');
    let progress = 0;
    const loadingProgress = document.getElementById('loading-progress');
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 10;
        if (progress > 100) progress = 100;
        loadingProgress.textContent = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(callback, 500);
        }
    }, 300);
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        showScene('loading');
        fakeLoadingResources(() => {
            showScene('game');
            startGame();
        });
    });
}

// Khi reload trang, luôn về splash scene
window.onload = () => {
    showScene('splash');
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomItems(arr, n) {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy[idx]);
        copy.splice(idx, 1);
    }
    return result;
}

function startGame() {
    // Chọn ngẫu nhiên một chủ đề emoji
    const themeIndex = Math.floor(Math.random() * emojiThemes.length);
    symbols = emojiThemes[themeIndex];
    // Đổi background theo chủ đề
    let bg = '#e3f2fd';
    switch(themeIndex) {
        case 0: bg = 'linear-gradient(135deg, #ff9800 0%, #fffde4 100%)'; break; // trái cây
        case 1: bg = 'linear-gradient(135deg, #8bc34a 0%, #e0f7fa 100%)'; break; // động vật
        case 2: bg = 'linear-gradient(135deg, #03a9f4 0%, #e1f5fe 100%)'; break; // biển
        case 3: bg = 'linear-gradient(135deg, #ffd600 0%, #fffde4 100%)'; break; // mặt cười
        case 4: bg = 'linear-gradient(135deg, #e91e63 0%, #fce4ec 100%)'; break; // thể thao
        case 5: bg = 'linear-gradient(135deg, #ff5722 0%, #fff3e0 100%)'; break; // đồ ăn
    }
    if (gameScene) gameScene.style.background = bg;
    // Chọn ngẫu nhiên 6 emoji từ chủ đề
    const selectedSymbols = getRandomItems(symbols, 6);
    cards = shuffle([...selectedSymbols, ...selectedSymbols]);
    flippedCards = [];
    matchedCards = [];
    moves = 0;
    timer = 0;
    gameStarted = false;
    resultDiv.textContent = '';
    movesSpan.textContent = 'Moves: 0';
    timerSpan.textContent = 'Time: 0s';
    clearInterval(timerInterval);
    renderBoard();
    if (startSound && soundEnabled) {
        startSound.currentTime = 0;
        startSound.play();
    }
    if (soundToggle && soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
}
    // Tạo modal hướng dẫn chơi
    let helpModal = null;
    function showHelpModal() {
        if (!helpModal) {
            helpModal = document.createElement('div');
            helpModal.id = 'help-modal';
            helpModal.style.position = 'fixed';
            helpModal.style.top = '50%';
            helpModal.style.left = '50%';
            helpModal.style.transform = 'translate(-50%, -50%)';
            helpModal.style.background = '#fff';
            helpModal.style.border = '2px solid #2196f3';
            helpModal.style.borderRadius = '18px';
            helpModal.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
            helpModal.style.zIndex = '9999';
            helpModal.style.padding = '32px 32px 24px 32px';
            helpModal.style.maxWidth = '420px';
            helpModal.style.width = '90vw';
            helpModal.style.fontSize = '1.25rem';
            helpModal.style.textAlign = 'center';
            helpModal.innerHTML = `
                <h2 style="margin-top:0;color:#2196f3;font-size:2em;font-weight:700">Hướng dẫn chơi</h2>
                <ul style="padding-left:0;margin-bottom:18px;text-align:left;font-size:1.18em;line-height:1.7">
                    <li>Nhấn <b>Bắt đầu</b> để vào game.</li>
                    <li>Lật 2 thẻ bất kỳ để tìm cặp giống nhau.</li>
                    <li>Ghép đúng sẽ giữ thẻ mở, sai sẽ đóng lại.</li>
                    <li>Hoàn thành tất cả cặp để thắng.</li>
                    <li>Có thể bật/tắt âm thanh, chơi lại bất cứ lúc nào.</li>
                </ul>
                <button id="close-help" style="background:#2196f3;color:#fff;border:none;padding:10px 32px;border-radius:8px;cursor:pointer;font-size:1.15em;font-weight:600;box-shadow:0 2px 8px rgba(33,150,243,0.12)">Đóng</button>
            `;
            document.body.appendChild(helpModal);
            document.getElementById('close-help').onclick = () => {
                helpModal.style.display = 'none';
            };
        } else {
            helpModal.style.display = 'block';
        }
    }
    if (helpBtn) {
        helpBtn.addEventListener('click', showHelpModal);
    }
if (soundToggle && soundIcon) {
    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
        // Nếu đang bật, phát lại âm thanh start-sound
        if (soundEnabled && startSound) {
            startSound.currentTime = 0;
            startSound.play();
        } else if (startSound) {
            startSound.pause();
        }
    });
}

function renderBoard() {
    board.innerHTML = '';
    cards.forEach((symbol, idx) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = idx;
        card.innerHTML = '<span style="visibility:hidden">'+symbol+'</span>';
        card.addEventListener('click', () => flipCard(card, symbol, idx));
        board.appendChild(card);
        card.title = 'Lật thẻ'; // Tooltip cho thẻ
    });
}

function flipCard(card, symbol, idx) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    card.innerHTML = '<span>'+symbol+'</span>';
    flipSound.currentTime = 0;
    flipSound.play();
    flippedCards.push({card, symbol, idx});
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            timer++;
            timerSpan.textContent = `Time: ${timer}s`;
        }, 1000);
    }
    if (flippedCards.length === 2) {
        moves++;
        movesSpan.textContent = `Moves: ${moves}`;
        checkMatch();
    }
}

function showConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.style.display = 'block';
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const ctx = confettiCanvas.getContext('2d');
    const confettiCount = 120;
    const confetti = [];
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height,
            r: Math.random() * 8 + 4,
            d: Math.random() * confettiCanvas.height,
            color: `hsl(${Math.random()*360},80%,60%)`,
            tilt: Math.random() * 10 - 5
        });
    }
    let angle = 0;
    let frame = 0;
    function drawConfetti() {
        ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
        for (let i = 0; i < confettiCount; i++) {
            let c = confetti[i];
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, c.r, c.r/2, c.tilt, 0, 2*Math.PI);
            ctx.fillStyle = c.color;
            ctx.fill();
        }
        updateConfetti();
        frame++;
        if (frame < 80) requestAnimationFrame(drawConfetti);
        else {
            ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
            confettiCanvas.style.display = 'none';
        }
    }
    function updateConfetti() {
        angle += 0.01;
        for (let i = 0; i < confettiCount; i++) {
            let c = confetti[i];
            c.y += Math.cos(angle + c.d) + 2 + c.r/2;
            c.x += Math.sin(angle);
            if (c.x > confettiCanvas.width || c.x < 0 || c.y > confettiCanvas.height) {
                c.x = Math.random() * confettiCanvas.width;
                c.y = -10;
            }
        }
    }
    drawConfetti();
}

function checkMatch() {
    const [first, second] = flippedCards;
    if (first.symbol === second.symbol) {
        first.card.classList.add('matched');
        second.card.classList.add('matched');
        matchedCards.push(first.idx, second.idx);
        flippedCards = [];
        if (matchSound) {
            matchSound.currentTime = 0;
            matchSound.play();
        }
        if (matchedCards.length === cards.length) {
            clearInterval(timerInterval);
            resultDiv.textContent = `You win! Moves: ${moves}, Time: ${timer}s`;
            winSound.currentTime = 0;
            winSound.play();
            showConfetti();
        }
    } else {
        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            first.card.innerHTML = '<span style="visibility:hidden">'+first.symbol+'</span>';
            second.card.innerHTML = '<span style="visibility:hidden">'+second.symbol+'</span>';
            flippedCards = [];
            failSound.currentTime = 0;
            failSound.play();
            // Hiệu ứng rung nhẹ trên mobile
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(200);
            }
            // Hiệu ứng chuyển màu khi thua
            if (gameScene) {
                gameScene.style.transition = 'background 0.3s';
                const oldBg = gameScene.style.background;
                gameScene.style.background = 'linear-gradient(135deg, #f44336 0%, #fffde4 100%)';
                setTimeout(() => { gameScene.style.background = oldBg; }, 400);
            }
        }, 800);
    }
}

restartBtn.addEventListener('click', () => {
    showScene('splash');
    // Reset trạng thái khi quay về splash
    cards = [];
    flippedCards = [];
    matchedCards = [];
    moves = 0;
    timer = 0;
    gameStarted = false;
    resultDiv.textContent = '';
    movesSpan.textContent = 'Moves: 0';
    timerSpan.textContent = 'Time: 0s';
    clearInterval(timerInterval);
    board.innerHTML = '';
    // Reset lại âm thanh start-sound
    if (startSound) {
        startSound.pause();
        startSound.currentTime = 0;
    }
});
    soundToggle.title = 'Bật/Tắt âm thanh'; // Tooltip
