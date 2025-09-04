// ================
// عناصر اصلی بازی
// ================
const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const splashScreen = document.getElementById('splash-screen');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const fireBtn = document.getElementById('fire-btn');
const musicControl = document.getElementById('music-control');
const musicIcon = document.getElementById('music-icon');

// ================
// متغیرهای بازی
// ================
let gameActive = false;
let score = 0;
let playerX = 50; // موقعیت بازیکن (درصد)
let enemies = [];
let bullets = [];
let enemyInterval, gameInterval;
let musicPlaying = false;

// موسیقی ورزشی انرژیزا
const bgMusic = new Audio();
bgMusic.loop = true;

// لیست آهنگ‌های ورزشی انرژیزا
const musicTracks = [
    "https://cdn.pixabay.com/download/audio/2021/08/09/audio_9b5d7fbaa7.mp3?filename=energetic-rock-142240.mp3",
    "https://cdn.pixabay.com/download/audio/2022/03/19/audio_0d5c9d2d5c.mp3?filename=action-sport-trailer-112571.mp3",
    "https://cdn.pixabay.com/download/audio/2021/10/29/audio_7dda2d4f92.mp3?filename=sports-action-11742.mp3"
];

// انتخاب تصادفی یک آهنگ
bgMusic.src = musicTracks[Math.floor(Math.random() * musicTracks.length)];

// ایجاد ابرهای زمینه
function createBackground() {
    for (let i = 0; i < 10; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = Math.random() * 120 + 60 + 'px';
        cloud.style.height = Math.random() * 50 + 30 + 'px';
        cloud.style.top = Math.random() * 40 + 10 + '%';
        cloud.style.opacity = Math.random() * 0.5 + 0.3;
        cloud.style.animationDuration = (Math.random() * 25 + 25) + 's';
        cloud.style.left = Math.random() * 100 + '%';
        game.appendChild(cloud);
    }
    
    for (let i = 0; i < 40; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 4 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        game.appendChild(star);
    }
}

// ایجاد ویژوالایزر موسیقی
function createVisualizer() {
    const visualizer = document.createElement('div');
    visualizer.className = 'visualizer';
    
    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.setProperty('--i', i);
        bar.style.setProperty('--height', Math.random() * 40 + 'px');
        bar.style.animationDuration = (Math.random() * 0.5 + 0.4) + 's';
        visualizer.appendChild(bar);
    }
    
    game.appendChild(visualizer);
}

// ================
// توابع کنترل بازی
// ================

// شروع بازی
function startGame() {
    gameActive = true;
    score = 0;
    playerX = 50;
    
    scoreElement.textContent = 'امتیاز: ' + score;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    player.style.left = '50%';
    
    // حذف تمام دشمنان و گلوله های قبلی
    document.querySelectorAll('.enemy, .bullet, .explosion').forEach(el => el.remove());
    enemies = [];
    bullets = [];
    
    // ایجاد زمینه
    document.querySelectorAll('.cloud, .star, .visualizer').forEach(el => el.remove());
    createBackground();
    createVisualizer();
    
    // شروع تولید دشمن
    if (enemyInterval) clearInterval(enemyInterval);
    enemyInterval = setInterval(createEnemy, 1600); // سرعت کمتری برای دشمنان
    
    // شروع به روزرسانی بازی
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 30);
    
    // پخش موسیقی
    if (musicPlaying) {
        bgMusic.play();
    }
}

// پایان بازی
function endGame() {
    gameActive = false;
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'flex';
    clearInterval(enemyInterval);
    clearInterval(gameInterval);
    
    // توقف موسیقی
    bgMusic.pause();
    
    // انیمیشن انفجار برای بازیکن
    const playerRect = player.getBoundingClientRect();
    createExplosion(playerRect.left + playerRect.width/2, playerRect.top + playerRect.height/2);
}

// ایجاد دشمن جدید
function createEnemy() {
    if (!gameActive) return;
    
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.textContent = '🛸';
    const enemyX = Math.random() * (window.innerWidth - 50) + 25;
    enemy.style.left = enemyX + 'px';
    enemy.style.top = '-50px';
    
    game.appendChild(enemy);
    enemies.push({
        element: enemy,
        x: enemyX,
        y: -50
    });
}

// شلیک گلوله
function fireBullet() {
    if (!gameActive) return;
    
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.textContent = '↑';
    
    const playerRect = player.getBoundingClientRect();
    const bulletX = playerRect.left + playerRect.width/2;
    const bulletY = playerRect.top;
    
    bullet.style.left = bulletX + 'px';
    bullet.style.top = bulletY + 'px';
    
    game.appendChild(bullet);
    bullets.push({
        element: bullet,
        x: bulletX,
        y: bulletY
    });
    
    // افکت شلیک
    player.style.transform = 'translateX(-50%) scale(1.1)';
    setTimeout(() => {
        player.style.transform = 'translateX(-50%) scale(1)';
    }, 100);
}

// ایجاد انفجار
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.textContent = '💥';
    explosion.style.left = x + 'px';
    explosion.style.top = y + 'px';
    game.appendChild(explosion);
    
    setTimeout(() => {
        explosion.remove();
    }, 500);
}

// تشخیص برخورد
function isColliding(rect1, rect2) {
    return rect1.left < rect2.right && 
           rect1.right > rect2.left && 
           rect1.top < rect2.bottom && 
           rect1.bottom > rect2.top;
}

// به روزرسانی موقعیت عناصر
function updateGame() {
    if (!gameActive) return;
    
    // حرکت دشمنان به پایین با سرعت کاهش یافته
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const enemyElement = enemy.element;
        
        // سرعت دشمنان کاهش یافت (از 3 به 2)
        enemy.y += 2;
        enemyElement.style.top = enemy.y + 'px';
        
        // دریافت مختصات فعلی برای تشخیص برخورد
        const enemyRect = enemyElement.getBoundingClientRect();
        
        // بررسی برخورد با بازیکن
        const playerRect = player.getBoundingClientRect();
        if (isColliding(playerRect, enemyRect)) {
            endGame();
            return;
        }
        
        // حذف دشمنان خارج شده
        if (enemy.y > window.innerHeight) {
            enemyElement.remove();
            enemies.splice(i, 1);
        }
    }
    
    // حرکت گلوله ها به سمت بالا
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        const bulletElement = bullet.element;
        
        // حرکت گلوله به سمت بالا
        bullet.y -= 10;
        bulletElement.style.top = bullet.y + 'px';
        
        // دریافت مختصات فعلی گلوله
        const bulletRect = bulletElement.getBoundingClientRect();
        
        // بررسی برخورد گلوله با دشمن
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const enemyRect = enemy.element.getBoundingClientRect();
            
            if (isColliding(bulletRect, enemyRect)) {
                // ایجاد انفجار در محل برخورد
                createExplosion(
                    (bulletRect.left + bulletRect.right) / 2,
                    (bulletRect.top + bulletRect.bottom) / 2
                );
                
                // حذف دشمن و گلوله
                enemy.element.remove();
                enemies.splice(j, 1);
                
                bulletElement.remove();
                bullets.splice(i, 1);
                
                // افزایش امتیاز
                score += 100;
                scoreElement.textContent = 'امتیاز: ' + score;
                break;
            }
        }
        
        // حذف گلوله های خارج شده
        if (bullet.y < -50) {
            bulletElement.remove();
            bullets.splice(i, 1);
        }
    }
}

// ================
// رویدادهای کنترل
// ================

// کنترل موسیقی
musicControl.addEventListener('click', () => {
    if (musicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🔇';
        musicPlaying = false;
    } else {
        bgMusic.play().catch(e => console.log("لطفا تعامل داشته باشید تا موسیقی پخش شود"));
        musicIcon.textContent = '🔊';
        musicPlaying = true;
    }
});

// شروع بازی
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

// حرکت به چپ
leftBtn.addEventListener('click', function() {
    if (gameActive) {
        playerX = Math.max(10, playerX - 8);
        player.style.left = playerX + '%';
    }
});

// حرکت به راست
rightBtn.addEventListener('click', function() {
    if (gameActive) {
        playerX = Math.min(90, playerX + 8);
        player.style.left = playerX + '%';
    }
});

// شلیک
fireBtn.addEventListener('click', function() {
    if (gameActive) {
        fireBullet();
    }
});

// کنترل لمسی برای دکمه ها
leftBtn.ontouchstart = function() {
    if (gameActive) {
        playerX = Math.max(10, playerX - 8);
        player.style.left = playerX + '%';
    }
};

rightBtn.ontouchstart = function() {
    if (gameActive) {
        playerX = Math.min(90, playerX + 8);
        player.style.left = playerX + '%';
    }
};

fireBtn.ontouchstart = function() {
    if (gameActive) {
        fireBullet();
    }
};

// کنترل صفحه کلید
document.addEventListener('keydown', function(e) {
    if (!gameActive) return;
    
    if (e.key === 'ArrowLeft') {
        playerX = Math.max(10, playerX - 8);
        player.style.left = playerX + '%';
    } else if (e.key === 'ArrowRight') {
        playerX = Math.min(90, playerX + 8);
        player.style.left = playerX + '%';
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        fireBullet();
    }
});

// اسپلش اسکرین و انتقال به صفحه اصلی
setTimeout(() => {
    splashScreen.style.display = 'none';
    startScreen.style.display = 'flex';
}, 3000);