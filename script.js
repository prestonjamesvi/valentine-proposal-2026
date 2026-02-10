document.addEventListener('DOMContentLoaded', function() {
    // Mobile detection and optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const config = window.VALENTINE_CONFIG;
    
    // Set page title
    document.title = config.pageTitle;
    
    // Set valentine's name
    document.getElementById('valentine-name').textContent = config.valentineName;
    
    // Set questions
    document.getElementById('question1').textContent = config.questions.first.text;
    document.getElementById('yes-btn1').textContent = config.questions.first.yesBtn;
    document.getElementById('no-btn1').textContent = config.questions.first.noBtn;
    document.getElementById('secret-message').textContent = config.questions.first.secretAnswer;
    
    document.getElementById('question2').textContent = config.questions.second.text;
    document.getElementById('meter-text').textContent = config.questions.second.startText;
    document.getElementById('next-btn').textContent = config.questions.second.nextBtn;
    
    document.getElementById('question3').textContent = config.questions.third.text;
    document.getElementById('yes-btn3').textContent = config.questions.third.yesBtn;
    document.getElementById('no-btn3').textContent = config.questions.third.noBtn;
    
    // Set celebration messages
    document.querySelector('.celebration-title').textContent = config.celebration.title;
    document.querySelector('.celebration-message').textContent = config.celebration.message;
    
    // Set colors
    document.body.style.background = `linear-gradient(135deg, ${config.colors.backgroundStart}, ${config.colors.backgroundEnd})`;
    document.querySelectorAll('.yes-btn, .next-btn').forEach(btn => {
        btn.style.backgroundColor = config.colors.buttonBackground;
        btn.addEventListener('mouseenter', () => btn.style.backgroundColor = config.colors.buttonHover);
        btn.addEventListener('mouseleave', () => btn.style.backgroundColor = config.colors.buttonBackground);
    });
    document.querySelector('.no-btn').style.backgroundColor = config.colors.textColor;
    
    // Adjust for mobile
    if (isMobile) {
        // Adjust floating emoji speed for mobile
        config.animations.floatDuration = "20s";
    }
    
    // Scene management
    const scenes = document.querySelectorAll('.scene');
    let currentScene = 1;
    
    function showScene(sceneNumber) {
        scenes.forEach(scene => scene.classList.remove('active'));
        document.getElementById(`scene${sceneNumber}`).classList.add('active');
        currentScene = sceneNumber;
    }
    
    // First scene interactions - FIXED SECRET MESSAGE
    const yesBtn1 = document.getElementById('yes-btn1');
    const noBtn1 = document.getElementById('no-btn1');
    const secretMessage = document.getElementById('secret-message');
    
    yesBtn1.addEventListener('click', () => showScene(2));
    
    // FIX: Make "No" button move and show secret message
    let noButtonMoved = false;
    
    noBtn1.addEventListener('mouseover', function() {
        if (!noButtonMoved) {
            moveNoButton(noBtn1);
            noButtonMoved = true;
        }
        secretMessage.style.opacity = '1';
    });
    
    noBtn1.addEventListener('touchstart', function() {
        if (!noButtonMoved) {
            moveNoButton(noBtn1);
            noButtonMoved = true;
        }
        secretMessage.style.opacity = '1';
    });
    
    noBtn1.addEventListener('click', function() {
        secretMessage.style.opacity = '1';
        setTimeout(() => {
            showScene(2);
        }, 1000);
    });
    
    function moveNoButton(button) {
        const containerRect = document.querySelector('.valentine-container').getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        // Calculate available space (keep button within container)
        const maxX = containerRect.width - buttonRect.width - 40;
        const maxY = containerRect.height - buttonRect.height - 40;
        
        // Make sure we have positive values
        const safeMaxX = Math.max(10, maxX);
        const safeMaxY = Math.max(10, maxY);
        
        // Random position within container
        const randomX = Math.random() * safeMaxX;
        const randomY = Math.random() * safeMaxY;
        
        // Apply new position
        button.style.position = 'absolute';
        button.style.left = `${randomX}px`;
        button.style.top = `${randomY}px`;
    }
    
    // FIXED LOVE METER - Can go beyond 100%
    const loveMeter = document.getElementById('love-meter');
    const meterFill = document.getElementById('meter-fill');
    const percentage = document.getElementById('percentage');
    const loveMessage = document.getElementById('love-message');
    
    // Change max value to allow going "beyond"
    loveMeter.max = 10000; // Allows up to 10000%!
    
    loveMeter.addEventListener('input', function() {
        const value = parseInt(this.value);
        
        // Calculate visual width (capped at 100% for display, but show higher percentage)
        const displayWidth = Math.min(100, value); // Never show more than 100% width
        meterFill.style.width = `${displayWidth}%`;
        
        // Show actual percentage (can go beyond 100%)
        percentage.textContent = `${value}%`;
        
        // Show messages based on percentage
        if (value > 5000) {
            loveMessage.textContent = config.loveMessages.extreme;
        } else if (value > 1000) {
            loveMessage.textContent = config.loveMessages.high;
        } else if (value > 100) {
            loveMessage.textContent = config.loveMessages.normal;
        } else {
            loveMessage.textContent = '';
        }
    });
    
    // Next button
    document.getElementById('next-btn').addEventListener('click', () => showScene(3));
    
    // Final scene - Fix moving "No" button here too
    const yesBtn3 = document.getElementById('yes-btn3');
    const noBtn3 = document.getElementById('no-btn3');
    let finalNoButtonMoved = false;
    
    yesBtn3.addEventListener('click', function() {
        showScene(4);
        createHeartExplosion();
        startCelebration();
    });
    
    noBtn3.addEventListener('mouseover', function() {
        if (!finalNoButtonMoved) {
            moveNoButton(this);
            finalNoButtonMoved = true;
        }
    });
    
    noBtn3.addEventListener('touchstart', function() {
        if (!finalNoButtonMoved) {
            moveNoButton(this);
            finalNoButtonMoved = true;
        }
    });
    
    noBtn3.addEventListener('click', function() {
        // Move button again if clicked
        moveNoButton(this);
        
        // Encourage to click Yes instead
        setTimeout(() => {
            alert("Come on, you know you want to say Yes! 💙");
        }, 500);
    });
    
    // Floating emojis
    function createFloatingEmojis() {
        const container = document.getElementById('floating-emojis');
        const allEmojis = [...config.floatingEmojis.hearts, ...config.floatingEmojis.bears];
        
        // Create 20 floating emojis
        for (let i = 0; i < 20; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = allEmojis[Math.floor(Math.random() * allEmojis.length)];
            
            // Random starting position
            const startX = Math.random() * 100;
            emoji.style.left = `${startX}vw`;
            
            // Random size
            const size = 20 + Math.random() * 30;
            emoji.style.fontSize = `${size}px`;
            
            // Random animation duration
            const duration = 10 + Math.random() * 20;
            emoji.style.animationDuration = `${duration}s`;
            
            // Random animation delay
            emoji.style.animationDelay = `${Math.random() * 5}s`;
            
            // Random sideways movement
            const distance = parseInt(config.animations.floatDistance);
            const floatDistance = distance + Math.random() * distance;
            emoji.style.setProperty('--float-distance', `${floatDistance}px`);
            
            container.appendChild(emoji);
        }
    }
    
    // Heart explosion effect
    function createHeartExplosion() {
        const container = document.getElementById('hearts-container');
        const hearts = ['💖', '💗', '💓', '💞', '💕', '💝'];
        
        // Create 50 heart particles
        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            // Random starting position (center)
            heart.style.left = '50%';
            heart.style.top = '50%';
            
            // Random explosion direction and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            
            // Random size
            const size = 0.8 + Math.random() * 1.2;
            heart.style.transform = `scale(${size})`;
            
            // Random color
            const hue = Math.random() * 60; // Red-pink hues
            heart.style.color = `hsl(${hue}, 100%, 65%)`;
            
            container.appendChild(heart);
            
            // Remove after animation
            setTimeout(() => heart.remove(), 1000);
        }
    }
    
    // Celebration effects
    function startCelebration() {
        // Add celebration emojis
        const celebrationEmojis = config.celebration.emojis.split('');
        const emojiContainer = document.querySelector('.celebration-emojis');
        emojiContainer.innerHTML = '';
        
        celebrationEmojis.forEach(emojiChar => {
            const emoji = document.createElement('span');
            emoji.className = 'emoji';
            emoji.textContent = emojiChar;
            emojiContainer.appendChild(emoji);
        });
        
        // Create more floating hearts
        setTimeout(createFloatingEmojis, 1000);
        
        // Play celebration sound if music is enabled
        if (config.music.enabled) {
            const music = document.getElementById('background-music');
            music.volume = config.music.volume;
            if (config.music.autoplay) {
                music.play().catch(e => console.log("Autoplay blocked:", e));
            }
        }
    }
    
    // Music controls
    const musicToggle = document.getElementById('music-toggle');
    const musicText = document.getElementById('music-text');
    const backgroundMusic = document.getElementById('background-music');
    let musicPlaying = false;
    
    if (config.music.enabled) {
        musicToggle.style.display = 'block';
        musicText.textContent = config.music.startText;
        backgroundMusic.volume = config.music.volume;
        
        musicToggle.addEventListener('click', function() {
            if (musicPlaying) {
                backgroundMusic.pause();
                musicText.textContent = config.music.startText;
            } else {
                backgroundMusic.play().catch(e => {
                    alert("Please click the play button to start music!");
                    console.log("Music play failed:", e);
                });
                musicText.textContent = config.music.stopText;
            }
            musicPlaying = !musicPlaying;
        });
        
        // Try autoplay
        if (config.music.autoplay) {
            setTimeout(() => {
                backgroundMusic.play().catch(e => {
                    console.log("Autoplay was blocked:", e);
                });
            }, 1000);
        }
    } else {
        musicToggle.style.display = 'none';
    }
    
    // Initialize floating emojis
    createFloatingEmojis();
});
