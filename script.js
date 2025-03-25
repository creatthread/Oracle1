const characters = ['牛', '龟', '肉', '鱼', '贝', '火', '水', '象', '又'];
let selectedBubbles = [];
let canClick = true;
let startTime = null;
let timerInterval = null;

// 生成游戏元素
function initGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    document.getElementById('result').innerHTML = '';
    
    // 生成配对数据（每个字符包含甲骨文和现代汉字）
    const pairs = characters.flatMap(char => [
        { char, type: 'oracle' },  // 甲骨文图片
        { char, type: 'modern' }   // 现代汉字
    ]).sort(() => Math.random() - 0.5);
    
    // 创建18个泡泡（9对）
    pairs.forEach(({ char, type }) => createBubble(char, type));
    
    startTimer();
    startTime = Date.now();
    canClick = true;
    selectedBubbles = [];
}

// 创建单个泡泡
function createBubble(char, type) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.dataset.char = char;
    bubble.dataset.type = type;
    bubble.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;

    if (type === 'oracle') {
        bubble.style.backgroundImage = `url('images/${char}.png')`;
    } else {
        bubble.textContent = char;
    }

    bubble.addEventListener('click', () => handleBubbleClick(bubble));
    document.getElementById('gameBoard').appendChild(bubble);
}

// 点击处理
function handleBubbleClick(bubble) {
    if (!canClick || bubble.classList.contains('selected')) return;
    
    playSound();
    bubble.classList.add('selected');
    selectedBubbles.push(bubble);
    
    if (selectedBubbles.length === 2) {
        canClick = false;
        setTimeout(checkMatch, 600);
    }
}

// 匹配检查
function checkMatch() {
    const [b1, b2] = selectedBubbles;
    const isSameChar = b1.dataset.char === b2.dataset.char;
    const isDifferentType = b1.dataset.type !== b2.dataset.type;
    
    if (isSameChar && isDifferentType) {
        b1.classList.add('matched');
        b2.classList.add('matched');
        checkWin();
    } else {
        b1.classList.remove('selected');
        b2.classList.remove('selected');
    }
    
    selectedBubbles = [];
    canClick = true;
}

// 播放音效
function playSound() {
    const audio = new Audio('bubble.mp3');
    audio.playbackRate = 2.0;
    audio.play();
}

// 胜利检测
function checkWin() {
    const remaining = document.querySelectorAll('.bubble:not(.matched)');
    if (remaining.length === 0) {
        clearInterval(timerInterval);
        const time = ((Date.now() - startTime)/1000).toFixed(1);
        document.getElementById('result').innerHTML = `
            🎉 恭喜挑战成功！<br>
            ⏱ 用时：${time}秒<br>
            <button onclick="initGame()" class="restart-btn">再玩一次</button>
        `;
    }
}

// 计时器
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    document.body.appendChild(timerElement);
    
    timerInterval = setInterval(() => {
        const time = ((Date.now() - startTime)/1000).toFixed(1);
        timerElement.textContent = `⏱ ${time}秒`;
    }, 100);
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame);