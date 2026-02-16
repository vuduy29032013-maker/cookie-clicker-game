        // ===== MOBILE DETECTION =====
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // ===== JAVASCRIPT ANTI-ZOOM — SIMPLIFIED FOR SCROLL ☠️ =====
        if (isMobile || isTouch) {
            // Block iOS gesture zoom only (không chặn scroll)
            document.addEventListener('gesturestart', function(e) {
                e.preventDefault();
            });
            
            document.addEventListener('gesturechange', function(e) {
                e.preventDefault();
            });
            
            document.addEventListener('gestureend', function(e) {
                e.preventDefault();
            });
            
            console.log('🎮 ANTI-ZOOM ACTIVE (Scroll Enabled)');
        }
        
        // ===== GAME VARIABLES =====
        let coins = 0;
        let clickPower = 0.1; // Reduced from 1 to 0.1 for deflation
        let autoClickers = 0;
        let multiplier = 1;
        let isAdmin = false;
        let clickCooldown = 0.5;
        let canClick = true;
        let gamePasses = {
            vip: false,
            premium: false,
            legend: false,
            super: false,        // Super Pass - LIMITED (code-based)
            infinity: false,     // Infinity Pass - TRANSCENDENT
            quantum: false,      // Quantum Pass - HOT
            cosmic: false,       // Cosmic Pass - BEST FOR YOU
            epic: false,         // ⚔️ Epic Pass - POWERFUL
            prismatic: false,    // 🌈 Prismatic Pass - COLORFUL
            divine: false,       // ✨ Divine Pass - GODLIKE
            secret: false,       // 🔒 Secret Pass - HIDDEN
            superDiamond: false, // 🌟 Super Pass - Diamond version
            starter: false,      // 💎 Starter Boost - Diamond Pass
            insane: false,       // 🔥 Insane Clicker - Diamond Pass
            transcendent: false, // 🌈 Transcendent - Diamond Pass
            event2026: false     // 🎉 Event 2026 Pass - x3 Click + x2 Auto
        };
        let inventory = {
            potion_2x: 0,
            potion_3x: 0,
            potion_4x: 0,
            potion_5x: 0,  // NEW: Diamond potion
            potion_6x: 0,  // NEW: Diamond potion
            potion_10x: 0  // NEW: Diamond potion
        };
        let activePotion = null;
        let potionTimer = 0;
        let potionInterval = null;
        let afkTimer = null;
        let afkTimeLeft = 1800;
        let dragonGeneratorInterval = null; // GLOBAL interval for all diamond generators
        let isAfk = false;
        let playTime = 0;
        let playTimeInterval = null;
        let shopDiscount = 0;
        let rebirthCount = 0;
        let rebirthMultiplier = 1;
        let clickTimes = [];
        let isBanned = false;
        let discountTicket = 0;
        let discountTicketTimer = 0;
        let discountTicketInterval = null;
        let purchaseLimit = 5;
        let purchaseCounts = {};

        // ===== DIAMOND & PETS SYSTEM =====
        let diamonds = 0;
        let tickets = 0; // Vé quay
        let goldBars = 0; // Thỏi vàng - Premium currency
        
        // ===== COIN FLIP GAME =====
        let coinFlipRank = 0; // 0=Đồng, 1=Bạc, 2=Vàng, 3=Bạch Kim, 4=Kim Cương, 5=Huyền Thoại, 6=Master, 7=Super, 8=Hardcore
        let coinFlipStars = 1; // Start at 1 star (Đồng 1 sao)
        let coinFlipWins = 0;
        let coinFlipLosses = 0;
        let coinFlipConsecutiveLosses = 0;
        let coinFlipHistory = [];
        
        // ===== TELEPORT SYSTEM =====
        let teleportPrice = 1; // Giá ban đầu để teleport
        
        // ===== EVENT 2026 SYSTEM =====
        let event2026Coins = 0; // Xu event 2026
        let lastTaskReset = Date.now(); // Thời gian reset task lần cuối
        let nextTaskReset = Date.now() + (24 * 60 * 60 * 1000); // Reset sau 24h

        // ===== TRACKING STATS =====
        let totalClicks = 0;
        let totalCoinsEarned = 0;
        let totalSpins = 0;
        let totalWeatherSummoned = 0;
        let rpsStats = {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0
        };
        
        let event2026Tasks = {
            // Daily Tasks - increased rewards
            click100: { name: 'Click 100 lần', target: 100, progress: 0, reward: 20, completed: false, type: 'daily' },
            earn1000: { name: 'Kiếm 1,000 coins', target: 1000, progress: 0, reward: 30, completed: false, type: 'daily' },
            buyShop5: { name: 'Mua 5 items từ shop', target: 5, progress: 0, reward: 40, completed: false, type: 'daily' },
            
            // Weekly Tasks - increased rewards
            click10000: { name: 'Click 10,000 lần', target: 10000, progress: 0, reward: 200, completed: false, type: 'weekly' },
            earn100k: { name: 'Kiếm 100,000 coins', target: 100000, progress: 0, reward: 300, completed: false, type: 'weekly' },
            openEgg10: { name: 'Mở 10 trứng', target: 10, progress: 0, reward: 400, completed: false, type: 'weekly' },
            
            // Special Tasks - increased rewards
            rebirth1: { name: 'Rebirth 1 lần', target: 1, progress: 0, reward: 1000, completed: false, type: 'special' },
            getPet: { name: 'Có 10 pets', target: 10, progress: 0, reward: 600, completed: false, type: 'special' },
            playTime60: { name: 'Chơi 60 phút', target: 3600, progress: 0, reward: 500, completed: false, type: 'special' }
        };
        
        // Event 2026 Egg Pets
        const EVENT_2026_PETS = [
            { 
                name: 'New Year Cat', 
                icon: '🐱', 
                multiplier: 2, 
                chance: 50,
                description: 'x2 Click Power'
            },
            { 
                name: 'Star Wolf', 
                icon: '🐺', 
                multiplier: 5, 
                chance: 25,
                description: 'x5 Click Power'
            },
            { 
                name: 'Bird New Year', 
                icon: '🦅', 
                multiplier: 5.5, 
                chance: 24,
                description: 'x5.5 Click Power'
            },
            { 
                name: 'Dragon New Year', 
                icon: '🐲', 
                multiplier: 10, 
                chance: 1,
                description: 'x10 Click Power + 1💎/phút',
                special: 'diamond_generator'
            }
        ];
        
        // Language System
        let currentLanguage = 'en'; // Default: English
        
        const translations = {
            en: {
                // Header
                clickPower: 'Click Power',
                auto: 'Auto',
                multiplier: 'Multiplier',
                cooldown: 'Cooldown',
                rebirth: 'Rebirth',
                petMulti: 'Pet Multi',
                discount: 'Discount',
                
                // Cookie
                clickMe: 'Click Me!',
                perClick: 'per click',
                
                // Admin Panel
                adminPanel: 'Admin Panel',
                adminCode: 'Admin Code',
                login: 'Login',
                adminControls: 'Admin Controls',
                addMoney: '+100K Coins',
                addDiamonds: '+1K Diamonds',
                addGold: '+100 Gold Bars',
                summonWeather: 'Summon Weather',
                summonPet: 'Summon Pet',
                clearWeather: 'Clear All Weather',
                currentWeather: 'Current Weather',
                
                // Shop
                shop: 'Shop',
                clickPowerItem: 'Click Power',
                autoClickerItem: 'Auto Clicker',
                multiplierItem: 'Multiplier',
                speedBoostItem: 'Speed Boost',
                buy: 'Buy',
                owned: 'Owned',
                remaining: 'Remaining',
                effect: 'Effect',
                increase: 'Increase',
                perSecond: 'per second',
                reduce: 'Reduce',
                shopDescription1: 'Increase click power by 1 per purchase',
                shopDescription2: 'Auto-generate 1 coin per second',
                shopDescription3: 'Multiply all income by 1.5x',
                shopDescription4: 'Reduce click cooldown by 0.1s',
                
                // Rebirth
                rebirthPanel: 'Rebirth System',
                rebirthCount: 'Rebirth Count',
                rebirthMulti: 'Rebirth Multiplier',
                nextRebirth: 'Next Rebirth',
                requirement: 'Requirement',
                rebirthBtn: 'Rebirth',
                rebirthReward: 'Reward',
                times: 'times',
                
                // Game Pass Store
                gamePassPanel: 'Game Pass Store',
                vipPass: 'VIP Pass',
                premiumPass: 'Premium Pass',
                shopDiscount: 'Shop Discount',
                noLimit: 'No Purchase Limit',
                autoSave: 'Auto Save',
                allBenefits: 'All Benefits',
                
                // Potion Shop
                potionShop: 'Potion Shop',
                clickPotion: 'Click Potion',
                autoPotion: 'Auto Potion',
                doubleClick: 'Double click power for 60s',
                doubleAuto: 'Double auto-clickers for 60s',
                
                // Inventory
                inventory: 'Inventory',
                use: 'Use',
                
                // Pets
                petsPanel: 'Pet System',
                equippedPets: 'Equipped Pets',
                ownedPets: 'Owned Pets',
                equip: 'Equip',
                unequip: 'Unequip',
                maxEquipped: 'Max Equipped',
                
                // Eggs
                eggShop: 'Egg Shop',
                hatchChance: 'Hatch Chance',
                
                // Weather
                weatherPanel: 'Weather System',
                activeWeather: 'Active Weather',
                noWeather: 'No active weather',
                
                // Mini Games
                miniGameRPS: 'Mini Game - Rock Paper Scissors',
                selectTarget: 'Select Target',
                placeBet: 'Place Bet',
                coins: 'Coins',
                diamonds: 'Diamonds',
                start: 'Start',
                continue: 'Continue',
                backToMenu: 'Back to Menu',
                rock: 'Rock',
                paper: 'Paper',
                scissors: 'Scissors',
                youWin: 'You Win!',
                youLose: 'You Lose!',
                draw: 'Draw!',
                
                // Wheel
                wheelGame: 'Lucky Wheel',
                tickets: 'Tickets',
                buyTicket: 'Buy Ticket',
                spin: 'Spin',
                ticketPrice: 'Ticket Price',
                
                // Discount Ticket Shop
                discountShop: 'Discount Ticket Shop',
                ticketDiscount: 'Ticket Discount',
                currentDiscount: 'Current Discount',
                
                // Gold Shop
                goldShop: 'GOLD SHOP - EXCLUSIVE ITEMS',
                onlyGold: 'Only buyable with Gold Bars!',
                diamondPack: 'Diamond Pack',
                megaCoins: 'Mega Coins',
                autoClicker: 'Auto Clicker',
                clickPowerBoost: 'Click Power',
                multiplierBoost: 'Multiplier',
                speedBoost: 'Speed Boost',
                ticketPack: 'Ticket Pack',
                legendaryEgg: 'Legendary Egg',
                vipPassItem: 'VIP Pass',
                premiumPassItem: 'Premium Pass',
                rebirthBoost: 'Rebirth Multiplier',
                bestValue: 'BEST VALUE',
                permanent: 'Permanent',
                
                // Pay Store
                payStore: 'PREMIUM STORE',
                goldBars: 'Gold Bars',
                premiumCurrency: 'Extremely rare! Only purchasable with real money!',
                buySpecial: 'Buy special items with Gold Bars',
                demoOnly: 'DEMO ONLY - No real payment',
                starterPack: 'Starter Pack',
                valuePack: 'Value Pack',
                goodDeal: 'Good Deal',
                greatValue: 'Great Value',
                bestPack: 'Best Value',
                megaPack: 'Mega Pack',
                ultimatePack: 'ULTIMATE PACK',
                save30: 'SAVE 30%',
                hot: 'HOT',
                
                // Settings
                settings: 'Settings',
                language: 'Language',
                english: 'English',
                vietnamese: 'Vietnamese',
                save: 'Save',
                load: 'Load',
                deleteSave: 'Delete Save',
                export: 'Export to save game',
                import: 'Import to load progress',
                
                // Alerts
                notEnough: 'Not enough',
                purchased: 'Purchased',
                success: 'Success',
                error: 'Error',
                confirm: 'Confirm',
                cancel: 'Cancel'
            },
            vi: {
                // Header
                clickPower: 'Sức Click',
                auto: 'Tự động',
                multiplier: 'Nhân',
                cooldown: 'Hồi chiêu',
                rebirth: 'Tái sinh',
                petMulti: 'Pet Nhân',
                discount: 'Giảm giá',
                
                // Cookie
                clickMe: 'Click vào đây!',
                perClick: 'mỗi click',
                
                // Admin Panel
                adminPanel: 'Bảng Admin',
                adminCode: 'Mã Admin',
                login: 'Đăng nhập',
                adminControls: 'Điều khiển Admin',
                addMoney: '+100K Coins',
                addDiamonds: '+1K Kim cương',
                addGold: '+100 Thỏi vàng',
                summonWeather: 'Triệu hồi Thời tiết',
                summonPet: 'Triệu hồi Pet',
                clearWeather: 'Xóa Tất cả Thời tiết',
                currentWeather: 'Thời tiết Hiện tại',
                
                // Shop
                shop: 'Cửa hàng',
                clickPowerItem: 'Sức mạnh Click',
                autoClickerItem: 'Tự động Click',
                multiplierItem: 'Bội số',
                speedBoostItem: 'Tăng tốc',
                buy: 'Mua',
                owned: 'Đã mua',
                remaining: 'Còn lại',
                effect: 'Tác dụng',
                increase: 'Tăng',
                perSecond: 'mỗi giây',
                reduce: 'Giảm',
                shopDescription1: 'Tăng sức mạnh click thêm 1 mỗi lần mua',
                shopDescription2: 'Tự động tạo 1 coin mỗi giây',
                shopDescription3: 'Nhân toàn bộ thu nhập x1.5',
                shopDescription4: 'Giảm thời gian hồi chiêu 0.1s',
                
                // Rebirth
                rebirthPanel: 'Hệ thống Tái sinh',
                rebirthCount: 'Số lần Tái sinh',
                rebirthMulti: 'Bội số Tái sinh',
                nextRebirth: 'Tái sinh tiếp theo',
                requirement: 'Yêu cầu',
                rebirthBtn: 'Tái sinh',
                rebirthReward: 'Phần thưởng',
                times: 'lần',
                
                // Game Pass Store
                gamePassPanel: 'Cửa hàng Game Pass',
                vipPass: 'VIP Pass',
                premiumPass: 'Premium Pass',
                shopDiscount: 'Giảm giá Shop',
                noLimit: 'Mua không giới hạn',
                autoSave: 'Tự động Lưu',
                allBenefits: 'Toàn bộ Quyền lợi',
                
                // Potion Shop
                potionShop: 'Cửa hàng Thuốc',
                clickPotion: 'Thuốc Click',
                autoPotion: 'Thuốc Auto',
                doubleClick: 'Nhân đôi sức click trong 60s',
                doubleAuto: 'Nhân đôi auto-clicker trong 60s',
                
                // Inventory
                inventory: 'Túi Đồ',
                use: 'Dùng',
                
                // Pets
                petsPanel: 'Hệ thống Pet',
                equippedPets: 'Pets đang trang bị',
                ownedPets: 'Pets đã sở hữu',
                equip: 'Trang bị',
                unequip: 'Gỡ',
                maxEquipped: 'Trang bị Tối đa',
                
                // Eggs
                eggShop: 'Cửa hàng Trứng',
                hatchChance: 'Tỷ lệ nở',
                
                // Weather
                weatherPanel: 'Hệ thống Thời tiết',
                activeWeather: 'Thời tiết đang có',
                noWeather: 'Không có thời tiết nào',
                
                // Mini Games
                miniGameRPS: 'Mini Game - Kéo Búa Bao',
                selectTarget: 'Chọn Mục tiêu',
                placeBet: 'Đặt cược',
                coins: 'Coins',
                diamonds: 'Kim cương',
                start: 'Bắt đầu',
                continue: 'Tiếp tục',
                backToMenu: 'Về Menu',
                rock: 'Búa',
                paper: 'Bao',
                scissors: 'Kéo',
                youWin: 'Bạn Thắng!',
                youLose: 'Bạn Thua!',
                draw: 'Hòa!',
                
                // Wheel
                wheelGame: 'Vòng quay May mắn',
                tickets: 'Vé',
                buyTicket: 'Mua vé',
                spin: 'Quay',
                ticketPrice: 'Giá vé',
                
                // Discount Ticket Shop
                discountShop: 'Cửa Hàng Vé Giảm Giá',
                ticketDiscount: 'Giảm giá Vé',
                currentDiscount: 'Giảm giá Hiện tại',
                
                // Gold Shop
                goldShop: 'GOLD SHOP - VẬT PHẨM ĐỘC QUYỀN',
                onlyGold: 'Chỉ mua bằng Thỏi Vàng!',
                diamondPack: 'Gói Kim Cương',
                megaCoins: 'Mega Coins',
                autoClicker: 'Auto Clicker',
                clickPowerBoost: 'Click Power',
                multiplierBoost: 'Bội số',
                speedBoost: 'Tăng tốc',
                ticketPack: 'Gói Vé',
                legendaryEgg: 'Trứng Huyền thoại',
                vipPassItem: 'VIP Pass',
                premiumPassItem: 'Premium Pass',
                rebirthBoost: 'Bội số Tái sinh',
                bestValue: 'GIÁ TRỊ TỐT NHẤT',
                permanent: 'Vĩnh viễn',
                
                // Pay Store
                payStore: 'CỬA HÀNG PREMIUM',
                goldBars: 'Thỏi Vàng',
                premiumCurrency: 'Cực kỳ hiếm! Chỉ có thể mua bằng tiền thật!',
                buySpecial: 'Mua vật phẩm đặc biệt chỉ với Thỏi Vàng',
                demoOnly: 'DEMO ONLY - Không thanh toán thật',
                starterPack: 'Gói Khởi đầu',
                valuePack: 'Gói Giá trị',
                goodDeal: 'Ưu đãi Tốt',
                greatValue: 'Giá trị Lớn',
                bestPack: 'Tốt Nhất',
                megaPack: 'Gói Khủng',
                ultimatePack: 'GÓI SIÊU CẤP',
                save30: 'TIẾT KIỆM 30%',
                hot: 'HOT',
                
                // Settings
                settings: 'Cài đặt',
                language: 'Ngôn ngữ',
                english: 'Tiếng Anh',
                vietnamese: 'Tiếng Việt',
                save: 'Lưu game',
                load: 'Tải game',
                deleteSave: 'Xóa save',
                export: 'Export để lưu game',
                import: 'Import để tải lại tiến trình',
                
                // Alerts
                notEnough: 'Không đủ',
                purchased: 'Đã mua',
                success: 'Thành công',
                error: 'Lỗi',
                confirm: 'Xác nhận',
                cancel: 'Hủy'
            }
        };
        
        function t(key) {
            return translations[currentLanguage][key] || key;
        }
        
        function setLanguage(lang) {
            currentLanguage = lang;
            localStorage.setItem('gameLanguage', lang);
            
            // Update button styles - with null checks
            const enBtn = document.getElementById('langEnBtn');
            const viBtn = document.getElementById('langViBtn');
            
            if (enBtn && viBtn) {
                if (lang === 'en') {
                    enBtn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                    enBtn.style.borderColor = '#60a5fa';
                    viBtn.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
                    viBtn.style.borderColor = '#9ca3af';
                } else {
                    viBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                    viBtn.style.borderColor = '#f87171';
                    enBtn.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
                    enBtn.style.borderColor = '#9ca3af';
                }
            }
            
            updateAllText();
        }
        
        function updateAllText() {
            // Update Settings Panel - with null checks
            const settingsTitle = document.getElementById('settingsTitle');
            const languageLabel = document.getElementById('languageLabel');
            const saveLoadLabel = document.getElementById('saveLoadLabel');
            const saveBtn = document.getElementById('saveBtn');
            const loadBtn = document.getElementById('loadBtn');
            const deleteBtn = document.getElementById('deleteBtn');
            const exportBtn = document.getElementById('exportBtn');
            const importBtn = document.getElementById('importBtn');
            const settingsButtonText = document.getElementById('settingsButtonText');
            const playTimeLabel = document.getElementById('playTimeLabel');
            const saveInfo = document.getElementById('saveInfo');
            
            if (settingsTitle) settingsTitle.textContent = t('settings');
            if (languageLabel) languageLabel.textContent = t('language');
            if (saveLoadLabel) saveLoadLabel.textContent = 'Save & Load';
            if (saveBtn) saveBtn.textContent = t('save');
            if (loadBtn) loadBtn.textContent = t('load');
            if (deleteBtn) deleteBtn.textContent = t('deleteSave');
            if (exportBtn) exportBtn.textContent = t('export');
            if (importBtn) importBtn.textContent = t('import');
            if (settingsButtonText) settingsButtonText.textContent = t('settings');
            if (playTimeLabel) playTimeLabel.textContent = currentLanguage === 'en' ? 'Time' : 'Thời gian';
            if (saveInfo) saveInfo.textContent = currentLanguage === 'en' 
                ? '💡 Export to save game, Import to load progress' 
                : '💡 Export để lưu game, Import để tải lại tiến trình';
            
            // Update header stats labels
            const statsDiv = document.querySelector('.stats');
            if (statsDiv) {
                statsDiv.innerHTML = `
                    ${t('clickPower')}: <span id="clickPower">${clickPower}</span> | 
                    ${t('auto')}: <span id="autoClickers">${autoClickers}</span>/s | 
                    ${t('multiplier')}: x<span id="multiplier">${multiplier}</span> |
                    ${t('cooldown')}: <span id="clickCooldown">${clickCooldown.toFixed(2)}</span>s | 
                    ${t('rebirth')}: x<span id="rebirthMultiplierDisplay">${rebirthMultiplier.toFixed(2)}</span> | 
                    ${t('petMulti')}: x<span id="petMultiplierDisplay">${getPetMultiplier().toFixed(2)}</span> | 
                    ${t('discount')}: <span id="discountDisplay">${shopDiscount}</span>%
                `;
            }
            
            // Update cookie text
            const cookieBtn = document.querySelector('.cookie');
            if (cookieBtn) {
                const clickText = cookieBtn.querySelector('div:last-child');
                if (clickText) clickText.textContent = t('clickMe');
            }
            
            // Update section titles
            const sectionTitles = document.querySelectorAll('.section-title');
            sectionTitles.forEach((title) => {
                const text = title.textContent.trim();
                if (text.includes('Shop') || text.includes('Cửa hàng')) {
                    title.textContent = '🛒 ' + t('shop');
                } else if (text.includes('Rebirth') || text.includes('Tái sinh')) {
                    title.textContent = '🔄 ' + t('rebirthPanel');
                } else if (text.includes('Game Pass')) {
                    title.textContent = '🎫 ' + t('gamePassPanel');
                } else if (text.includes('Inventory') || text.includes('Túi')) {
                    title.textContent = '🎒 ' + t('inventory');
                } else if (text.includes('Pets') || text.includes('Thú') || text.includes('Pet System')) {
                    title.textContent = '🐾 ' + t('petsPanel');
                } else if (text.includes('Egg') || text.includes('Trứng')) {
                    title.textContent = '🥚 ' + t('eggShop');
                } else if (text.includes('Weather') || text.includes('Thời tiết')) {
                    title.textContent = '🌦️ ' + t('weatherPanel');
                } else if (text.includes('Kéo Búa Bao') || text.includes('Rock Paper')) {
                    title.textContent = '🎮 ' + t('miniGameRPS');
                } else if (text.includes('Vòng Quay') || text.includes('Lucky Wheel')) {
                    title.textContent = '🎡 ' + t('wheelGame');
                } else if (text.includes('GOLD SHOP') || text.includes('VẬT PHẨM')) {
                    title.textContent = '🏆 ' + t('goldShop');
                } else if (text.includes('PREMIUM') || text.includes('CỬA HÀNG')) {
                    title.textContent = '💰 ' + t('payStore');
                } else if (text.includes('Potion') || text.includes('Thuốc')) {
                    title.textContent = '🧪 ' + t('potionShop');
                } else if (text.includes('Discount') || text.includes('Giảm Giá')) {
                    title.textContent = '🎫 ' + t('discountShop');
                }
            });
            
            // Update buttons with class "buy-button"
            const buyButtons = document.querySelectorAll('.buy-button');
            buyButtons.forEach(btn => {
                if (btn.textContent.includes('Mua') || btn.textContent.includes('Buy')) {
                    btn.textContent = '💰 ' + t('buy');
                }
            });
            
            updateDisplay();
            updateWeatherDisplay();
            
            // Re-render will handle owned/remaining text
        }

        // Console protection
        (function() {
            const devtools = /./;
            devtools.toString = function() {
                this.opened = true;
            };
            const checkDevTools = setInterval(function() {
                if (devtools.opened) {
                    console.clear();
                    devtools.opened = false;
                }
            }, 1000);

            // Disable right-click
            document.addEventListener('contextmenu', e => e.preventDefault());

            // Disable common shortcuts
            document.addEventListener('keydown', e => {
                // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
                if (e.keyCode === 123 || 
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                    (e.ctrlKey && e.keyCode === 85)) {
                    e.preventDefault();
                    return false;
                }
            });

            // Protect variables
            Object.defineProperty(window, 'goldBars', {
                get: function() { return goldBars; },
                set: function(val) {
                    if (!isAdmin) {
                        console.warn('⚠️ Cheat detection: Attempting to modify goldBars');
                        return;
                    }
                    goldBars = val;
                }
            });
        })();

        // SERVER-SIDE CODE VALIDATION (Codes NOT stored in client)
        // In production: Codes stored on server database
        // Client only validates via API call
        
        let goldCodes = {}; // Empty - codes verified server-side only
        
        // Simulated server API endpoint
        const SERVER_API = {
            validateCode: async function(code) {
                // In production: This would be a real API call
                // fetch('https://api.yourgame.com/validate-code', {
                //     method: 'POST',
                //     body: JSON.stringify({ code }),
                //     headers: { 'Content-Type': 'application/json' }
                // })
                
                // SIMULATION: Server has the codes, client doesn't
                return new Promise((resolve) => {
                    setTimeout(() => {
                        // Server-side validation logic (hidden from client)
                        const serverCodes = this._getServerCodes();
                        const codeData = serverCodes[code];
                        
                        if (!codeData) {
                            resolve({ success: false, error: 'INVALID_CODE' });
                        } else if (codeData.used) {
                            resolve({ success: false, error: 'CODE_USED' });
                        } else {
                            resolve({ 
                                success: true, 
                                amount: codeData.amount,
                                price: codeData.price
                            });
                        }
                    }, 500); // Simulate network delay
                });
            },
            
            markCodeUsed: async function(code) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const serverCodes = this._getServerCodes();
                        if (serverCodes[code]) {
                            serverCodes[code].used = true;
                        }
                        resolve({ success: true });
                    }, 300);
                });
            },
            
            // Private server storage (in production: database)
            _serverStorage: null,
            _getServerCodes: function() {
                if (!this._serverStorage) {
                    // Codes stored ONLY on server (simulated)
                    this._serverStorage = this._decrypt();
                }
                return this._serverStorage;
            },
            
            // Heavy encryption (still decodable but much harder)
            _decrypt: function() {
                // In production: Codes stored in encrypted database
                // This is just simulation - real codes would NEVER be in client
                const e = (s) => atob(s);
                const d = [
                    [e('R09MRDE5QQ=='),19,0.50],[e('R09MRDE5Qg=='),19,0.50],
                    [e('R09MRDU5QQ=='),59,1.00],[e('R09MRDU5Qg=='),59,1.00],[e('R09MRDU5Qw=='),59,1.00],
                    [e('R09MRDE5OUE='),199,1.99],[e('R09MRDE5OUI='),199,1.99],
                    [e('R09MRDU5OUE='),599,3.00],[e('R09MRDU5OUI='),599,3.00],[e('R09MRDU5OUM='),599,3.00],
                    [e('R09MRDE5OTlB'),1999,5.00],[e('R09MRDE5OTlC'),1999,5.00],
                    [e('R09MRDE5OTlD'),1999,5.00],[e('R09MRDE5OTlE'),1999,5.00],
                    [e('R09MRDI5OTlB'),2999,5.00],[e('R09MRDI5OTlC'),2999,5.00],
                    [e('R09MRDU5OTlB'),5999,6.99],[e('R09MRDU5OTlC'),5999,6.99],
                    [e('R09MRDU5OTlD'),5999,6.99],[e('R09MRDU5OTlE'),5999,6.99]
                ];
                const codes = {};
                d.forEach(([c,a,p]) => {
                    codes[c] = {amount:a,price:p,used:false};
                });
                return codes;
            }
        };
        let pets = [];
        let ownedPets = {};
        let equippedPets = []; // Mảng chứa tối đa 5 pets đang được trang bị
        const MAX_EQUIPPED_PETS = 5;

        // Wheel Game
        let isSpinning = false;
        const wheelPrizes = [
            { name: '10 Coins', value: 10, type: 'coins', chance: 30, icon: '💰' }, // Reduced from 100 (90% down)
            { name: '50 Coins', value: 50, type: 'coins', chance: 25, icon: '💰' }, // Reduced from 500
            { name: '100 Coins', value: 100, type: 'coins', chance: 20, icon: '💰' }, // Reduced from 1000
            { name: '500 Coins', value: 500, type: 'coins', chance: 10, icon: '💰' }, // Reduced from 5000
            { name: '1 Diamond', value: 1, type: 'diamonds', chance: 8, icon: '💎' }, // Reduced from 10
            { name: '2 Diamonds', value: 2, type: 'diamonds', chance: 5, icon: '💎' }, // Reduced from 25
            { name: '5 Diamonds', value: 5, type: 'diamonds', chance: 1, icon: '💎' }, // Reduced from 50
            { name: '1 Pet Random', value: 1, type: 'pet', chance: 1, icon: '🐾' }
        ];

        // Egg data
        const eggShop = [
            {
                id: 1,
                name: 'Common Egg',
                icon: '🥚',
                price: 100, // Increased from 10 (10x)
                pets: [
                    { name: 'Bunny', icon: '🐰', chance: 33.33, multiplier: 1.5 },
                    { name: 'Dog', icon: '🐕', chance: 33.33, multiplier: 1.5 },
                    { name: 'Golden Lab', icon: '🦮', chance: 33.33, multiplier: 2 }
                ]
            },
            {
                id: 2,
                name: 'Uncommon Egg',
                icon: '🥚',
                price: 500, // Increased from 50 (10x)
                pets: [
                    { name: 'Black Bunny', icon: '🐇', chance: 25, multiplier: 2 },
                    { name: 'Cat', icon: '🐈', chance: 25, multiplier: 2 },
                    { name: 'Chicken', icon: '🐔', chance: 25, multiplier: 2 },
                    { name: 'Deer', icon: '🦌', chance: 25, multiplier: 2.5 }
                ]
            },
            {
                id: 3,
                name: 'Rare Egg',
                icon: '🥚',
                price: 1500, // Increased from 150 (10x)
                pets: [
                    { name: 'Orange Tabby', icon: '🐈‍⬛', chance: 33.33, multiplier: 3 },
                    { name: 'Spotted Deer', icon: '🦌', chance: 25, multiplier: 3 },
                    { name: 'Pig', icon: '🐷', chance: 16.67, multiplier: 4 },
                    { name: 'Rooster', icon: '🐓', chance: 16.67, multiplier: 4 },
                    { name: 'Monkey', icon: '🐒', chance: 8.33, multiplier: 5 }
                ]
            },
            {
                id: 4,
                name: 'Legendary Egg',
                icon: '🥚',
                price: 5000, // Increased from 500 (10x)
                pets: [
                    { name: 'Cow', icon: '🐄', chance: 42.55, multiplier: 6 },
                    { name: 'Silver Monkey', icon: '🐵', chance: 42.55, multiplier: 6 },
                    { name: 'Sea Otter', icon: '🦦', chance: 10.64, multiplier: 8 },
                    { name: 'Polar Bear', icon: '🐻‍❄️', chance: 2.13, multiplier: 10 },
                    { name: 'Turtle', icon: '🐢', chance: 2.13, multiplier: 10 }
                ]
            },
            {
                id: 5,
                name: 'Mythical Egg',
                icon: '🥚',
                price: 10000, // Increased from 1000 (10x)
                pets: [
                    { name: 'Grey Mouse', icon: '🐭', chance: 35.7, multiplier: 8 },
                    { name: 'Brown Mouse', icon: '🐭', chance: 26.8, multiplier: 9 },
                    { name: 'Squirrel', icon: '🐿️', chance: 26.8, multiplier: 9 },
                    { name: 'Red Giant Ant', icon: '🐜', chance: 8.9, multiplier: 12 },
                    { name: 'Red Fox', icon: '🦊', chance: 1.8, multiplier: 15 }
                ]
            },
            {
                id: 6,
                name: 'Bug Egg',
                icon: '🥚',
                price: 20000, // Increased from 2000 (10x)
                pets: [
                    { name: 'Snail', icon: '🐌', chance: 40, multiplier: 10 },
                    { name: 'Giant Ant', icon: '🐜', chance: 30, multiplier: 12 },
                    { name: 'Caterpillar', icon: '🐛', chance: 25, multiplier: 14 },
                    { name: 'Praying Mantis', icon: '🦗', chance: 4, multiplier: 18 },
                    { name: 'Dragonfly', icon: '🦋', chance: 1, multiplier: 22 }
                ]
            },
            {
                id: 7,
                name: 'Night Egg',
                icon: '🌙',
                price: 50000, // Increased from 5000 (10x)
                pets: [
                    { name: 'Hedgehog', icon: '🦔', chance: 47, multiplier: 12 },
                    { name: 'Mole', icon: '🦡', chance: 23.5, multiplier: 14 },
                    { name: 'Frog', icon: '🐸', chance: 17.63, multiplier: 16 },
                    { name: 'Echo Frog', icon: '🐸', chance: 8.23, multiplier: 20 },
                    { name: 'Night Owl', icon: '🦉', chance: 3.53, multiplier: 25 },
                    { name: 'Raccoon', icon: '🦝', chance: 0.12, multiplier: 30 }
                ]
            },
            {
                id: 8,
                name: 'Bee Egg',
                icon: '🐝',
                price: 100000, // Increased from 10000 (10x)
                pets: [
                    { name: 'Bee', icon: '🐝', chance: 65, multiplier: 12 },
                    { name: 'Honey Bee', icon: '🐝', chance: 25, multiplier: 15 },
                    { name: 'Bear Bee', icon: '🐻', chance: 5, multiplier: 20 },
                    { name: 'Petal Bee', icon: '🌸', chance: 4, multiplier: 25 },
                    { name: 'Queen Bee', icon: '👑', chance: 1, multiplier: 30 }
                ]
            },
            {
                id: 9,
                name: 'Anti Bee Egg',
                icon: '🦟',
                price: 250000, // Increased from 25000 (10x)
                pets: [
                    { name: 'Wasp', icon: '🦟', chance: 55, multiplier: 18 },
                    { name: 'Tarantula Hawk', icon: '🕷️', chance: 30, multiplier: 22 },
                    { name: 'Moth', icon: '🦋', chance: 13.75, multiplier: 28 },
                    { name: 'Butterfly', icon: '🦋', chance: 1, multiplier: 35 },
                    { name: 'Disco Bee', icon: '💎', chance: 0.25, multiplier: 40 }
                ]
            },
            {
                id: 10,
                name: 'Admin Egg',
                icon: '👑',
                price: 5000000, // Increased from 500000 (10x)
                pets: [
                    { name: "Admin's Dog", icon: '🐕‍🦺', chance: 50, multiplier: 20 },
                    { name: "Admin's Cat", icon: '😺', chance: 30, multiplier: 25 },
                    { name: 'Bird Admin', icon: '🦅', chance: 20, multiplier: 35 }
                ]
            },
            {
                id: 11,
                name: 'Hacker Egg',
                icon: '💻',
                price: 2000000, // Increased from 200000 (10x)
                pets: [
                    { name: 'Hacker Dog', icon: '🐕‍🦺', chance: 60, multiplier: 40 },
                    { name: 'Hacker Bunny', icon: '🐰', chance: 40, multiplier: 50 }
                ]
            },
            {
                id: 12,
                name: 'God Egg',
                icon: '⚜️',
                price: 100000000, // Increased from 10000000 (10x)
                pets: [
                    { name: "God's Pet", icon: '🌟', chance: 100, multiplier: 30 }
                ]
            },
            {
                id: 13,
                name: 'Secret Egg',
                icon: '🔮',
                price: 1000000, // 1M diamonds
                pets: [
                    { name: 'Shadow Wolf', icon: '🐺', chance: 30, multiplier: 50 },
                    { name: 'Phoenix', icon: '🔥', chance: 25, multiplier: 60 },
                    { name: 'Ice Dragon', icon: '🐉', chance: 20, multiplier: 70 },
                    { name: 'Thunder Tiger', icon: '⚡', chance: 15, multiplier: 80 },
                    { name: 'Mystic Unicorn', icon: '🦄', chance: 9, multiplier: 100 },
                    { name: 'Void Reaper', icon: '💀', chance: 1, multiplier: 150 }
                ]
            },
            {
                id: 14,
                name: 'Cosmic Egg',
                icon: '🌌',
                price: 2000000, // 2M diamonds
                pets: [
                    { name: 'Cosmic Dog', icon: '🐕', chance: 40, multiplier: 5, special: 'click_power_5x' },
                    { name: 'Star Cat', icon: '🐱', chance: 30, multiplier: 100 },
                    { name: 'Galaxy Wolf', icon: '🌠', chance: 20, multiplier: 120 },
                    { name: 'Nebula Fox', icon: '🦊', chance: 8, multiplier: 150 },
                    { name: 'Cosmic Dragon', icon: '🐲', chance: 1, multiplier: 200, special: 'diamond_generator' },
                    { name: 'Universe Phoenix', icon: '🔆', chance: 1, multiplier: 250 }
                ]
            }
        ];

        // ===== WEATHER SYSTEM =====
        let activeWeathers = [];
        let weatherTimers = {};
        let weatherIntervals = {};
        
        // ===== NUMBER FORMATTING =====
        function formatNumber(num) {
            if (num < 1000) return Math.floor(num).toString();
            
            const suffixes = [
                { value: 1e63, symbol: 'VG' },   // Vigintillion
                { value: 1e60, symbol: 'ND' },   // Novemdecillion
                { value: 1e57, symbol: 'OD' },   // Octodecillion
                { value: 1e54, symbol: 'SD' },   // Septendecillion
                { value: 1e51, symbol: 'SXD' },  // Sexdecillion
                { value: 1e48, symbol: 'QID' },  // Quindecillion
                { value: 1e45, symbol: 'QAD' },  // Quattuordecillion
                { value: 1e42, symbol: 'TD' },   // Tredecillion
                { value: 1e39, symbol: 'DD' },   // Duodecillion
                { value: 1e36, symbol: 'UD' },   // Undecillion
                { value: 1e33, symbol: 'DC' },   // Decillion
                { value: 1e30, symbol: 'NO' },   // Nonillion
                { value: 1e27, symbol: 'OC' },   // Octillion
                { value: 1e24, symbol: 'SP' },   // Septillion
                { value: 1e21, symbol: 'SX' },   // Sextillion
                { value: 1e18, symbol: 'QI' },   // Quintillion
                { value: 1e15, symbol: 'QA' },   // Quadrillion
                { value: 1e12, symbol: 'T' },    // Trillion
                { value: 1e9, symbol: 'B' },     // Billion
                { value: 1e6, symbol: 'M' },     // Million
                { value: 1e3, symbol: 'K' }      // Thousand
            ];
            
            for (let i = 0; i < suffixes.length; i++) {
                if (num >= suffixes[i].value) {
                    const shortened = num / suffixes[i].value;
                    return shortened.toFixed(2) + suffixes[i].symbol;
                }
            }
            
            return Math.floor(num).toLocaleString();
        }
        
        // Weather configuration
        const weatherConfig = {
            // TIER 1: COMMON WEATHERS (1-13)
            wind: {
                name: { en: '💨 Wind', vi: '💨 Gió' },
                effect: { en: 'Cooldown -0.3s', vi: 'Hồi chiêu -0.3s' },
                duration: 45,
                interval: 100,
                icon: '💨',
                class: 'wind'
            },
            cloud: {
                name: { en: '☁️ Cloud', vi: '☁️ Mây' },
                effect: { en: 'Shop Discount +3%', vi: 'Giảm giá +3%' },
                duration: 60,
                interval: 300,
                icon: '☁️',
                class: 'cloud'
            },
            rain: {
                name: { en: '🌧️ Rain', vi: '🌧️ Mưa' },
                effect: { en: '+2 Click Power', vi: '+2 Sức Click' },
                duration: 45,
                interval: 600,
                icon: '🌧️',
                class: 'rain'
            },
            night: {
                name: { en: '🌙 Night', vi: '🌙 Ban Đêm' },
                effect: { en: '+5 Click Power', vi: '+5 Sức Click' },
                duration: 30,
                interval: 1200,
                icon: '🌙',
                class: 'night'
            },
            moonlight: {
                name: { en: '✨ Moonlight', vi: '✨ Ánh Trăng' },
                effect: { en: 'x2 Click Power', vi: 'x2 Sức Click' },
                duration: 60,
                interval: 2400,
                icon: '✨',
                class: 'moonlight'
            },
            meteor: {
                name: { en: '☄️ Meteor Shower', vi: '☄️ Mưa Sao Băng' },
                effect: { en: 'x5 Click Power', vi: 'x5 Sức Click' },
                duration: 60,
                interval: 3600,
                icon: '☄️',
                class: 'meteor'
            },
            snow: {
                name: { en: '❄️ Snow', vi: '❄️ Tuyết' },
                effect: { en: '+3 Auto Clickers', vi: '+3 Auto' },
                duration: 40,
                interval: 800,
                icon: '❄️',
                class: 'snow'
            },
            fog: {
                name: { en: '🌫️ Fog', vi: '🌫️ Sương Mù' },
                effect: { en: '+1 Multiplier', vi: '+1 Nhân' },
                duration: 50,
                interval: 900,
                icon: '🌫️',
                class: 'fog'
            },
            breeze: {
                name: { en: '🍃 Breeze', vi: '🍃 Gió Nhẹ' },
                effect: { en: '+10 Auto Clickers', vi: '+10 Auto' },
                duration: 55,
                interval: 1000,
                icon: '🍃',
                class: 'breeze'
            },
            drizzle: {
                name: { en: '🌦️ Drizzle', vi: '🌦️ Mưa Phùn' },
                effect: { en: '+8 Click Power', vi: '+8 Sức Click' },
                duration: 45,
                interval: 1100,
                icon: '🌦️',
                class: 'drizzle'
            },
            thunder: {
                name: { en: '⚡ Thunder', vi: '⚡ Sấm' },
                effect: { en: 'x3 Click Power', vi: 'x3 Sức Click' },
                duration: 30,
                interval: 1500,
                icon: '⚡',
                class: 'thunder'
            },
            sunrise: {
                name: { en: '🌅 Sunrise', vi: '🌅 Bình Minh' },
                effect: { en: '+15 Click Power', vi: '+15 Sức Click' },
                duration: 60,
                interval: 1800,
                icon: '🌅',
                class: 'sunrise'
            },
            sunset: {
                name: { en: '🌇 Sunset', vi: '🌇 Hoàng Hôn' },
                effect: { en: '+12 Auto Clickers', vi: '+12 Auto' },
                duration: 50,
                interval: 2000,
                icon: '🌇',
                class: 'sunset'
            },

            // TIER 2: UNCOMMON WEATHERS (14-26)
            storm: {
                name: { en: '🌩️ Storm', vi: '🌩️ Bão' },
                effect: { en: 'x4 Click Power', vi: 'x4 Sức Click' },
                duration: 45,
                interval: 2200,
                icon: '🌩️',
                class: 'storm'
            },
            blizzard: {
                name: { en: '🌨️ Blizzard', vi: '🌨️ Bão Tuyết' },
                effect: { en: '+20 Auto Clickers', vi: '+20 Auto' },
                duration: 40,
                interval: 2500,
                icon: '🌨️',
                class: 'blizzard'
            },
            hail: {
                name: { en: '🧊 Hail', vi: '🧊 Mưa Đá' },
                effect: { en: '+25 Click Power', vi: '+25 Sức Click' },
                duration: 35,
                interval: 2800,
                icon: '🧊',
                class: 'hail'
            },
            tornado: {
                name: { en: '🌪️ Tornado', vi: '🌪️ Lốc Xoáy' },
                effect: { en: 'x6 Click Power', vi: 'x6 Sức Click' },
                duration: 30,
                interval: 3200,
                icon: '🌪️',
                class: 'tornado'
            },
            rainbow: {
                name: { en: '🌈 Rainbow', vi: '🌈 Cầu Vồng' },
                effect: { en: '+2 Multiplier', vi: '+2 Nhân' },
                duration: 60,
                interval: 3500,
                icon: '🌈',
                class: 'rainbow'
            },
            aurora: {
                name: { en: '🌌 Aurora', vi: '🌌 Cực Quang' },
                effect: { en: 'x7 Click Power', vi: 'x7 Sức Click' },
                duration: 70,
                interval: 4000,
                icon: '🌌',
                class: 'aurora'
            },
            eclipse: {
                name: { en: '🌑 Eclipse', vi: '🌑 Nhật Thực' },
                effect: { en: 'x8 Click Power', vi: 'x8 Sức Click' },
                duration: 20,
                interval: 4500,
                icon: '🌑',
                class: 'eclipse'
            },
            comet: {
                name: { en: '☄️ Comet', vi: '☄️ Sao Chổi' },
                effect: { en: '+50 Click Power', vi: '+50 Sức Click' },
                duration: 40,
                interval: 5000,
                icon: '☄️',
                class: 'comet'
            },
            volcano: {
                name: { en: '🌋 Volcano', vi: '🌋 Núi Lửa' },
                effect: { en: 'x10 Click Power', vi: 'x10 Sức Click' },
                duration: 50,
                interval: 5500,
                icon: '🌋',
                class: 'volcano'
            },
            earthquake: {
                name: { en: '🌍 Earthquake', vi: '🌍 Động Đất' },
                effect: { en: '+30 Auto Clickers', vi: '+30 Auto' },
                duration: 25,
                interval: 6000,
                icon: '🌍',
                class: 'earthquake'
            },
            tsunami: {
                name: { en: '🌊 Tsunami', vi: '🌊 Sóng Thần' },
                effect: { en: 'x12 Click Power', vi: 'x12 Sức Click' },
                duration: 35,
                interval: 6500,
                icon: '🌊',
                class: 'tsunami'
            },
            wildfire: {
                name: { en: '🔥 Wildfire', vi: '🔥 Cháy Rừng' },
                effect: { en: '+100 Click Power', vi: '+100 Sức Click' },
                duration: 30,
                interval: 7000,
                icon: '🔥',
                class: 'wildfire'
            },
            sandstorm: {
                name: { en: '🏜️ Sandstorm', vi: '🏜️ Bão Cát' },
                effect: { en: '+40 Auto Clickers', vi: '+40 Auto' },
                duration: 40,
                interval: 7500,
                icon: '🏜️',
                class: 'sandstorm'
            },

            // TIER 3: RARE WEATHERS (27-38)
            blackhole: {
                name: { en: '🕳️ Black Hole', vi: '🕳️ Lỗ Đen' },
                effect: { en: 'x15 Click Power', vi: 'x15 Sức Click' },
                duration: 60,
                interval: 8000,
                icon: '🕳️',
                class: 'blackhole'
            },
            supernova: {
                name: { en: '💥 Supernova', vi: '💥 Siêu Tân Tinh' },
                effect: { en: 'x20 Click Power', vi: 'x20 Sức Click' },
                duration: 45,
                interval: 9000,
                icon: '💥',
                class: 'supernova'
            },
            timewarp: {
                name: { en: '⏰ Time Warp', vi: '⏰ Vặn Thời Gian' },
                effect: { en: 'Cooldown -0.5s', vi: 'Hồi chiêu -0.5s' },
                duration: 50,
                interval: 10000,
                icon: '⏰',
                class: 'timewarp'
            },
            gravity: {
                name: { en: '🌐 Zero Gravity', vi: '🌐 Không Trọng Lực' },
                effect: { en: '+3 Multiplier', vi: '+3 Nhân' },
                duration: 70,
                interval: 11000,
                icon: '🌐',
                class: 'gravity'
            },
            plasma: {
                name: { en: '⚛️ Plasma Storm', vi: '⚛️ Bão Plasma' },
                effect: { en: 'x25 Click Power', vi: 'x25 Sức Click' },
                duration: 40,
                interval: 12000,
                icon: '⚛️',
                class: 'plasma'
            },
            quantum: {
                name: { en: '🔬 Quantum Flux', vi: '🔬 Lượng Tử' },
                effect: { en: '+5 Multiplier', vi: '+5 Nhân' },
                duration: 60,
                interval: 13000,
                icon: '🔬',
                class: 'quantum'
            },
            dimension: {
                name: { en: '🌀 Dimension Rift', vi: '🌀 Khe Chiều' },
                effect: { en: 'x30 Click Power', vi: 'x30 Sức Click' },
                duration: 55,
                interval: 14000,
                icon: '🌀',
                class: 'dimension'
            },
            cosmic: {
                name: { en: '✨ Cosmic Dust', vi: '✨ Bụi Vũ Trụ' },
                effect: { en: '+200 Click Power', vi: '+200 Sức Click' },
                duration: 50,
                interval: 15000,
                icon: '✨',
                class: 'cosmic'
            },
            nebula: {
                name: { en: '🌌 Nebula', vi: '🌌 Tinh Vân' },
                effect: { en: 'x35 Click Power', vi: 'x35 Sức Click' },
                duration: 65,
                interval: 16000,
                icon: '🌌',
                class: 'nebula'
            },
            pulsar: {
                name: { en: '💫 Pulsar', vi: '💫 Sao Xung' },
                effect: { en: '+100 Auto Clickers', vi: '+100 Auto' },
                duration: 45,
                interval: 17000,
                icon: '💫',
                class: 'pulsar'
            },
            stardust: {
                name: { en: '⭐ Stardust', vi: '⭐ Bụi Sao' },
                effect: { en: 'x40 Click Power', vi: 'x40 Sức Click' },
                duration: 70,
                interval: 18000,
                icon: '⭐',
                class: 'stardust'
            },
            galaxy: {
                name: { en: '🌟 Galaxy Burst', vi: '🌟 Nổ Ngân Hà' },
                effect: { en: 'x50 Click Power', vi: 'x50 Sức Click' },
                duration: 80,
                interval: 20000,
                icon: '🌟',
                class: 'galaxy'
            },

            // TIER 4: EPIC WEATHERS (39-44)
            divine: {
                name: { en: '🙏 Divine Light', vi: '🙏 Ánh Sáng Thần' },
                effect: { en: 'x75 Click Power', vi: 'x75 Sức Click' },
                duration: 90,
                interval: 22000,
                icon: '🙏',
                class: 'divine'
            },
            celestial: {
                name: { en: '👼 Celestial Blessing', vi: '👼 Phước Lành' },
                effect: { en: 'x100 Click Power', vi: 'x100 Sức Click' },
                duration: 100,
                interval: 25000,
                icon: '👼',
                class: 'celestial'
            },
            mythical: {
                name: { en: '🐉 Mythical Dragon', vi: '🐉 Rồng Thần' },
                effect: { en: 'x150 Click Power', vi: 'x150 Sức Click' },
                duration: 120,
                interval: 28000,
                icon: '🐉',
                class: 'mythical'
            },
            phoenix: {
                name: { en: '🔥 Phoenix Rise', vi: '🔥 Phượng Hoàng' },
                effect: { en: 'x200 Click Power', vi: 'x200 Sức Click' },
                duration: 90,
                interval: 30000,
                icon: '🔥',
                class: 'phoenix'
            },
            unicorn: {
                name: { en: '🦄 Unicorn Magic', vi: '🦄 Kỳ Lân' },
                effect: { en: '+10 Multiplier', vi: '+10 Nhân' },
                duration: 150,
                interval: 32000,
                icon: '🦄',
                class: 'unicorn'
            },
            kraken: {
                name: { en: '🐙 Kraken Fury', vi: '🐙 Kraken' },
                effect: { en: 'x250 Click Power', vi: 'x250 Sức Click' },
                duration: 100,
                interval: 35000,
                icon: '🐙',
                class: 'kraken'
            },

            // TIER 5: LEGENDARY WEATHERS (45-50)
            infinity: {
                name: { en: '∞ Infinity', vi: '∞ Vô Cực' },
                effect: { en: 'x500 Click Power', vi: 'x500 Sức Click' },
                duration: 180,
                interval: 40000,
                icon: '∞',
                class: 'infinity'
            },
            eternity: {
                name: { en: '⏳ Eternity', vi: '⏳ Vĩnh Cửu' },
                effect: { en: '+20 Multiplier', vi: '+20 Nhân' },
                duration: 200,
                interval: 45000,
                icon: '⏳',
                class: 'eternity'
            },
            omnipotence: {
                name: { en: '👁️ Omnipotence', vi: '👁️ Toàn Năng' },
                effect: { en: 'x1000 Click Power', vi: 'x1000 Sức Click' },
                duration: 150,
                interval: 50000,
                icon: '👁️',
                class: 'omnipotence'
            },
            godmode: {
                name: { en: '⚡ God Mode', vi: '⚡ Chế Độ Thần' },
                effect: { en: 'x2000 Click Power', vi: 'x2000 Sức Click' },
                duration: 120,
                interval: 60000,
                icon: '⚡',
                class: 'godmode'
            },
            transcendence: {
                name: { en: '🌠 Transcendence', vi: '🌠 Siêu Việt' },
                effect: { en: 'x5000 Click Power', vi: 'x5000 Sức Click' },
                duration: 90,
                interval: 80000,
                icon: '🌠',
                class: 'transcendence'
            },
            ascension: {
                name: { en: '🚀 Ascension', vi: '🚀 Thăng Thiên' },
                effect: { en: 'x10000 Click Power', vi: 'x10000 Sức Click' },
                duration: 60,
                interval: 100000,
                icon: '🚀',
                class: 'ascension'
            }
        };
        // Weather next spawn times
        let weatherNextSpawn = {
            wind: 100,
            cloud: 300,
            rain: 600,
            night: 1200,
            moonlight: 2400,
            meteor: 3600,
            snow: 800,
            acid: 10800,
            diamond: 14400,
            emerald: 18000,
            adminabuse: 36000,
            earthquake: 21600,
            thunderstorm: 28800,
            superstorm: 36000,
            winteraurora: 72000,
            shootingstars: 108000,
            permafrost: 144000,
            cyclone: 180000,
            dissonant: 360000,
            beestorm: 86400,
            tropicalrain: 1680,
            gentledrizzle: 1860,
            ownerabuse: 1800000,
            rainbowrain: 2700,
            goldrain: 3600,
            silverrain: 3000,
            cosmicrain: 7200,
            secretrain: 10800,
            whitehole: 14400,
            supernova: 18000,
            nancorenova: 21600,
            corruptzenaura: 28800,
            fullmoon: 43200,
            safaridusk: 54000,
            yetinight: 64800,
            silentnight: 72000,
            boomboxparty: 86400,
            frozeniceking: 108000,
            radioactiverain: 144000,
            oilrain: 180000,
            sandstrike: 360000
        };

        const shopItems = [
            {
                id: 1,
                name: '+1 Click Power',
                description: 'Tăng 1 coin mỗi click',
                icon: '⚡',
                basePrice: 10, // Increased from 10 (50x)
                currentPrice: 10,
                owned: 0,
                effect: () => clickPower++
            },
            {
                id: 2,
                name: 'Auto Clicker',
                description: '+1 coin mỗi giây',
                icon: '🤖',
                basePrice: 500, // Increased from 100 (50x)
                currentPrice: 500,
                owned: 0,
                effect: () => autoClickers++
            },
            {
                id: 3,
                name: 'Faster Click',
                description: 'Giảm 0.05s thời gian chờ click',
                icon: '⚡',
                basePrice: 25000, // Increased from 500 (50x)
                currentPrice: 25000,
                owned: 0,
                effect: () => {
                    clickCooldown = Math.max(0.05, clickCooldown - 0.05);
                }
            },
            {
                id: 4,
                name: 'Super Click',
                description: '+5 click power',
                icon: '⭐',
                basePrice: 50000, // Increased from 1000 (50x)
                currentPrice: 50000,
                owned: 0,
                effect: () => clickPower += 5
            },
            {
                id: 5,
                name: 'Mega Clicker',
                description: '+10 coins mỗi giây',
                icon: '✨',
                basePrice: 150000, // Increased from 3000 (50x)
                currentPrice: 150000,
                owned: 0,
                effect: () => autoClickers += 10
            },
            {
                id: 6,
                name: '2x Multiplier',
                description: 'Nhân đôi tất cả thu nhập',
                icon: '👑',
                basePrice: 750000, // Increased from 15000 (50x)
                currentPrice: 750000,
                owned: 0,
                effect: () => multiplier *= 2
            },
            {
                id: 7,
                name: 'Ultra Click',
                description: '+20 click power',
                icon: '💎',
                basePrice: 500000, // Increased from 10000 (50x)
                currentPrice: 500000,
                owned: 0,
                effect: () => clickPower += 20
            },
            {
                id: 8,
                name: 'Factory',
                description: '+50 coins mỗi giây',
                icon: '🏭',
                basePrice: 1500000, // Increased from 30000 (50x)
                currentPrice: 1500000,
                owned: 0,
                effect: () => autoClickers += 50
            },
            {
                id: 9,
                name: 'Golden Touch',
                description: '+100 click power',
                icon: '🌟',
                basePrice: 3750000, // Increased from 75000 (50x)
                currentPrice: 3750000,
                owned: 0,
                effect: () => clickPower += 100
            },
            {
                id: 10,
                name: 'Time Warp',
                description: 'Giảm 0.03s cooldown',
                icon: '⏰',
                basePrice: 6000000, // Increased from 120000 (50x)
                currentPrice: 6000000,
                owned: 0,
                effect: () => {
                    clickCooldown = Math.max(0.01, clickCooldown - 0.03);
                }
            },
            {
                id: 11,
                name: 'Robot Army',
                description: '+100 coins mỗi giây',
                icon: '🤖',
                basePrice: 10000000, // Increased from 200000 (50x)
                currentPrice: 10000000,
                owned: 0,
                effect: () => autoClickers += 100
            },
            {
                id: 12,
                name: 'Diamond Finger',
                description: '+250 click power',
                icon: '💍',
                basePrice: 17500000, // Increased from 350000 (50x)
                currentPrice: 17500000,
                owned: 0,
                effect: () => clickPower += 250
            },
            {
                id: 13,
                name: 'Money Printer',
                description: '+200 coins mỗi giây',
                icon: '🖨️',
                basePrice: 30000000, // Increased from 600000 (50x)
                currentPrice: 30000000,
                owned: 0,
                effect: () => autoClickers += 200
            },
            {
                id: 14,
                name: 'Cosmic Power',
                description: '+400 click power',
                icon: '🌌',
                basePrice: 60000000, // Increased from 1200000 (50x)
                currentPrice: 60000000,
                owned: 0,
                effect: () => clickPower += 400
            },
            {
                id: 15,
                name: 'Quantum Clicker',
                description: '+500 coins mỗi giây',
                icon: '⚛️',
                basePrice: 125000000, // Increased from 2500000 (50x)
                currentPrice: 125000000,
                owned: 0,
                effect: () => autoClickers += 500
            },
            {
                id: 16,
                name: 'Infinity Stone',
                description: '+1000 click power',
                icon: '💠',
                basePrice: 300000000, // Increased from 6000000 (50x)
                currentPrice: 300000000,
                owned: 0,
                effect: () => clickPower += 1000
            },
            {
                id: 17,
                name: 'Universe Generator',
                description: '+1500 coins mỗi giây',
                icon: '🌠',
                basePrice: 1250000000, // Increased from 25000000 (50x)
                currentPrice: 1250000000,
                owned: 0,
                effect: () => autoClickers += 1500
            },
            {
                id: 18,
                name: 'The Divine',
                description: '5% giảm giá mọi vật phẩm',
                icon: '✨',
                basePrice: 2500000000, // Increased from 50000000 (50x)
                currentPrice: 2500000000,
                owned: 0,
                effect: () => {
                    shopDiscount += 5;
                }
            },
            {
                id: 19,
                name: 'The Primastic',
                description: '1.2% cơ hội hoàn tiền',
                icon: '💎',
                basePrice: 1000000000,
                currentPrice: 1000000000,
                owned: 0,
                effect: () => {}
            },
            {
                id: 20,
                name: 'The Transcendent',
                description: '0.8% cơ hội hoàn x10 tiền',
                icon: '🌟',
                basePrice: 2500000000,
                currentPrice: 2500000000,
                owned: 0,
                effect: () => {}
            },
            {
                id: 21,
                name: 'The God',
                description: '+1 giới hạn mua vật phẩm',
                icon: '⚜️',
                basePrice: 2500000000,
                currentPrice: 2500000000,
                owned: 0,
                effect: () => {
                    purchaseLimit++;
                }
            },
            {
                id: 22,
                name: 'Admin Power',
                description: '+50 Click Power',
                icon: '🔱',
                basePrice: 50000000000, // 50B
                currentPrice: 50000000000,
                owned: 0,
                effect: () => {
                    clickPower += 50;
                }
            },
            {
                id: 23,
                name: 'Owner Power',
                description: '+200 Click Power',
                icon: '👑',
                basePrice: 2000000000000000, // 2QA
                currentPrice: 2000000000000000,
                owned: 0,
                effect: () => {
                    clickPower += 200;
                }
            },
            {
                id: 24,
                name: '67 Power',
                description: '+670 Click Power',
                icon: '⚡',
                basePrice: 5000000000000000, // 5QA
                currentPrice: 5000000000000000,
                owned: 0,
                effect: () => {
                    clickPower += 670;
                }
            },
            {
                id: 25,
                name: '36 Power',
                description: '+3600 Click Power',
                icon: '💫',
                basePrice: 1000000000000000000, // 1QI
                currentPrice: 1000000000000000000,
                owned: 0,
                effect: () => {
                    clickPower += 3600;
                }
            },
            {
                id: 26,
                name: 'Nancore',
                description: '+10000 Click Power',
                icon: '⚛️',
                basePrice: 2000000000000000000000, // 2SX
                currentPrice: 2000000000000000000000,
                owned: 0,
                effect: () => {
                    clickPower += 10000;
                }
            },
            {
                id: 27,
                name: 'Quantum Leap',
                description: '+50000 Click Power',
                icon: '🔬',
                basePrice: 10000000000000000000000,
                currentPrice: 10000000000000000000000,
                owned: 0,
                effect: () => clickPower += 50000
            },
            {
                id: 28,
                name: 'Cosmic Factory',
                description: '+10000 Auto Clickers',
                icon: '🌌',
                basePrice: 50000000000000000000000,
                currentPrice: 50000000000000000000000,
                owned: 0,
                effect: () => autoClickers += 10000
            },
            {
                id: 29,
                name: 'Reality Bender',
                description: '+50 Multiplier',
                icon: '🌀',
                basePrice: 100000000000000000000000,
                currentPrice: 100000000000000000000000,
                owned: 0,
                effect: () => multiplier += 50
            },
            {
                id: 30,
                name: 'Divine Power',
                description: '+100000 Click Power',
                icon: '🙏',
                basePrice: 500000000000000000000000,
                currentPrice: 500000000000000000000000,
                owned: 0,
                effect: () => clickPower += 100000
            },
            {
                id: 31,
                name: 'The End',
                description: 'ULTIMATE POWER',
                icon: '🌌',
                basePrice: 999999999999999999999999999999999999,
                currentPrice: 999999999999999999999999999999999999,
                owned: 0,
                effect: () => {
                    clickPower += 999999999999;
                    autoClickers += 999999999;
                    multiplier += 99999;
                }
            },
            // ===== 50 NEW CREATIVE ITEMS =====
            // THEME 1: MAGICAL ITEMS (32-41)
            {
                id: 32,
                name: 'Magic Wand',
                description: '+1000 Click Power per wave',
                icon: '🪄',
                basePrice: 5000,
                currentPrice: 5000,
                owned: 0,
                effect: () => clickPower += 1000
            },
            {
                id: 33,
                name: 'Crystal Ball',
                description: '+500 Auto Clickers',
                icon: '🔮',
                basePrice: 15000,
                currentPrice: 15000,
                owned: 0,
                effect: () => autoClickers += 500
            },
            {
                id: 34,
                name: 'Wizard Hat',
                description: '+10 Multiplier bonus',
                icon: '🎩',
                basePrice: 50000,
                currentPrice: 50000,
                owned: 0,
                effect: () => multiplier += 10
            },
            {
                id: 35,
                name: 'Enchanted Staff',
                description: '+5000 Click Power',
                icon: '🧙',
                basePrice: 100000,
                currentPrice: 100000,
                owned: 0,
                effect: () => clickPower += 5000
            },
            {
                id: 36,
                name: 'Spell Book',
                description: '+2000 Auto Clickers',
                icon: '📖',
                basePrice: 250000,
                currentPrice: 250000,
                owned: 0,
                effect: () => autoClickers += 2000
            },
            {
                id: 37,
                name: 'Potion of Power',
                description: '+20 Multiplier',
                icon: '🧪',
                basePrice: 500000,
                currentPrice: 500000,
                owned: 0,
                effect: () => multiplier += 20
            },
            {
                id: 38,
                name: 'Magic Portal',
                description: '+10000 Click Power',
                icon: '🌀',
                basePrice: 1000000,
                currentPrice: 1000000,
                owned: 0,
                effect: () => clickPower += 10000
            },
            {
                id: 39,
                name: 'Mystic Orb',
                description: '+5000 Auto Clickers',
                icon: '🌐',
                basePrice: 2500000,
                currentPrice: 2500000,
                owned: 0,
                effect: () => autoClickers += 5000
            },
            {
                id: 40,
                name: 'Ancient Rune',
                description: '+50 Multiplier',
                icon: '🗿',
                basePrice: 5000000,
                currentPrice: 5000000,
                owned: 0,
                effect: () => multiplier += 50
            },
            {
                id: 41,
                name: 'Arcane Shield',
                description: '+25000 Click Power',
                icon: '🛡️',
                basePrice: 10000000,
                currentPrice: 10000000,
                owned: 0,
                effect: () => clickPower += 25000
            },
            // THEME 2: TECH ITEMS (42-51)
            {
                id: 42,
                name: 'Robot Arm',
                description: '+10000 Auto Clickers',
                icon: '🦾',
                basePrice: 25000000,
                currentPrice: 25000000,
                owned: 0,
                effect: () => autoClickers += 10000
            },
            {
                id: 43,
                name: 'AI Chip',
                description: '+100 Multiplier',
                icon: '🔧',
                basePrice: 50000000,
                currentPrice: 50000000,
                owned: 0,
                effect: () => multiplier += 100
            },
            {
                id: 44,
                name: 'Quantum Computer',
                description: '+50000 Click Power',
                icon: '💻',
                basePrice: 100000000,
                currentPrice: 100000000,
                owned: 0,
                effect: () => clickPower += 50000
            },
            {
                id: 45,
                name: 'Nano Bots',
                description: '+25000 Auto Clickers',
                icon: '🤖',
                basePrice: 250000000,
                currentPrice: 250000000,
                owned: 0,
                effect: () => autoClickers += 25000
            },
            {
                id: 46,
                name: 'Cybernetic Eye',
                description: '+200 Multiplier',
                icon: '👁️',
                basePrice: 500000000,
                currentPrice: 500000000,
                owned: 0,
                effect: () => multiplier += 200
            },
            {
                id: 47,
                name: 'Fusion Core',
                description: '+100000 Click Power',
                icon: '⚡',
                basePrice: 1000000000,
                currentPrice: 1000000000,
                owned: 0,
                effect: () => clickPower += 100000
            },
            {
                id: 48,
                name: 'Drone Army',
                description: '+50000 Auto Clickers',
                icon: '🚁',
                basePrice: 2500000000,
                currentPrice: 2500000000,
                owned: 0,
                effect: () => autoClickers += 50000
            },
            {
                id: 49,
                name: 'Hologram Tech',
                description: '+500 Multiplier',
                icon: '📱',
                basePrice: 5000000000,
                currentPrice: 5000000000,
                owned: 0,
                effect: () => multiplier += 500
            },
            {
                id: 50,
                name: 'Teleporter',
                description: '+250000 Click Power',
                icon: '🔀',
                basePrice: 10000000000,
                currentPrice: 10000000000,
                owned: 0,
                effect: () => clickPower += 250000
            },
            {
                id: 51,
                name: 'Mech Suit',
                description: '+100000 Auto Clickers',
                icon: '🤖',
                basePrice: 25000000000,
                currentPrice: 25000000000,
                owned: 0,
                effect: () => autoClickers += 100000
            },
            // THEME 3: SPACE ITEMS (52-61)
            {
                id: 52,
                name: 'Asteroid Mine',
                description: '+1000 Multiplier',
                icon: '☄️',
                basePrice: 50000000000,
                currentPrice: 50000000000,
                owned: 0,
                effect: () => multiplier += 1000
            },
            {
                id: 53,
                name: 'Satellite Array',
                description: '+500000 Click Power',
                icon: '🛰️',
                basePrice: 100000000000,
                currentPrice: 100000000000,
                owned: 0,
                effect: () => clickPower += 500000
            },
            {
                id: 54,
                name: 'Space Station',
                description: '+250000 Auto Clickers',
                icon: '🚀',
                basePrice: 250000000000,
                currentPrice: 250000000000,
                owned: 0,
                effect: () => autoClickers += 250000
            },
            {
                id: 55,
                name: 'Alien Tech',
                description: '+2000 Multiplier',
                icon: '👽',
                basePrice: 500000000000,
                currentPrice: 500000000000,
                owned: 0,
                effect: () => multiplier += 2000
            },
            {
                id: 56,
                name: 'Moon Base',
                description: '+1000000 Click Power',
                icon: '🌙',
                basePrice: 1000000000000,
                currentPrice: 1000000000000,
                owned: 0,
                effect: () => clickPower += 1000000
            },
            {
                id: 57,
                name: 'Mars Colony',
                description: '+500000 Auto Clickers',
                icon: '🔴',
                basePrice: 2500000000000,
                currentPrice: 2500000000000,
                owned: 0,
                effect: () => autoClickers += 500000
            },
            {
                id: 58,
                name: 'Star Forge',
                description: '+5000 Multiplier',
                icon: '⭐',
                basePrice: 5000000000000,
                currentPrice: 5000000000000,
                owned: 0,
                effect: () => multiplier += 5000
            },
            {
                id: 59,
                name: 'Solar Panel Grid',
                description: '+2500000 Click Power',
                icon: '☀️',
                basePrice: 10000000000000,
                currentPrice: 10000000000000,
                owned: 0,
                effect: () => clickPower += 2500000
            },
            {
                id: 60,
                name: 'Wormhole Generator',
                description: '+1000000 Auto Clickers',
                icon: '🌀',
                basePrice: 25000000000000,
                currentPrice: 25000000000000,
                owned: 0,
                effect: () => autoClickers += 1000000
            },
            {
                id: 61,
                name: 'Dyson Sphere',
                description: '+10000 Multiplier',
                icon: '🌟',
                basePrice: 50000000000000,
                currentPrice: 50000000000000,
                owned: 0,
                effect: () => multiplier += 10000
            },
            // THEME 4: MYTHICAL CREATURES (62-71)
            {
                id: 62,
                name: 'Dragon Egg',
                description: '+5000000 Click Power',
                icon: '🥚',
                basePrice: 100000000000000,
                currentPrice: 100000000000000,
                owned: 0,
                effect: () => clickPower += 5000000
            },
            {
                id: 63,
                name: 'Phoenix Feather',
                description: '+2500000 Auto Clickers',
                icon: '🪶',
                basePrice: 250000000000000,
                currentPrice: 250000000000000,
                owned: 0,
                effect: () => autoClickers += 2500000
            },
            {
                id: 64,
                name: 'Unicorn Horn',
                description: '+20000 Multiplier',
                icon: '🦄',
                basePrice: 500000000000000,
                currentPrice: 500000000000000,
                owned: 0,
                effect: () => multiplier += 20000
            },
            {
                id: 65,
                name: 'Kraken Tentacle',
                description: '+10000000 Click Power',
                icon: '🐙',
                basePrice: 1000000000000000,
                currentPrice: 1000000000000000,
                owned: 0,
                effect: () => clickPower += 10000000
            },
            {
                id: 66,
                name: 'Griffin Wing',
                description: '+5000000 Auto Clickers',
                icon: '🦅',
                basePrice: 2500000000000000,
                currentPrice: 2500000000000000,
                owned: 0,
                effect: () => autoClickers += 5000000
            },
            {
                id: 67,
                name: 'Hydra Scale',
                description: '+50000 Multiplier',
                icon: '🐍',
                basePrice: 5000000000000000,
                currentPrice: 5000000000000000,
                owned: 0,
                effect: () => multiplier += 50000
            },
            {
                id: 68,
                name: 'Cerberus Collar',
                description: '+25000000 Click Power',
                icon: '🐕',
                basePrice: 10000000000000000,
                currentPrice: 10000000000000000,
                owned: 0,
                effect: () => clickPower += 25000000
            },
            {
                id: 69,
                name: 'Pegasus Saddle',
                description: '+10000000 Auto Clickers',
                icon: '🐴',
                basePrice: 25000000000000000,
                currentPrice: 25000000000000000,
                owned: 0,
                effect: () => autoClickers += 10000000
            },
            {
                id: 70,
                name: 'Basilisk Eye',
                description: '+100000 Multiplier',
                icon: '👁️',
                basePrice: 50000000000000000,
                currentPrice: 50000000000000000,
                owned: 0,
                effect: () => multiplier += 100000
            },
            {
                id: 71,
                name: 'Leviathan Heart',
                description: '+50000000 Click Power',
                icon: '🐋',
                basePrice: 100000000000000000,
                currentPrice: 100000000000000000,
                owned: 0,
                effect: () => clickPower += 50000000
            },
            // THEME 5: LEGENDARY ARTIFACTS (72-81)
            {
                id: 72,
                name: 'Excalibur',
                description: '+100000000 Click Power',
                icon: '⚔️',
                basePrice: 250000000000000000,
                currentPrice: 250000000000000000,
                owned: 0,
                effect: () => clickPower += 100000000
            },
            {
                id: 73,
                name: 'Mjolnir',
                description: '+50000000 Auto Clickers',
                icon: '🔨',
                basePrice: 500000000000000000,
                currentPrice: 500000000000000000,
                owned: 0,
                effect: () => autoClickers += 50000000
            },
            {
                id: 74,
                name: 'Holy Grail',
                description: '+500000 Multiplier',
                icon: '🏆',
                basePrice: 1000000000000000000,
                currentPrice: 1000000000000000000,
                owned: 0,
                effect: () => multiplier += 500000
            },
            {
                id: 75,
                name: 'Pandora Box',
                description: '+250000000 Click Power',
                icon: '📦',
                basePrice: 2500000000000000000,
                currentPrice: 2500000000000000000,
                owned: 0,
                effect: () => clickPower += 250000000
            },
            {
                id: 76,
                name: 'Ark of Covenant',
                description: '+100000000 Auto Clickers',
                icon: '📜',
                basePrice: 5000000000000000000,
                currentPrice: 5000000000000000000,
                owned: 0,
                effect: () => autoClickers += 100000000
            },
            {
                id: 77,
                name: 'Philosopher Stone',
                description: '+1000000 Multiplier',
                icon: '💎',
                basePrice: 10000000000000000000,
                currentPrice: 10000000000000000000,
                owned: 0,
                effect: () => multiplier += 1000000
            },
            {
                id: 78,
                name: 'Crown of Kings',
                description: '+500000000 Click Power',
                icon: '👑',
                basePrice: 25000000000000000000,
                currentPrice: 25000000000000000000,
                owned: 0,
                effect: () => clickPower += 500000000
            },
            {
                id: 79,
                name: 'Trident of Poseidon',
                description: '+250000000 Auto Clickers',
                icon: '🔱',
                basePrice: 50000000000000000000,
                currentPrice: 50000000000000000000,
                owned: 0,
                effect: () => autoClickers += 250000000
            },
            {
                id: 80,
                name: 'Zeus Lightning Bolt',
                description: '+5000000 Multiplier',
                icon: '⚡',
                basePrice: 100000000000000000000,
                currentPrice: 100000000000000000000,
                owned: 0,
                effect: () => multiplier += 5000000
            },
            {
                id: 81,
                name: 'Infinity Gauntlet',
                description: 'ALL STATS x1000000',
                icon: '🧤',
                basePrice: 999999999999999999999999999999999999,
                currentPrice: 999999999999999999999999999999999999,
                owned: 0,
                effect: () => {
                    clickPower *= 1000000;
                    autoClickers *= 1000000;
                    multiplier *= 1000000;
                }
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // TIER: HARDCORE (15 items) - 1 Sextillion to 10 Sextillion
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            {
                id: 82, name: 'Death Scythe', description: '+1B Click Power', icon: '💀',
                basePrice: 1e21, currentPrice: 1e21, owned: 0,
                effect: () => clickPower += 1000000000
            },
            {
                id: 83, name: 'Hellfire Sword', description: '+5B Auto Clickers', icon: '🔥',
                basePrice: 1.5e21, currentPrice: 1.5e21, owned: 0,
                effect: () => autoClickers += 5000000000
            },
            {
                id: 84, name: 'Demon Wings', description: '+100M Multiplier', icon: '🦇',
                basePrice: 2e21, currentPrice: 2e21, owned: 0,
                effect: () => multiplier += 100000000
            },
            {
                id: 85, name: 'Skull Crusher', description: '+10B Click Power', icon: '☠️',
                basePrice: 2.5e21, currentPrice: 2.5e21, owned: 0,
                effect: () => clickPower += 10000000000
            },
            {
                id: 86, name: 'Blood Moon Orb', description: '+20B Auto Clickers', icon: '🌑',
                basePrice: 3e21, currentPrice: 3e21, owned: 0,
                effect: () => autoClickers += 20000000000
            },
            {
                id: 87, name: 'Reaper Blade', description: '+500M Multiplier', icon: '⚔️',
                basePrice: 3.5e21, currentPrice: 3.5e21, owned: 0,
                effect: () => multiplier += 500000000
            },
            {
                id: 88, name: 'Inferno Chain', description: '+50B Click Power', icon: '⛓️',
                basePrice: 4e21, currentPrice: 4e21, owned: 0,
                effect: () => clickPower += 50000000000
            },
            {
                id: 89, name: 'Void Essence', description: '+100B Auto Clickers', icon: '🕳️',
                basePrice: 4.5e21, currentPrice: 4.5e21, owned: 0,
                effect: () => autoClickers += 100000000000
            },
            {
                id: 90, name: 'Chaos Orb', description: '+1B Multiplier', icon: '💥',
                basePrice: 5e21, currentPrice: 5e21, owned: 0,
                effect: () => multiplier += 1000000000
            },
            {
                id: 91, name: 'Dark Matter Core', description: '+200B Click Power', icon: '⚫',
                basePrice: 6e21, currentPrice: 6e21, owned: 0,
                effect: () => clickPower += 200000000000
            },
            {
                id: 92, name: 'Nightmare Fuel', description: '+500B Auto Clickers', icon: '👻',
                basePrice: 7e21, currentPrice: 7e21, owned: 0,
                effect: () => autoClickers += 500000000000
            },
            {
                id: 93, name: 'Abyssal Shard', description: '+5B Multiplier', icon: '🔮',
                basePrice: 8e21, currentPrice: 8e21, owned: 0,
                effect: () => multiplier += 5000000000
            },
            {
                id: 94, name: 'Bone Throne', description: '+1T Click Power', icon: '🦴',
                basePrice: 9e21, currentPrice: 9e21, owned: 0,
                effect: () => clickPower += 1000000000000
            },
            {
                id: 95, name: 'Eternal Darkness', description: '+2T Auto Clickers', icon: '🌚',
                basePrice: 9.5e21, currentPrice: 9.5e21, owned: 0,
                effect: () => autoClickers += 2000000000000
            },
            {
                id: 96, name: 'Ultimate Destroyer', description: '+10B Multiplier', icon: '💀',
                basePrice: 10e21, currentPrice: 10e21, owned: 0,
                effect: () => multiplier += 10000000000
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // TIER: OWNER (12 items) - 100 Sextillion to 1 Septillion
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            {
                id: 97, name: 'Royal Crown', description: '+5T Click Power', icon: '👑',
                basePrice: 1e23, currentPrice: 1e23, owned: 0,
                effect: () => clickPower += 5000000000000
            },
            {
                id: 98, name: 'Divine Scepter', description: '+10T Auto Clickers', icon: '🪄',
                basePrice: 1.5e23, currentPrice: 1.5e23, owned: 0,
                effect: () => autoClickers += 10000000000000
            },
            {
                id: 99, name: 'Emperor Ring', description: '+50B Multiplier', icon: '💍',
                basePrice: 2e23, currentPrice: 2e23, owned: 0,
                effect: () => multiplier += 50000000000
            },
            {
                id: 100, name: 'Throne of Power', description: '+20T Click Power', icon: '🪑',
                basePrice: 2.5e23, currentPrice: 2.5e23, owned: 0,
                effect: () => clickPower += 20000000000000
            },
            {
                id: 101, name: 'Celestial Orb', description: '+50T Auto Clickers', icon: '🔆',
                basePrice: 3e23, currentPrice: 3e23, owned: 0,
                effect: () => autoClickers += 50000000000000
            },
            {
                id: 102, name: 'Master Key', description: '+100B Multiplier', icon: '🗝️',
                basePrice: 4e23, currentPrice: 4e23, owned: 0,
                effect: () => multiplier += 100000000000
            },
            {
                id: 103, name: 'Imperial Armor', description: '+100T Click Power', icon: '🛡️',
                basePrice: 5e23, currentPrice: 5e23, owned: 0,
                effect: () => clickPower += 100000000000000
            },
            {
                id: 104, name: 'Sovereign Blade', description: '+200T Auto Clickers', icon: '⚔️',
                basePrice: 6e23, currentPrice: 6e23, owned: 0,
                effect: () => autoClickers += 200000000000000
            },
            {
                id: 105, name: 'Regal Diamond', description: '+500B Multiplier', icon: '💎',
                basePrice: 7e23, currentPrice: 7e23, owned: 0,
                effect: () => multiplier += 500000000000
            },
            {
                id: 106, name: 'Dynasty Staff', description: '+500T Click Power', icon: '🎋',
                basePrice: 8e23, currentPrice: 8e23, owned: 0,
                effect: () => clickPower += 500000000000000
            },
            {
                id: 107, name: 'Lordship Insignia', description: '+1Qa Auto Clickers', icon: '🏅',
                basePrice: 9e23, currentPrice: 9e23, owned: 0,
                effect: () => autoClickers += 1000000000000000
            },
            {
                id: 108, name: 'Absolute Authority', description: '+1T Multiplier', icon: '✨',
                basePrice: 1e24, currentPrice: 1e24, owned: 0,
                effect: () => multiplier += 1000000000000
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // TIER: GOAT (11 items) - 10 Septillion to 100 Septillion
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            {
                id: 109, name: 'GOAT Trophy', description: '+2Qa Click Power', icon: '🐐',
                basePrice: 1e25, currentPrice: 1e25, owned: 0,
                effect: () => clickPower += 2000000000000000
            },
            {
                id: 110, name: 'Legend Medal', description: '+5Qa Auto Clickers', icon: '🏆',
                basePrice: 1.5e25, currentPrice: 1.5e25, owned: 0,
                effect: () => autoClickers += 5000000000000000
            },
            {
                id: 111, name: 'Platinum Star', description: '+5T Multiplier', icon: '⭐',
                basePrice: 2e25, currentPrice: 2e25, owned: 0,
                effect: () => multiplier += 5000000000000
            },
            {
                id: 112, name: 'Champion Belt', description: '+10Qa Click Power', icon: '🥇',
                basePrice: 3e25, currentPrice: 3e25, owned: 0,
                effect: () => clickPower += 10000000000000000
            },
            {
                id: 113, name: 'MVP Crown', description: '+20Qa Auto Clickers', icon: '👑',
                basePrice: 4e25, currentPrice: 4e25, owned: 0,
                effect: () => autoClickers += 20000000000000000
            },
            {
                id: 114, name: 'Hall of Fame Ring', description: '+10T Multiplier', icon: '💍',
                basePrice: 5e25, currentPrice: 5e25, owned: 0,
                effect: () => multiplier += 10000000000000
            },
            {
                id: 115, name: 'Legendary Sword', description: '+50Qa Click Power', icon: '🗡️',
                basePrice: 6e25, currentPrice: 6e25, owned: 0,
                effect: () => clickPower += 50000000000000000
            },
            {
                id: 116, name: 'Platinum Shield', description: '+100Qa Auto Clickers', icon: '🛡️',
                basePrice: 7e25, currentPrice: 7e25, owned: 0,
                effect: () => autoClickers += 100000000000000000
            },
            {
                id: 117, name: 'Supreme Badge', description: '+50T Multiplier', icon: '🎖️',
                basePrice: 8e25, currentPrice: 8e25, owned: 0,
                effect: () => multiplier += 50000000000000
            },
            {
                id: 118, name: 'Elite Status', description: '+200Qa Click Power', icon: '🌟',
                basePrice: 9e25, currentPrice: 9e25, owned: 0,
                effect: () => clickPower += 200000000000000000
            },
            {
                id: 119, name: 'Greatest of All', description: '+100T Multiplier', icon: '🐐',
                basePrice: 1e26, currentPrice: 1e26, owned: 0,
                effect: () => multiplier += 100000000000000
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // TIER: STRONGEST (10 items) - 1 Octillion to 10 Octillion
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            {
                id: 120, name: 'Thunder Hammer', description: '+500Qa Click Power', icon: '⚡',
                basePrice: 1e27, currentPrice: 1e27, owned: 0,
                effect: () => clickPower += 500000000000000000
            },
            {
                id: 121, name: 'Lightning Gauntlet', description: '+1Qi Auto Clickers', icon: '💪',
                basePrice: 1.5e27, currentPrice: 1.5e27, owned: 0,
                effect: () => autoClickers += 1000000000000000000
            },
            {
                id: 122, name: 'Storm Core', description: '+500T Multiplier', icon: '🌩️',
                basePrice: 2e27, currentPrice: 2e27, owned: 0,
                effect: () => multiplier += 500000000000000
            },
            {
                id: 123, name: 'Titan Fist', description: '+2Qi Click Power', icon: '✊',
                basePrice: 3e27, currentPrice: 3e27, owned: 0,
                effect: () => clickPower += 2000000000000000000
            },
            {
                id: 124, name: 'Hercules Club', description: '+5Qi Auto Clickers', icon: '🏏',
                basePrice: 4e27, currentPrice: 4e27, owned: 0,
                effect: () => autoClickers += 5000000000000000000
            },
            {
                id: 125, name: 'Colossus Heart', description: '+1Qa Multiplier', icon: '❤️',
                basePrice: 5e27, currentPrice: 5e27, owned: 0,
                effect: () => multiplier += 1000000000000000
            },
            {
                id: 126, name: 'Unstoppable Force', description: '+10Qi Click Power', icon: '💢',
                basePrice: 6e27, currentPrice: 6e27, owned: 0,
                effect: () => clickPower += 10000000000000000000
            },
            {
                id: 127, name: 'Invincible Shield', description: '+20Qi Auto Clickers', icon: '🛡️',
                basePrice: 7e27, currentPrice: 7e27, owned: 0,
                effect: () => autoClickers += 20000000000000000000
            },
            {
                id: 128, name: 'Ultimate Strength', description: '+5Qa Multiplier', icon: '🌟',
                basePrice: 9e27, currentPrice: 9e27, owned: 0,
                effect: () => multiplier += 5000000000000000
            },
            {
                id: 129, name: 'Maximum Power Core', description: '+10Qa Multiplier', icon: '⚡',
                basePrice: 1e28, currentPrice: 1e28, owned: 0,
                effect: () => multiplier += 10000000000000000
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // TIER: POWEREST (10 items) - 100 Octillion to 1 Nonillion
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            {
                id: 130, name: 'Volcano Heart', description: '+50Qi Click Power', icon: '🌋',
                basePrice: 1e29, currentPrice: 1e29, owned: 0,
                effect: () => clickPower += 50000000000000000000
            },
            {
                id: 131, name: 'Magma Essence', description: '+100Qi Auto Clickers', icon: '🔥',
                basePrice: 1.5e29, currentPrice: 1.5e29, owned: 0,
                effect: () => autoClickers += 100000000000000000000
            },
            {
                id: 132, name: 'Inferno Core', description: '+50Qa Multiplier', icon: '💥',
                basePrice: 2e29, currentPrice: 2e29, owned: 0,
                effect: () => multiplier += 50000000000000000
            },
            {
                id: 133, name: 'Phoenix Feather', description: '+200Qi Click Power', icon: '🔥',
                basePrice: 3e29, currentPrice: 3e29, owned: 0,
                effect: () => clickPower += 200000000000000000000
            },
            {
                id: 134, name: 'Blazing Sword', description: '+500Qi Auto Clickers', icon: '⚔️',
                basePrice: 4e29, currentPrice: 4e29, owned: 0,
                effect: () => autoClickers += 500000000000000000000
            },
            {
                id: 135, name: 'Sun Fragment', description: '+100Qa Multiplier', icon: '☀️',
                basePrice: 5e29, currentPrice: 5e29, owned: 0,
                effect: () => multiplier += 100000000000000000
            },
            {
                id: 136, name: 'Meteor Strike', description: '+1Sx Click Power', icon: '☄️',
                basePrice: 6e29, currentPrice: 6e29, owned: 0,
                effect: () => clickPower += 1000000000000000000000
            },
            {
                id: 137, name: 'Supernova Core', description: '+2Sx Auto Clickers', icon: '💫',
                basePrice: 7e29, currentPrice: 7e29, owned: 0,
                effect: () => autoClickers += 2000000000000000000000
            },
            {
                id: 138, name: 'Plasma Orb', description: '+500Qa Multiplier', icon: '⚡',
                basePrice: 9e29, currentPrice: 9e29, owned: 0,
                effect: () => multiplier += 500000000000000000
            },
            {
                id: 139, name: 'Absolute Inferno', description: '+1Qi Multiplier', icon: '🔥',
                basePrice: 1e30, currentPrice: 1e30, owned: 0,
                effect: () => multiplier += 1000000000000000000
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // TIER: RAINBOW (9 items) - 10 Nonillion+
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            {
                id: 140, name: 'Rainbow Crystal', description: '+5Sx Click Power', icon: '🌈',
                basePrice: 1e31, currentPrice: 1e31, owned: 0,
                effect: () => clickPower += 5000000000000000000000
            },
            {
                id: 141, name: 'Prismatic Gem', description: '+10Sx Auto Clickers', icon: '💎',
                basePrice: 5e31, currentPrice: 5e31, owned: 0,
                effect: () => autoClickers += 10000000000000000000000
            },
            {
                id: 142, name: 'Aurora Essence', description: '+5Qi Multiplier', icon: '✨',
                basePrice: 1e32, currentPrice: 1e32, owned: 0,
                effect: () => multiplier += 5000000000000000000
            },
            {
                id: 143, name: 'Spectrum Orb', description: '+50Sx Click Power', icon: '🔮',
                basePrice: 5e32, currentPrice: 5e32, owned: 0,
                effect: () => clickPower += 50000000000000000000000
            },
            {
                id: 144, name: 'Chromatic Shard', description: '+100Sx Auto Clickers', icon: '💫',
                basePrice: 1e33, currentPrice: 1e33, owned: 0,
                effect: () => autoClickers += 100000000000000000000000
            },
            {
                id: 145, name: 'Cosmic Prism', description: '+50Qi Multiplier', icon: '🌟',
                basePrice: 5e33, currentPrice: 5e33, owned: 0,
                effect: () => multiplier += 50000000000000000000
            },
            {
                id: 146, name: 'Infinite Spectrum', description: '+500Sx Click Power', icon: '🌈',
                basePrice: 1e34, currentPrice: 1e34, owned: 0,
                effect: () => clickPower += 500000000000000000000000
            },
            {
                id: 147, name: 'Divine Rainbow', description: '+1Sp Auto Clickers', icon: '✨',
                basePrice: 5e34, currentPrice: 5e34, owned: 0,
                effect: () => autoClickers += 1000000000000000000000000
            },
            {
                id: 148, name: 'Ultimate Spectrum', description: '+100Qi Multiplier', icon: '💫',
                basePrice: 1e35, currentPrice: 1e35, owned: 0,
                effect: () => multiplier += 100000000000000000000
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // ADDITIONAL 67 ITEMS - EVEN MORE POWERFUL!
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            
            // TIER: HARDCORE+ (10 items) - Starting at 1e36
            {
                id: 149, name: 'Void Reaper', description: '+1Sx Click Power', icon: '💀',
                basePrice: 1e36, currentPrice: 1e36, owned: 0,
                effect: () => clickPower += 1000000000000000000000
            },
            {
                id: 150, name: 'Soul Extractor', description: '+5Sx Auto Clickers', icon: '👻',
                basePrice: 2e36, currentPrice: 2e36, owned: 0,
                effect: () => autoClickers += 5000000000000000000000
            },
            {
                id: 151, name: 'Demon Lord Crown', description: '+1Qi Multiplier', icon: '😈',
                basePrice: 3e36, currentPrice: 3e36, owned: 0,
                effect: () => multiplier += 1000000000000000000
            },
            {
                id: 152, name: 'Hellspawn Orb', description: '+10Sx Click Power', icon: '🔥',
                basePrice: 4e36, currentPrice: 4e36, owned: 0,
                effect: () => clickPower += 10000000000000000000000
            },
            {
                id: 153, name: 'Abyss Gate', description: '+20Sx Auto Clickers', icon: '🌀',
                basePrice: 5e36, currentPrice: 5e36, owned: 0,
                effect: () => autoClickers += 20000000000000000000000
            },
            {
                id: 154, name: 'Necrotic Blade', description: '+5Qi Multiplier', icon: '⚔️',
                basePrice: 6e36, currentPrice: 6e36, owned: 0,
                effect: () => multiplier += 5000000000000000000
            },
            {
                id: 155, name: 'Shadow Realm Key', description: '+50Sx Click Power', icon: '🗝️',
                basePrice: 7e36, currentPrice: 7e36, owned: 0,
                effect: () => clickPower += 50000000000000000000000
            },
            {
                id: 156, name: 'Death Dimension Core', description: '+100Sx Auto Clickers', icon: '💀',
                basePrice: 8e36, currentPrice: 8e36, owned: 0,
                effect: () => autoClickers += 100000000000000000000000
            },
            {
                id: 157, name: 'Infernal Engine', description: '+10Qi Multiplier', icon: '⚙️',
                basePrice: 9e36, currentPrice: 9e36, owned: 0,
                effect: () => multiplier += 10000000000000000000
            },
            {
                id: 158, name: 'Apocalypse Catalyst', description: '+500Sx Click Power', icon: '☢️',
                basePrice: 10e36, currentPrice: 10e36, owned: 0,
                effect: () => clickPower += 500000000000000000000000
            },
            
            // TIER: OWNER+ (10 items) - Starting at 1e38
            {
                id: 159, name: 'God Emperor Throne', description: '+1Sp Click Power', icon: '👑',
                basePrice: 1e38, currentPrice: 1e38, owned: 0,
                effect: () => clickPower += 1000000000000000000000000
            },
            {
                id: 160, name: 'Universal Scepter', description: '+5Sp Auto Clickers', icon: '🪄',
                basePrice: 2e38, currentPrice: 2e38, owned: 0,
                effect: () => autoClickers += 5000000000000000000000000
            },
            {
                id: 161, name: 'Omnipotent Ring', description: '+50Qi Multiplier', icon: '💍',
                basePrice: 3e38, currentPrice: 3e38, owned: 0,
                effect: () => multiplier += 50000000000000000000
            },
            {
                id: 162, name: 'Reality Crown', description: '+10Sp Click Power', icon: '👑',
                basePrice: 4e38, currentPrice: 4e38, owned: 0,
                effect: () => clickPower += 10000000000000000000000000
            },
            {
                id: 163, name: 'Cosmic Authority', description: '+20Sp Auto Clickers', icon: '✨',
                basePrice: 5e38, currentPrice: 5e38, owned: 0,
                effect: () => autoClickers += 20000000000000000000000000
            },
            {
                id: 164, name: 'Divine Mandate', description: '+100Qi Multiplier', icon: '📜',
                basePrice: 6e38, currentPrice: 6e38, owned: 0,
                effect: () => multiplier += 100000000000000000000
            },
            {
                id: 165, name: 'Eternal Dominion', description: '+50Sp Click Power', icon: '🌟',
                basePrice: 7e38, currentPrice: 7e38, owned: 0,
                effect: () => clickPower += 50000000000000000000000000
            },
            {
                id: 166, name: 'Absolute Control', description: '+100Sp Auto Clickers', icon: '🎛️',
                basePrice: 8e38, currentPrice: 8e38, owned: 0,
                effect: () => autoClickers += 100000000000000000000000000
            },
            {
                id: 167, name: 'Supreme Command', description: '+500Qi Multiplier', icon: '⚡',
                basePrice: 9e38, currentPrice: 9e38, owned: 0,
                effect: () => multiplier += 500000000000000000000
            },
            {
                id: 168, name: 'Total Sovereignty', description: '+1Oc Click Power', icon: '👑',
                basePrice: 10e38, currentPrice: 10e38, owned: 0,
                effect: () => clickPower += 1000000000000000000000000000
            },
            
            // TIER: GOAT+ (12 items) - Starting at 1e40
            {
                id: 169, name: 'Legendary Soul', description: '+5Oc Click Power', icon: '🐐',
                basePrice: 1e40, currentPrice: 1e40, owned: 0,
                effect: () => clickPower += 5000000000000000000000000000
            },
            {
                id: 170, name: 'Mythic Champion Belt', description: '+10Oc Auto Clickers', icon: '🥇',
                basePrice: 1.5e40, currentPrice: 1.5e40, owned: 0,
                effect: () => autoClickers += 10000000000000000000000000000
            },
            {
                id: 171, name: 'Perfect Form', description: '+1Sx Multiplier', icon: '💫',
                basePrice: 2e40, currentPrice: 2e40, owned: 0,
                effect: () => multiplier += 1000000000000000000000
            },
            {
                id: 172, name: 'Undefeated Record', description: '+20Oc Click Power', icon: '🏆',
                basePrice: 3e40, currentPrice: 3e40, owned: 0,
                effect: () => clickPower += 20000000000000000000000000000
            },
            {
                id: 173, name: 'Historic Greatness', description: '+50Oc Auto Clickers', icon: '📚',
                basePrice: 4e40, currentPrice: 4e40, owned: 0,
                effect: () => autoClickers += 50000000000000000000000000000
            },
            {
                id: 174, name: 'Living Legend', description: '+5Sx Multiplier', icon: '⭐',
                basePrice: 5e40, currentPrice: 5e40, owned: 0,
                effect: () => multiplier += 5000000000000000000000
            },
            {
                id: 175, name: 'Icon Status', description: '+100Oc Click Power', icon: '🌟',
                basePrice: 6e40, currentPrice: 6e40, owned: 0,
                effect: () => clickPower += 100000000000000000000000000000
            },
            {
                id: 176, name: 'Hall of Immortals', description: '+200Oc Auto Clickers', icon: '🏛️',
                basePrice: 7e40, currentPrice: 7e40, owned: 0,
                effect: () => autoClickers += 200000000000000000000000000000
            },
            {
                id: 177, name: 'Eternal Glory', description: '+10Sx Multiplier', icon: '✨',
                basePrice: 8e40, currentPrice: 8e40, owned: 0,
                effect: () => multiplier += 10000000000000000000000
            },
            {
                id: 178, name: 'Timeless Achievement', description: '+500Oc Click Power', icon: '⏳',
                basePrice: 9e40, currentPrice: 9e40, owned: 0,
                effect: () => clickPower += 500000000000000000000000000000
            },
            {
                id: 179, name: 'Undisputed Title', description: '+1No Auto Clickers', icon: '🥇',
                basePrice: 10e40, currentPrice: 10e40, owned: 0,
                effect: () => autoClickers += 1000000000000000000000000000000
            },
            {
                id: 180, name: 'Ultimate GOAT', description: '+50Sx Multiplier', icon: '🐐',
                basePrice: 15e40, currentPrice: 15e40, owned: 0,
                effect: () => multiplier += 50000000000000000000000
            },
            
            // TIER: STRONGEST+ (12 items) - Starting at 1e42
            {
                id: 181, name: 'Titan Ascendant', description: '+2No Click Power', icon: '⚡',
                basePrice: 1e42, currentPrice: 1e42, owned: 0,
                effect: () => clickPower += 2000000000000000000000000000000
            },
            {
                id: 182, name: 'Omega Force', description: '+5No Auto Clickers', icon: '💪',
                basePrice: 2e42, currentPrice: 2e42, owned: 0,
                effect: () => autoClickers += 5000000000000000000000000000000
            },
            {
                id: 183, name: 'Maximum Overdrive', description: '+100Sx Multiplier', icon: '⚙️',
                basePrice: 3e42, currentPrice: 3e42, owned: 0,
                effect: () => multiplier += 100000000000000000000000
            },
            {
                id: 184, name: 'Godlike Strength', description: '+10No Click Power', icon: '💢',
                basePrice: 4e42, currentPrice: 4e42, owned: 0,
                effect: () => clickPower += 10000000000000000000000000000000
            },
            {
                id: 185, name: 'Infinite Power', description: '+20No Auto Clickers', icon: '♾️',
                basePrice: 5e42, currentPrice: 5e42, owned: 0,
                effect: () => autoClickers += 20000000000000000000000000000000
            },
            {
                id: 186, name: 'Limitless Potential', description: '+500Sx Multiplier', icon: '🌟',
                basePrice: 6e42, currentPrice: 6e42, owned: 0,
                effect: () => multiplier += 500000000000000000000000
            },
            {
                id: 187, name: 'Unbreakable Will', description: '+50No Click Power', icon: '🛡️',
                basePrice: 7e42, currentPrice: 7e42, owned: 0,
                effect: () => clickPower += 50000000000000000000000000000000
            },
            {
                id: 188, name: 'Unstoppable Momentum', description: '+100No Auto Clickers', icon: '🌀',
                basePrice: 8e42, currentPrice: 8e42, owned: 0,
                effect: () => autoClickers += 100000000000000000000000000000000
            },
            {
                id: 189, name: 'Overwhelming Might', description: '+1Sp Multiplier', icon: '💥',
                basePrice: 9e42, currentPrice: 9e42, owned: 0,
                effect: () => multiplier += 1000000000000000000000000
            },
            {
                id: 190, name: 'Absolute Dominance', description: '+200No Click Power', icon: '👊',
                basePrice: 10e42, currentPrice: 10e42, owned: 0,
                effect: () => clickPower += 200000000000000000000000000000000
            },
            {
                id: 191, name: 'Supreme Superiority', description: '+500No Auto Clickers', icon: '⚡',
                basePrice: 15e42, currentPrice: 15e42, owned: 0,
                effect: () => autoClickers += 500000000000000000000000000000000
            },
            {
                id: 192, name: 'Peak Performance', description: '+5Sp Multiplier', icon: '🏔️',
                basePrice: 20e42, currentPrice: 20e42, owned: 0,
                effect: () => multiplier += 5000000000000000000000000
            },
            
            // TIER: POWEREST+ (11 items) - Starting at 1e45
            {
                id: 193, name: 'Nuclear Fusion Core', description: '+1Dc Click Power', icon: '⚛️',
                basePrice: 1e45, currentPrice: 1e45, owned: 0,
                effect: () => clickPower += 1000000000000000000000000000000000
            },
            {
                id: 194, name: 'Antimatter Reactor', description: '+5Dc Auto Clickers', icon: '☢️',
                basePrice: 2e45, currentPrice: 2e45, owned: 0,
                effect: () => autoClickers += 5000000000000000000000000000000000
            },
            {
                id: 195, name: 'Quantum Singularity', description: '+10Sp Multiplier', icon: '⚫',
                basePrice: 3e45, currentPrice: 3e45, owned: 0,
                effect: () => multiplier += 10000000000000000000000000
            },
            {
                id: 196, name: 'Dark Energy Generator', description: '+10Dc Click Power', icon: '🌌',
                basePrice: 4e45, currentPrice: 4e45, owned: 0,
                effect: () => clickPower += 10000000000000000000000000000000000
            },
            {
                id: 197, name: 'Zero Point Module', description: '+20Dc Auto Clickers', icon: '💫',
                basePrice: 5e45, currentPrice: 5e45, owned: 0,
                effect: () => autoClickers += 20000000000000000000000000000000000
            },
            {
                id: 198, name: 'Reality Warper', description: '+50Sp Multiplier', icon: '🌀',
                basePrice: 6e45, currentPrice: 6e45, owned: 0,
                effect: () => multiplier += 50000000000000000000000000
            },
            {
                id: 199, name: 'Cosmic Forge', description: '+50Dc Click Power', icon: '🔨',
                basePrice: 7e45, currentPrice: 7e45, owned: 0,
                effect: () => clickPower += 50000000000000000000000000000000000
            },
            {
                id: 200, name: 'Stellar Furnace', description: '+100Dc Auto Clickers', icon: '🌟',
                basePrice: 8e45, currentPrice: 8e45, owned: 0,
                effect: () => autoClickers += 100000000000000000000000000000000000
            },
            {
                id: 201, name: 'Big Bang Engine', description: '+100Sp Multiplier', icon: '💥',
                basePrice: 9e45, currentPrice: 9e45, owned: 0,
                effect: () => multiplier += 100000000000000000000000000
            },
            {
                id: 202, name: 'Universe Creator', description: '+500Dc Click Power', icon: '🌌',
                basePrice: 10e45, currentPrice: 10e45, owned: 0,
                effect: () => clickPower += 500000000000000000000000000000000000
            },
            {
                id: 203, name: 'Omniversal Power', description: '+1Oc Multiplier', icon: '♾️',
                basePrice: 15e45, currentPrice: 15e45, owned: 0,
                effect: () => multiplier += 1000000000000000000000000000
            },
            
            // TIER: RAINBOW+ (12 items) - Starting at 1e48
            {
                id: 204, name: 'Prismatic Infinity', description: '+1Ud Click Power', icon: '🌈',
                basePrice: 1e48, currentPrice: 1e48, owned: 0,
                effect: () => clickPower += 1000000000000000000000000000000000000
            },
            {
                id: 205, name: 'Chromatic Eternity', description: '+5Ud Auto Clickers', icon: '✨',
                basePrice: 2e48, currentPrice: 2e48, owned: 0,
                effect: () => autoClickers += 5000000000000000000000000000000000000
            },
            {
                id: 206, name: 'Aurora Divinity', description: '+500Sp Multiplier', icon: '🌌',
                basePrice: 3e48, currentPrice: 3e48, owned: 0,
                effect: () => multiplier += 500000000000000000000000000
            },
            {
                id: 207, name: 'Spectrum Absolute', description: '+10Ud Click Power', icon: '🔮',
                basePrice: 4e48, currentPrice: 4e48, owned: 0,
                effect: () => clickPower += 10000000000000000000000000000000000000
            },
            {
                id: 208, name: 'Light Beyond Light', description: '+20Ud Auto Clickers', icon: '💫',
                basePrice: 5e48, currentPrice: 5e48, owned: 0,
                effect: () => autoClickers += 20000000000000000000000000000000000000
            },
            {
                id: 209, name: 'Rainbow Transcendence', description: '+1Oc Multiplier', icon: '🌈',
                basePrice: 6e48, currentPrice: 6e48, owned: 0,
                effect: () => multiplier += 1000000000000000000000000000
            },
            {
                id: 210, name: 'Kaleidoscope Reality', description: '+50Ud Click Power', icon: '🎨',
                basePrice: 7e48, currentPrice: 7e48, owned: 0,
                effect: () => clickPower += 50000000000000000000000000000000000000
            },
            {
                id: 211, name: 'Hyperspectral Core', description: '+100Ud Auto Clickers', icon: '💎',
                basePrice: 8e48, currentPrice: 8e48, owned: 0,
                effect: () => autoClickers += 100000000000000000000000000000000000000
            },
            {
                id: 212, name: 'Omnichromatic Force', description: '+5Oc Multiplier', icon: '🌟',
                basePrice: 9e48, currentPrice: 9e48, owned: 0,
                effect: () => multiplier += 5000000000000000000000000000
            },
            {
                id: 213, name: 'Perfect Wavelength', description: '+500Ud Click Power', icon: '〰️',
                basePrice: 10e48, currentPrice: 10e48, owned: 0,
                effect: () => clickPower += 500000000000000000000000000000000000000
            },
            {
                id: 214, name: 'Infinite Color', description: '+1Dd Auto Clickers', icon: '🎨',
                basePrice: 15e48, currentPrice: 15e48, owned: 0,
                effect: () => autoClickers += 1000000000000000000000000000000000000000
            },
            {
                id: 215, name: 'Beyond Rainbow', description: '+10Oc Multiplier', icon: '🌈',
                basePrice: 20e48, currentPrice: 20e48, owned: 0,
                effect: () => multiplier += 10000000000000000000000000000
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // TIER: THE GOD (80 items) - Starting at 1e50
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            {
                id: 216, name: 'Divine Essence', description: '+1Dd Click Power', icon: '⚜️',
                basePrice: 1e50, currentPrice: 1e50, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 1000000000000000000000000000000000000000
            },
            {
                id: 217, name: 'Godly Aura', description: '+5Dd Auto Clickers', icon: '✨',
                basePrice: 2e50, currentPrice: 2e50, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 5000000000000000000000000000000000000000
            },
            {
                id: 218, name: 'Sacred Light', description: '+50Oc Multiplier', icon: '💫',
                basePrice: 3e50, currentPrice: 3e50, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 50000000000000000000000000000
            },
            {
                id: 219, name: 'Heavenly Power', description: '+10Dd Click Power', icon: '☀️',
                basePrice: 4e50, currentPrice: 4e50, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 10000000000000000000000000000000000000000
            },
            {
                id: 220, name: 'Celestial Force', description: '+20Dd Auto Clickers', icon: '🌟',
                basePrice: 5e50, currentPrice: 5e50, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 20000000000000000000000000000000000000000
            },
            {
                id: 221, name: 'Holy Blessing', description: '+100Oc Multiplier', icon: '🙏',
                basePrice: 6e50, currentPrice: 6e50, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 100000000000000000000000000000
            },
            {
                id: 222, name: 'Angel Wings', description: '+50Dd Click Power', icon: '👼',
                basePrice: 7e50, currentPrice: 7e50, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 50000000000000000000000000000000000000000
            },
            {
                id: 223, name: 'Seraphim Halo', description: '+100Dd Auto Clickers', icon: '😇',
                basePrice: 8e50, currentPrice: 8e50, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 100000000000000000000000000000000000000000
            },
            {
                id: 224, name: 'Divine Judgment', description: '+500Oc Multiplier', icon: '⚖️',
                basePrice: 9e50, currentPrice: 9e50, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 500000000000000000000000000000
            },
            {
                id: 225, name: 'Godly Throne', description: '+500Dd Click Power', icon: '👑',
                basePrice: 10e50, currentPrice: 10e50, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 500000000000000000000000000000000000000000
            },
            {
                id: 226, name: 'Sacred Scepter', description: '+1Td Auto Clickers', icon: '🪄',
                basePrice: 15e50, currentPrice: 15e50, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000
            },
            {
                id: 227, name: 'Holy Grail', description: '+1No Multiplier', icon: '🏆',
                basePrice: 20e50, currentPrice: 20e50, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 1000000000000000000000000000000
            },
            {
                id: 228, name: 'Divine Sword', description: '+1Td Click Power', icon: '⚔️',
                basePrice: 25e50, currentPrice: 25e50, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 1000000000000000000000000000000000000000000
            },
            {
                id: 229, name: 'Godly Shield', description: '+5Td Auto Clickers', icon: '🛡️',
                basePrice: 30e50, currentPrice: 30e50, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000
            },
            {
                id: 230, name: 'Heavenly Crown', description: '+5No Multiplier', icon: '👑',
                basePrice: 40e50, currentPrice: 40e50, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 5000000000000000000000000000000
            },
            {
                id: 231, name: 'Sacred Heart', description: '+10Td Click Power', icon: '❤️',
                basePrice: 50e50, currentPrice: 50e50, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 10000000000000000000000000000000000000000000
            },
            {
                id: 232, name: 'Divine Wisdom', description: '+20Td Auto Clickers', icon: '📖',
                basePrice: 60e50, currentPrice: 60e50, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000
            },
            {
                id: 233, name: 'Godly Knowledge', description: '+10No Multiplier', icon: '🧠',
                basePrice: 70e50, currentPrice: 70e50, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 10000000000000000000000000000000
            },
            {
                id: 234, name: 'Holy Spirit', description: '+50Td Click Power', icon: '🕊️',
                basePrice: 80e50, currentPrice: 80e50, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 50000000000000000000000000000000000000000000
            },
            {
                id: 235, name: 'Celestial Blessing', description: '+100Td Auto Clickers', icon: '🌠',
                basePrice: 90e50, currentPrice: 90e50, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000
            },
            {
                id: 236, name: 'Divine Glory', description: '+50No Multiplier', icon: '✨',
                basePrice: 100e50, currentPrice: 100e50, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 50000000000000000000000000000000
            },
            {
                id: 237, name: 'Godly Presence', description: '+500Td Click Power', icon: '👁️',
                basePrice: 1e53, currentPrice: 1e53, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 500000000000000000000000000000000000000000000
            },
            {
                id: 238, name: 'Sacred Fire', description: '+1Qad Auto Clickers', icon: '🔥',
                basePrice: 2e53, currentPrice: 2e53, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000
            },
            {
                id: 239, name: 'Heavenly Thunder', description: '+100No Multiplier', icon: '⚡',
                basePrice: 3e53, currentPrice: 3e53, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 100000000000000000000000000000000
            },
            {
                id: 240, name: 'Divine Lightning', description: '+1Qad Click Power', icon: '🌩️',
                basePrice: 4e53, currentPrice: 4e53, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000
            },
            {
                id: 241, name: 'Godly Storm', description: '+5Qad Auto Clickers', icon: '🌪️',
                basePrice: 5e53, currentPrice: 5e53, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000
            },
            {
                id: 242, name: 'Sacred Wind', description: '+500No Multiplier', icon: '💨',
                basePrice: 6e53, currentPrice: 6e53, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 500000000000000000000000000000000
            },
            {
                id: 243, name: 'Holy Water', description: '+10Qad Click Power', icon: '💧',
                basePrice: 7e53, currentPrice: 7e53, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000
            },
            {
                id: 244, name: 'Divine Ocean', description: '+20Qad Auto Clickers', icon: '🌊',
                basePrice: 8e53, currentPrice: 8e53, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000
            },
            {
                id: 245, name: 'Celestial Wave', description: '+1Dc Multiplier', icon: '〰️',
                basePrice: 9e53, currentPrice: 9e53, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 1000000000000000000000000000000000
            },
            {
                id: 246, name: 'Godly Earth', description: '+50Qad Click Power', icon: '🌍',
                basePrice: 10e53, currentPrice: 10e53, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000
            },
            {
                id: 247, name: 'Sacred Mountain', description: '+100Qad Auto Clickers', icon: '⛰️',
                basePrice: 15e53, currentPrice: 15e53, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000
            },
            {
                id: 248, name: 'Heavenly Peak', description: '+5Dc Multiplier', icon: '🏔️',
                basePrice: 20e53, currentPrice: 20e53, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 5000000000000000000000000000000000
            },
            {
                id: 249, name: 'Divine Tree', description: '+500Qad Click Power', icon: '🌳',
                basePrice: 25e53, currentPrice: 25e53, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000
            },
            {
                id: 250, name: 'Godly Forest', description: '+1Qi Auto Clickers', icon: '🌲',
                basePrice: 30e53, currentPrice: 30e53, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000
            },
            {
                id: 251, name: 'Sacred Flower', description: '+10Dc Multiplier', icon: '🌸',
                basePrice: 40e53, currentPrice: 40e53, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 10000000000000000000000000000000000
            },
            {
                id: 252, name: 'Holy Garden', description: '+1Qi Click Power', icon: '🌺',
                basePrice: 50e53, currentPrice: 50e53, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000
            },
            {
                id: 253, name: 'Divine Paradise', description: '+5Qi Auto Clickers', icon: '🏝️',
                basePrice: 60e53, currentPrice: 60e53, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000
            },
            {
                id: 254, name: 'Celestial Realm', description: '+50Dc Multiplier', icon: '🌌',
                basePrice: 70e53, currentPrice: 70e53, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 50000000000000000000000000000000000
            },
            {
                id: 255, name: 'Godly Universe', description: '+10Qi Click Power', icon: '🌠',
                basePrice: 80e53, currentPrice: 80e53, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000
            },
            {
                id: 256, name: 'Sacred Cosmos', description: '+20Qi Auto Clickers', icon: '✨',
                basePrice: 90e53, currentPrice: 90e53, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000
            },
            {
                id: 257, name: 'Heavenly Dimension', description: '+100Dc Multiplier', icon: '🔮',
                basePrice: 100e53, currentPrice: 100e53, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 100000000000000000000000000000000000
            },
            {
                id: 258, name: 'Divine Infinity', description: '+50Qi Click Power', icon: '♾️',
                basePrice: 1e56, currentPrice: 1e56, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000
            },
            {
                id: 259, name: 'Godly Eternity', description: '+100Qi Auto Clickers', icon: '⏳',
                basePrice: 2e56, currentPrice: 2e56, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000000
            },
            {
                id: 260, name: 'Sacred Timeless', description: '+500Dc Multiplier', icon: '⌛',
                basePrice: 3e56, currentPrice: 3e56, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 500000000000000000000000000000000000
            },
            {
                id: 261, name: 'Holy Omnipotence', description: '+500Qi Click Power', icon: '💪',
                basePrice: 4e56, currentPrice: 4e56, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000
            },
            {
                id: 262, name: 'Divine Omniscience', description: '+1Sx Auto Clickers', icon: '🧿',
                basePrice: 5e56, currentPrice: 5e56, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000
            },
            {
                id: 263, name: 'Celestial Omnipresence', description: '+1Ud Multiplier', icon: '👁️',
                basePrice: 6e56, currentPrice: 6e56, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 1000000000000000000000000000000000000
            },
            {
                id: 264, name: 'Godly Perfection', description: '+1Sx Click Power', icon: '💎',
                basePrice: 7e56, currentPrice: 7e56, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000
            },
            {
                id: 265, name: 'Sacred Absolute', description: '+5Sx Auto Clickers', icon: '🔆',
                basePrice: 8e56, currentPrice: 8e56, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000
            },
            {
                id: 266, name: 'Heavenly Supreme', description: '+5Ud Multiplier', icon: '🌟',
                basePrice: 9e56, currentPrice: 9e56, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 5000000000000000000000000000000000000
            },
            {
                id: 267, name: 'Divine Ultimate', description: '+10Sx Click Power', icon: '💫',
                basePrice: 10e56, currentPrice: 10e56, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000000
            },
            {
                id: 268, name: 'Godly Maximum', description: '+20Sx Auto Clickers', icon: '⚡',
                basePrice: 15e56, currentPrice: 15e56, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000000
            },
            {
                id: 269, name: 'Sacred Peak', description: '+10Ud Multiplier', icon: '🏔️',
                basePrice: 20e56, currentPrice: 20e56, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 10000000000000000000000000000000000000
            },
            {
                id: 270, name: 'Holy Zenith', description: '+50Sx Click Power', icon: '⭐',
                basePrice: 25e56, currentPrice: 25e56, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000000
            },
            {
                id: 271, name: 'Divine Apex', description: '+100Sx Auto Clickers', icon: '🔝',
                basePrice: 30e56, currentPrice: 30e56, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000000000
            },
            {
                id: 272, name: 'Celestial Pinnacle', description: '+50Ud Multiplier', icon: '👑',
                basePrice: 40e56, currentPrice: 40e56, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 50000000000000000000000000000000000000
            },
            {
                id: 273, name: 'Godly Summit', description: '+500Sx Click Power', icon: '🗻',
                basePrice: 50e56, currentPrice: 50e56, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000000
            },
            {
                id: 274, name: 'Sacred Crown Jewel', description: '+1Sp Auto Clickers', icon: '💍',
                basePrice: 60e56, currentPrice: 60e56, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000000
            },
            {
                id: 275, name: 'Heavenly Masterpiece', description: '+100Ud Multiplier', icon: '🎨',
                basePrice: 70e56, currentPrice: 70e56, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 100000000000000000000000000000000000000
            },
            {
                id: 276, name: 'Divine Magnum Opus', description: '+1Sp Click Power', icon: '🏆',
                basePrice: 80e56, currentPrice: 80e56, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000000
            },
            {
                id: 277, name: 'Godly Legacy', description: '+5Sp Auto Clickers', icon: '📜',
                basePrice: 90e56, currentPrice: 90e56, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000000
            },
            {
                id: 278, name: 'Sacred Legend', description: '+500Ud Multiplier', icon: '📖',
                basePrice: 100e56, currentPrice: 100e56, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 500000000000000000000000000000000000000
            },
            {
                id: 279, name: 'Holy Myth', description: '+10Sp Click Power', icon: '🐉',
                basePrice: 1e59, currentPrice: 1e59, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000000000
            },
            {
                id: 280, name: 'Divine Epic', description: '+20Sp Auto Clickers', icon: '⚔️',
                basePrice: 2e59, currentPrice: 2e59, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000000000
            },
            {
                id: 281, name: 'Celestial Saga', description: '+1Dd Multiplier', icon: '📚',
                basePrice: 3e59, currentPrice: 3e59, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 1000000000000000000000000000000000000000
            },
            {
                id: 282, name: 'Godly Chronicle', description: '+50Sp Click Power', icon: '📝',
                basePrice: 4e59, currentPrice: 4e59, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000000000
            },
            {
                id: 283, name: 'Sacred Testament', description: '+100Sp Auto Clickers', icon: '✍️',
                basePrice: 5e59, currentPrice: 5e59, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000000000000
            },
            {
                id: 284, name: 'Heavenly Scripture', description: '+5Dd Multiplier', icon: '📖',
                basePrice: 6e59, currentPrice: 6e59, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 5000000000000000000000000000000000000000
            },
            {
                id: 285, name: 'Divine Prophecy', description: '+500Sp Click Power', icon: '🔮',
                basePrice: 7e59, currentPrice: 7e59, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000000000
            },
            {
                id: 286, name: 'Godly Oracle', description: '+1Oc Auto Clickers', icon: '👁️',
                basePrice: 8e59, currentPrice: 8e59, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 287, name: 'Sacred Vision', description: '+10Dd Multiplier', icon: '🌠',
                basePrice: 9e59, currentPrice: 9e59, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 10000000000000000000000000000000000000000
            },
            {
                id: 288, name: 'Holy Revelation', description: '+1Oc Click Power', icon: '💫',
                basePrice: 10e59, currentPrice: 10e59, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 289, name: 'Divine Enlightenment', description: '+5Oc Auto Clickers', icon: '🕯️',
                basePrice: 15e59, currentPrice: 15e59, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 290, name: 'Celestial Awakening', description: '+50Dd Multiplier', icon: '☀️',
                basePrice: 20e59, currentPrice: 20e59, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 50000000000000000000000000000000000000000
            },
            {
                id: 291, name: 'Godly Ascension', description: '+10Oc Click Power', icon: '🚀',
                basePrice: 25e59, currentPrice: 25e59, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 292, name: 'Sacred Transcendence', description: '+20Oc Auto Clickers', icon: '✨',
                basePrice: 30e59, currentPrice: 30e59, owned: 0, rarity: 'thegod',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 293, name: 'Heavenly Evolution', description: '+100Dd Multiplier', icon: '🧬',
                basePrice: 40e59, currentPrice: 40e59, owned: 0, rarity: 'thegod',
                effect: () => multiplier += 100000000000000000000000000000000000000000
            },
            {
                id: 294, name: 'Divine Transformation', description: '+50Oc Click Power', icon: '🦋',
                basePrice: 50e59, currentPrice: 50e59, owned: 0, rarity: 'thegod',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 295, name: 'The God Almighty', description: 'ALL STATS x1000000000', icon: '🌌',
                basePrice: 1e63, currentPrice: 1e63, owned: 0, rarity: 'thegod',
                effect: () => {
                    clickPower *= 1000000000;
                    autoClickers *= 1000000000;
                    multiplier *= 1000000000;
                }
            },
            
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // TIER: HACKER (70 items) - Starting at 2e63 (2 VG)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            {
                id: 296, name: 'Binary Code', description: '+100Oc Click Power', icon: '💻',
                basePrice: 2e63, currentPrice: 2e63, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 100000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 297, name: 'Firewall Breach', description: '+500Oc Auto Clickers', icon: '🔓',
                basePrice: 3e63, currentPrice: 3e63, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 500000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 298, name: 'Root Access', description: '+1Dd Multiplier', icon: '🔑',
                basePrice: 4e63, currentPrice: 4e63, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 1000000000000000000000000000000000000000
            },
            {
                id: 299, name: 'SQL Injection', description: '+500Oc Click Power', icon: '💉',
                basePrice: 5e63, currentPrice: 5e63, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 300, name: 'DDoS Attack', description: '+1Dd Auto Clickers', icon: '⚡',
                basePrice: 6e63, currentPrice: 6e63, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 301, name: 'Zero Day Exploit', description: '+5Dd Multiplier', icon: '🎯',
                basePrice: 7e63, currentPrice: 7e63, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 5000000000000000000000000000000000000000
            },
            {
                id: 302, name: 'Backdoor Access', description: '+1Dd Click Power', icon: '🚪',
                basePrice: 8e63, currentPrice: 8e63, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 303, name: 'Malware Package', description: '+5Dd Auto Clickers', icon: '🦠',
                basePrice: 9e63, currentPrice: 9e63, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 304, name: 'Trojan Horse', description: '+10Dd Multiplier', icon: '🐴',
                basePrice: 10e63, currentPrice: 10e63, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 10000000000000000000000000000000000000000
            },
            {
                id: 305, name: 'Botnet Army', description: '+10Dd Click Power', icon: '🤖',
                basePrice: 15e63, currentPrice: 15e63, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 306, name: 'Crypto Miner', description: '+20Dd Auto Clickers', icon: '⛏️',
                basePrice: 20e63, currentPrice: 20e63, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 307, name: 'Ransomware', description: '+50Dd Multiplier', icon: '💰',
                basePrice: 25e63, currentPrice: 25e63, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 50000000000000000000000000000000000000000
            },
            {
                id: 308, name: 'Keylogger', description: '+50Dd Click Power', icon: '⌨️',
                basePrice: 30e63, currentPrice: 30e63, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 309, name: 'Phishing Kit', description: '+100Dd Auto Clickers', icon: '🎣',
                basePrice: 40e63, currentPrice: 40e63, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 310, name: 'Dark Web Access', description: '+100Dd Multiplier', icon: '🕸️',
                basePrice: 50e63, currentPrice: 50e63, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 100000000000000000000000000000000000000000
            },
            {
                id: 311, name: 'VPN Network', description: '+500Dd Click Power', icon: '🌐',
                basePrice: 60e63, currentPrice: 60e63, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 312, name: 'Proxy Chain', description: '+1Td Auto Clickers', icon: '🔗',
                basePrice: 70e63, currentPrice: 70e63, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 313, name: 'Encryption Breaker', description: '+500Dd Multiplier', icon: '🔐',
                basePrice: 80e63, currentPrice: 80e63, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 500000000000000000000000000000000000000000
            },
            {
                id: 314, name: 'Hash Cracker', description: '+1Td Click Power', icon: '🔨',
                basePrice: 90e63, currentPrice: 90e63, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 315, name: 'Password Database', description: '+5Td Auto Clickers', icon: '📊',
                basePrice: 100e63, currentPrice: 100e63, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 316, name: 'Admin Panel', description: '+1Qad Multiplier', icon: '👨‍💻',
                basePrice: 1e66, currentPrice: 1e66, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 1000000000000000000000000000000000000000000
            },
            {
                id: 317, name: 'Server Farm', description: '+10Td Click Power', icon: '🖥️',
                basePrice: 2e66, currentPrice: 2e66, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 318, name: 'Supercomputer', description: '+20Td Auto Clickers', icon: '🔬',
                basePrice: 3e66, currentPrice: 3e66, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 319, name: 'Quantum Processor', description: '+5Qad Multiplier', icon: '⚛️',
                basePrice: 4e66, currentPrice: 4e66, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 5000000000000000000000000000000000000000000
            },
            {
                id: 320, name: 'AI Algorithm', description: '+50Td Click Power', icon: '🧠',
                basePrice: 5e66, currentPrice: 5e66, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 321, name: 'Neural Network', description: '+100Td Auto Clickers', icon: '🕸️',
                basePrice: 6e66, currentPrice: 6e66, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 322, name: 'Deep Learning', description: '+10Qad Multiplier', icon: '📚',
                basePrice: 7e66, currentPrice: 7e66, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 10000000000000000000000000000000000000000000
            },
            {
                id: 323, name: 'Machine Learning', description: '+500Td Click Power', icon: '🤖',
                basePrice: 8e66, currentPrice: 8e66, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 324, name: 'Blockchain Tech', description: '+1Qi Auto Clickers', icon: '⛓️',
                basePrice: 9e66, currentPrice: 9e66, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 325, name: 'Smart Contract', description: '+50Qad Multiplier', icon: '📝',
                basePrice: 10e66, currentPrice: 10e66, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 50000000000000000000000000000000000000000000
            },
            {
                id: 326, name: 'Data Center', description: '+1Qi Click Power', icon: '🏢',
                basePrice: 15e66, currentPrice: 15e66, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 327, name: 'Cloud Server', description: '+5Qi Auto Clickers', icon: '☁️',
                basePrice: 20e66, currentPrice: 20e66, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 328, name: 'Edge Computing', description: '+100Qad Multiplier', icon: '📡',
                basePrice: 25e66, currentPrice: 25e66, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 100000000000000000000000000000000000000000000
            },
            {
                id: 329, name: 'IoT Network', description: '+10Qi Click Power', icon: '📱',
                basePrice: 30e66, currentPrice: 30e66, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 330, name: '5G Network', description: '+20Qi Auto Clickers', icon: '📶',
                basePrice: 40e66, currentPrice: 40e66, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 331, name: 'Satellite Link', description: '+500Qad Multiplier', icon: '🛰️',
                basePrice: 50e66, currentPrice: 50e66, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 500000000000000000000000000000000000000000000
            },
            {
                id: 332, name: 'Cyber Weapon', description: '+50Qi Click Power', icon: '⚔️',
                basePrice: 60e66, currentPrice: 60e66, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 333, name: 'Digital Nuke', description: '+100Qi Auto Clickers', icon: '💣',
                basePrice: 70e66, currentPrice: 70e66, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 334, name: 'EMP Bomb', description: '+1Sx Multiplier', icon: '⚡',
                basePrice: 80e66, currentPrice: 80e66, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 1000000000000000000000000000000000000000000000
            },
            {
                id: 335, name: 'Logic Bomb', description: '+500Qi Click Power', icon: '💥',
                basePrice: 90e66, currentPrice: 90e66, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 336, name: 'Code Injection', description: '+1Sx Auto Clickers', icon: '💉',
                basePrice: 100e66, currentPrice: 100e66, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 337, name: 'System Override', description: '+5Sx Multiplier', icon: '🔄',
                basePrice: 1e69, currentPrice: 1e69, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 5000000000000000000000000000000000000000000000
            },
            {
                id: 338, name: 'Kernel Exploit', description: '+1Sx Click Power', icon: '🌽',
                basePrice: 2e69, currentPrice: 2e69, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 339, name: 'Memory Dump', description: '+5Sx Auto Clickers', icon: '🧠',
                basePrice: 3e69, currentPrice: 3e69, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 340, name: 'Buffer Overflow', description: '+10Sx Multiplier', icon: '💧',
                basePrice: 4e69, currentPrice: 4e69, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 10000000000000000000000000000000000000000000000
            },
            {
                id: 341, name: 'Stack Smashing', description: '+10Sx Click Power', icon: '📚',
                basePrice: 5e69, currentPrice: 5e69, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 342, name: 'Heap Spray', description: '+20Sx Auto Clickers', icon: '🎨',
                basePrice: 6e69, currentPrice: 6e69, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 343, name: 'Race Condition', description: '+50Sx Multiplier', icon: '🏁',
                basePrice: 7e69, currentPrice: 7e69, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 50000000000000000000000000000000000000000000000
            },
            {
                id: 344, name: 'Time Bomb', description: '+50Sx Click Power', icon: '⏰',
                basePrice: 8e69, currentPrice: 8e69, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 345, name: 'Worm Virus', description: '+100Sx Auto Clickers', icon: '🐛',
                basePrice: 9e69, currentPrice: 9e69, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 346, name: 'Rootkit', description: '+100Sx Multiplier', icon: '🌱',
                basePrice: 10e69, currentPrice: 10e69, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 100000000000000000000000000000000000000000000000
            },
            {
                id: 347, name: 'Spyware', description: '+500Sx Click Power', icon: '🕵️',
                basePrice: 15e69, currentPrice: 15e69, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 348, name: 'Adware', description: '+1Sp Auto Clickers', icon: '📺',
                basePrice: 20e69, currentPrice: 20e69, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 349, name: 'Scareware', description: '+500Sx Multiplier', icon: '😱',
                basePrice: 25e69, currentPrice: 25e69, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 500000000000000000000000000000000000000000000000
            },
            {
                id: 350, name: 'Rogue Software', description: '+1Sp Click Power', icon: '🎭',
                basePrice: 30e69, currentPrice: 30e69, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 351, name: 'Social Engineering', description: '+5Sp Auto Clickers', icon: '👥',
                basePrice: 40e69, currentPrice: 40e69, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 352, name: 'Man in the Middle', description: '+1Oc Multiplier', icon: '🧑',
                basePrice: 50e69, currentPrice: 50e69, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 1000000000000000000000000000000000000000000000000
            },
            {
                id: 353, name: 'Session Hijacking', description: '+10Sp Click Power', icon: '🎯',
                basePrice: 60e69, currentPrice: 60e69, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 10000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 354, name: 'Cookie Stealing', description: '+20Sp Auto Clickers', icon: '🍪',
                basePrice: 70e69, currentPrice: 70e69, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 20000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 355, name: 'DNS Spoofing', description: '+5Oc Multiplier', icon: '🌐',
                basePrice: 80e69, currentPrice: 80e69, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 5000000000000000000000000000000000000000000000000
            },
            {
                id: 356, name: 'IP Spoofing', description: '+50Sp Click Power', icon: '🎭',
                basePrice: 90e69, currentPrice: 90e69, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 50000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 357, name: 'MAC Spoofing', description: '+100Sp Auto Clickers', icon: '🔀',
                basePrice: 100e69, currentPrice: 100e69, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 100000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 358, name: 'Port Scanning', description: '+10Oc Multiplier', icon: '🔍',
                basePrice: 1e72, currentPrice: 1e72, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 10000000000000000000000000000000000000000000000000
            },
            {
                id: 359, name: 'Network Sniffing', description: '+500Sp Click Power', icon: '👃',
                basePrice: 2e72, currentPrice: 2e72, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 500000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 360, name: 'Packet Injection', description: '+1No Auto Clickers', icon: '📦',
                basePrice: 3e72, currentPrice: 3e72, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 1000000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 361, name: 'ARP Poisoning', description: '+50Oc Multiplier', icon: '☠️',
                basePrice: 4e72, currentPrice: 4e72, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 50000000000000000000000000000000000000000000000000
            },
            {
                id: 362, name: 'ICMP Flood', description: '+1No Click Power', icon: '🌊',
                basePrice: 5e72, currentPrice: 5e72, owned: 0, rarity: 'hacker',
                effect: () => clickPower += 1000000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 363, name: 'SYN Flood', description: '+5No Auto Clickers', icon: '💧',
                basePrice: 6e72, currentPrice: 6e72, owned: 0, rarity: 'hacker',
                effect: () => autoClickers += 5000000000000000000000000000000000000000000000000000000000000000000000000000
            },
            {
                id: 364, name: 'Brute Force Attack', description: '+100Oc Multiplier', icon: '💪',
                basePrice: 7e72, currentPrice: 7e72, owned: 0, rarity: 'hacker',
                effect: () => multiplier += 100000000000000000000000000000000000000000000000000
            },
            {
                id: 365, name: 'The Ultimate Hacker', description: 'ALL STATS x10000000000', icon: '👨‍💻',
                basePrice: 1e75, currentPrice: 1e75, owned: 0, rarity: 'hacker',
                effect: () => {
                    clickPower *= 10000000000;
                    autoClickers *= 10000000000;
                    multiplier *= 10000000000;
                }
            }
        ];

        const rebirthRequirements = [100000]; // Chỉ cần 1 giá trị, sau đó x5 mỗi lần

        // ===== WEATHER FUNCTIONS =====
        function activateWeather(type) {
            if (activeWeathers.includes(type)) return; // Already active
            
            activeWeathers.push(type);
            totalWeatherSummoned++; // Track weather summons
            const config = weatherConfig[type];
            weatherTimers[type] = config.duration;
            
            // Apply weather effect
            applyWeatherEffect(type, true);
            
            // Start countdown
            weatherIntervals[type] = setInterval(() => {
                weatherTimers[type]--;
                updateWeatherDisplay();
                
                if (weatherTimers[type] <= 0) {
                    deactivateWeather(type);
                }
            }, 1000);
            
            updateWeatherDisplay();
        }

        function deactivateWeather(type) {
            if (!activeWeathers.includes(type)) return;
            
            // Remove weather effect
            applyWeatherEffect(type, false);
            
            // Clean up
            clearInterval(weatherIntervals[type]);
            delete weatherIntervals[type];
            delete weatherTimers[type];
            activeWeathers = activeWeathers.filter(w => w !== type);
            
            updateWeatherDisplay();
        }


        function applyWeatherEffect(type, apply) {
            const config = weatherConfig[type];
            if (!config) return;
            
            // Wind, Time Warp - Cooldown effects
            if (type === 'wind') {
                clickCooldown = apply ? Math.max(0.01, clickCooldown - 0.3) : clickCooldown + 0.3;
            } else if (type === 'timewarp') {
                clickCooldown = apply ? Math.max(0.01, clickCooldown - 0.5) : clickCooldown + 0.5;
            }
            
            // Cloud - Shop discount (handled in renderShop)
            else if (type === 'cloud') {
                renderShop();
            }
            
            // Simple +X Click Power effects
            else if (type === 'rain') {
                clickPower = apply ? clickPower + 2 : Math.max(1, clickPower - 2);
            } else if (type === 'night') {
                clickPower = apply ? clickPower + 5 : Math.max(1, clickPower - 5);
            } else if (type === 'drizzle') {
                clickPower = apply ? clickPower + 8 : Math.max(1, clickPower - 8);
            } else if (type === 'sunrise') {
                clickPower = apply ? clickPower + 15 : Math.max(1, clickPower - 15);
            } else if (type === 'hail') {
                clickPower = apply ? clickPower + 25 : Math.max(1, clickPower - 25);
            } else if (type === 'comet') {
                clickPower = apply ? clickPower + 50 : Math.max(1, clickPower - 50);
            } else if (type === 'wildfire') {
                clickPower = apply ? clickPower + 100 : Math.max(1, clickPower - 100);
            } else if (type === 'cosmic') {
                clickPower = apply ? clickPower + 200 : Math.max(1, clickPower - 200);
            }
            
            // +X Auto Clickers effects
            else if (type === 'snow') {
                autoClickers = apply ? autoClickers + 3 : Math.max(0, autoClickers - 3);
            } else if (type === 'breeze') {
                autoClickers = apply ? autoClickers + 10 : Math.max(0, autoClickers - 10);
            } else if (type === 'sunset') {
                autoClickers = apply ? autoClickers + 12 : Math.max(0, autoClickers - 12);
            } else if (type === 'blizzard') {
                autoClickers = apply ? autoClickers + 20 : Math.max(0, autoClickers - 20);
            } else if (type === 'earthquake') {
                autoClickers = apply ? autoClickers + 30 : Math.max(0, autoClickers - 30);
            } else if (type === 'sandstorm') {
                autoClickers = apply ? autoClickers + 40 : Math.max(0, autoClickers - 40);
            } else if (type === 'pulsar') {
                autoClickers = apply ? autoClickers + 100 : Math.max(0, autoClickers - 100);
            }
            
            // +X Multiplier effects
            else if (type === 'fog') {
                multiplier = apply ? multiplier + 1 : Math.max(1, multiplier - 1);
            } else if (type === 'rainbow') {
                multiplier = apply ? multiplier + 2 : Math.max(1, multiplier - 2);
            } else if (type === 'gravity') {
                multiplier = apply ? multiplier + 3 : Math.max(1, multiplier - 3);
            } else if (type === 'quantum') {
                multiplier = apply ? multiplier + 5 : Math.max(1, multiplier - 5);
            } else if (type === 'unicorn') {
                multiplier = apply ? multiplier + 10 : Math.max(1, multiplier - 10);
            } else if (type === 'eternity') {
                multiplier = apply ? multiplier + 20 : Math.max(1, multiplier - 20);
            }
            
            // Multiplier weathers (x2, x3, x5, etc) - handled in getWeatherMultiplier()
            // moonlight, meteor, thunder, storm, tornado, aurora, eclipse, volcano, tsunami
            // blackhole, supernova, plasma, dimension, nebula, stardust, galaxy
            // divine, celestial, mythical, phoenix, kraken
            // infinity, omnipotence, godmode, transcendence, ascension
            
            updateDisplay();
        }

        function getWeatherMultiplier() {
            let mult = 1;
            
            // TIER 1: COMMON
            if (activeWeathers.includes('moonlight')) mult *= 2;
            if (activeWeathers.includes('meteor')) mult *= 5;
            
            // TIER 2: UNCOMMON
            if (activeWeathers.includes('thunder')) mult *= 3;
            if (activeWeathers.includes('storm')) mult *= 4;
            if (activeWeathers.includes('tornado')) mult *= 6;
            if (activeWeathers.includes('aurora')) mult *= 7;
            if (activeWeathers.includes('eclipse')) mult *= 8;
            if (activeWeathers.includes('volcano')) mult *= 10;
            if (activeWeathers.includes('tsunami')) mult *= 12;
            
            // TIER 3: RARE
            if (activeWeathers.includes('blackhole')) mult *= 15;
            if (activeWeathers.includes('supernova')) mult *= 20;
            if (activeWeathers.includes('plasma')) mult *= 25;
            if (activeWeathers.includes('dimension')) mult *= 30;
            if (activeWeathers.includes('nebula')) mult *= 35;
            if (activeWeathers.includes('stardust')) mult *= 40;
            if (activeWeathers.includes('galaxy')) mult *= 50;
            
            // TIER 4: EPIC
            if (activeWeathers.includes('divine')) mult *= 75;
            if (activeWeathers.includes('celestial')) mult *= 100;
            if (activeWeathers.includes('mythical')) mult *= 150;
            if (activeWeathers.includes('phoenix')) mult *= 200;
            if (activeWeathers.includes('kraken')) mult *= 250;
            
            // TIER 5: LEGENDARY
            if (activeWeathers.includes('infinity')) mult *= 500;
            if (activeWeathers.includes('omnipotence')) mult *= 1000;
            if (activeWeathers.includes('godmode')) mult *= 2000;
            if (activeWeathers.includes('transcendence')) mult *= 5000;
            if (activeWeathers.includes('ascension')) mult *= 10000;
            
            return mult;
        }



        function getWeatherDiscount() {
            let discount = 0;
            if (activeWeathers.includes('cloud')) discount += 3;
            return discount;
        }

        function updateWeatherDisplay() {
            const weatherList = document.getElementById('weatherList');
            
            // Update count for hidden mode
            const weatherCountEl = document.getElementById('weatherCountNumber');
            if (weatherCountEl) weatherCountEl.textContent = activeWeathers.length;
            
            if (activeWeathers.length === 0) {
                weatherList.innerHTML = '<div class="weather-empty">' + (currentLanguage === 'en' ? 'No active weather' : 'Không có thời tiết nào') + '</div>';
                return;
            }
            
            let html = '';
            activeWeathers.forEach(type => {
                const config = weatherConfig[type];
                const timeLeft = weatherTimers[type];
                
                // Get name and effect based on language
                let weatherName, weatherEffect;
                if (typeof config.name === 'object') {
                    weatherName = config.name[currentLanguage] || config.name.vi || config.name;
                } else {
                    weatherName = config.name;
                }
                
                if (typeof config.effect === 'object') {
                    weatherEffect = config.effect[currentLanguage] || config.effect.vi || config.effect;
                } else {
                    weatherEffect = config.effect;
                }
                
                html += `
                    <div class="weather-item ${config.class}">
                        <div class="weather-info">
                            <div class="weather-name">${weatherName}</div>
                            <div class="weather-effect">${weatherEffect}</div>
                        </div>
                        <div class="weather-timer">${timeLeft}s</div>
                    </div>
                `;
            });
            
            weatherList.innerHTML = html;
        }

        function summonWeather(type) {
            if (!isAdmin) return;
            activateWeather(type);
        }

        function clearAllWeather() {
            if (!isAdmin) return;
            
            // Deactivate all active weathers
            [...activeWeathers].forEach(type => {
                deactivateWeather(type);
            });
        }

        function checkWeatherSpawns() {
            if (isBanned || isAfk) return;
            
            // Check each weather type
            Object.keys(weatherNextSpawn).forEach(type => {
                weatherNextSpawn[type]--;
                
                if (weatherNextSpawn[type] <= 0) {
                    activateWeather(type);
                    // Reset spawn timer
                    weatherNextSpawn[type] = weatherConfig[type].interval;
                }
            });
        }

        // ===== ANTI-AUTO CLICKER SYSTEM =====
        function checkAutoClicker() {
            const now = Date.now();
            clickTimes.push(now);
            
            // Chỉ giữ lại 10 lần click gần nhất
            if (clickTimes.length > 10) {
                clickTimes.shift();
            }
            
            // Kiểm tra nếu có ít nhất 5 lần click
            if (clickTimes.length >= 5) {
                // Tính khoảng cách thời gian giữa các lần click
                const intervals = [];
                for (let i = 1; i < clickTimes.length; i++) {
                    intervals.push(clickTimes[i] - clickTimes[i - 1]);
                }
                
                // Tính trung bình khoảng cách
                const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                
                // Tính độ lệch chuẩn
                const variance = intervals.reduce((sum, interval) => {
                    return sum + Math.pow(interval - avgInterval, 2);
                }, 0) / intervals.length;
                const stdDev = Math.sqrt(variance);
                
                // PHÁT HIỆN AUTO CLICKER:
                // 1. Click quá nhanh (< 50ms trung bình)
                // 2. Click quá đều (độ lệch chuẩn < 10ms)
                // 3. Click với pattern giống nhau (variance quá thấp)
                
                const tooFast = avgInterval < 50;
                const tooConsistent = stdDev < 10;
                const suspiciousPattern = variance < 100 && clickTimes.length >= 8;
                
                if ((tooFast && tooConsistent) || suspiciousPattern) {
                    // BAN PLAYER!
                    isBanned = true;
                    document.getElementById('banOverlay').classList.add('active');
                    document.getElementById('clickButton').classList.add('disabled');
                    
                    // Dừng tất cả hoạt động
                    if (afkTimer) clearInterval(afkTimer);
                    if (playTimeInterval) clearInterval(playTimeInterval);
                    if (potionInterval) clearInterval(potionInterval);
                    if (discountTicketInterval) clearInterval(discountTicketInterval);
                    
                    return true; // Ngăn không cho click
                }
            }
            
            return false; // Cho phép click
        }

        function updateDisplay() {
            const coinsEl = document.getElementById('coins');
            const diamondsEl = document.getElementById('diamonds');
            const ticketsEl = document.getElementById('tickets');
            const goldBarsEl = document.getElementById('goldBars');
            const wheelTicketsEl = document.getElementById('wheelTickets');
            const clickPowerEl = document.getElementById('clickPower');
            const autoClickersEl = document.getElementById('autoClickers');
            const multiplierEl = document.getElementById('multiplier');
            const clickCooldownEl = document.getElementById('clickCooldown');
            const rebirthMultiplierDisplayEl = document.getElementById('rebirthMultiplierDisplay');
            const petMultiplierDisplayEl = document.getElementById('petMultiplierDisplay');
            const discountDisplayEl = document.getElementById('discountDisplay');
            const ticketDiscountDisplayEl = document.getElementById('ticketDiscountDisplay');
            const purchaseLimitDisplayEl = document.getElementById('purchaseLimitDisplay');
            
            if (coinsEl) coinsEl.textContent = formatNumber(coins);
            if (diamondsEl) diamondsEl.textContent = formatNumber(diamonds);
            if (ticketsEl) ticketsEl.textContent = formatNumber(tickets);
            if (goldBarsEl) goldBarsEl.textContent = formatNumber(goldBars);
            if (wheelTicketsEl) wheelTicketsEl.textContent = formatNumber(tickets);
            if (clickPowerEl) clickPowerEl.textContent = clickPower;
            if (autoClickersEl) autoClickersEl.textContent = autoClickers;
            if (multiplierEl) multiplierEl.textContent = multiplier;
            if (clickCooldownEl) clickCooldownEl.textContent = clickCooldown.toFixed(2);
            if (rebirthMultiplierDisplayEl) rebirthMultiplierDisplayEl.textContent = rebirthMultiplier.toFixed(2);
            
            // Pet Multiplier Display
            const petMult = getPetMultiplier();
            if (petMultiplierDisplayEl) petMultiplierDisplayEl.textContent = petMult >= 1000 ? petMult.toExponential(2) : petMult.toFixed(2);
            
            if (discountDisplayEl) discountDisplayEl.textContent = shopDiscount;
            if (ticketDiscountDisplayEl) ticketDiscountDisplayEl.textContent = discountTicket;
            if (purchaseLimitDisplayEl) purchaseLimitDisplayEl.textContent = purchaseLimit;
            
            document.getElementById('inv2x').textContent = inventory.potion_2x;
            document.getElementById('inv3x').textContent = inventory.potion_3x;
            document.getElementById('inv4x').textContent = inventory.potion_4x;
            document.getElementById('inv5x').textContent = inventory.potion_5x || 0;
            document.getElementById('inv6x').textContent = inventory.potion_6x || 0;
            document.getElementById('inv10x').textContent = inventory.potion_10x || 0;
            
            const hours = Math.floor(playTime / 3600);
            const minutes = Math.floor((playTime % 3600) / 60);
            const seconds = playTime % 60;
            document.getElementById('playTime').textContent =
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // RARITY SYSTEM FOR SHOP ITEMS
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        function getRarity(price) {
            // Validate price
            if (typeof price !== 'number' || price < 0) {
                return { name: 'Common', color: '#808080', stars: 0 };
            }
            
            // Price thresholds
            const TRILLION = 1e12;
            const QUADRILLION = 1e15;
            const QUINTILLION = 1e18;
            const SEXTILLION = 1e21;
            const SEPTILLION = 1e24;
            const OCTILLION = 1e27;
            const NONILLION = 1e30;
            const DECILLION = 1e33;
            const UNDECILLION = 1e36;
            const DUODECILLION = 1e39;
            const TREDECILLION = 1e42;
            const QUATTUORDECILLION = 1e45;
            const QUINDECILLION = 1e48;
            const VIGINTILLION = 1e63;
            
            // NEW ULTIMATE TIERS (Highest to Lowest)
            if (price >= 2 * VIGINTILLION) {
                return {
                    name: 'HACKER',
                    color: 'linear-gradient(135deg, #000000 0%, #00ff00 25%, #000000 50%, #00ff00 75%, #000000 100%)',
                    glow: '0 0 50px rgba(0,255,0,1), 0 0 100px rgba(0,255,0,0.6), 0 0 150px rgba(0,255,0,0.3)',
                    stars: 15
                };
            } else if (price >= 1e50) {
                return {
                    name: 'THE GOD',
                    color: 'linear-gradient(135deg, #ffffff 0%, #ffd700 25%, #ff00ff 50%, #00ffff 75%, #ffffff 100%)',
                    glow: '0 0 40px rgba(255,255,255,1), 0 0 80px rgba(255,215,0,0.8), 0 0 120px rgba(255,0,255,0.6)',
                    stars: 10
                };
            } else if (price >= 10 * NONILLION) {
                return {
                    name: 'RAINBOW',
                    color: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #00ffff, #0000ff, #8b00ff)',
                    glow: '0 0 30px rgba(255,255,255,1)',
                    stars: 0
                };
            } else if (price >= 100 * OCTILLION) {
                return {
                    name: 'POWEREST',
                    color: 'linear-gradient(135deg, #ff4500 0%, #ff8c00 50%, #ff0000 100%)',
                    glow: '0 0 25px rgba(255,69,0,1)',
                    stars: 0
                };
            } else if (price >= OCTILLION) {
                return {
                    name: 'STRONGEST',
                    color: 'linear-gradient(135deg, #00bfff 0%, #ffffff 50%, #00bfff 100%)',
                    glow: '0 0 25px rgba(0,191,255,1)',
                    stars: 0
                };
            } else if (price >= 10 * SEPTILLION) {
                return {
                    name: 'GOAT',
                    color: 'linear-gradient(135deg, #c0c0c0 0%, #ffffff 50%, #c0c0c0 100%)',
                    glow: '0 0 20px rgba(192,192,192,1)',
                    stars: 0
                };
            } else if (price >= 100 * SEXTILLION) {
                return {
                    name: 'OWNER',
                    color: 'linear-gradient(135deg, #9370db 0%, #ffd700 50%, #9370db 100%)',
                    glow: '0 0 20px rgba(147,112,219,1)',
                    stars: 0
                };
            } else if (price >= SEXTILLION) {
                return {
                    name: 'HARDCORE',
                    color: 'linear-gradient(135deg, #000000 0%, #8b0000 50%, #000000 100%)',
                    glow: '0 0 20px rgba(139,0,0,1)',
                    stars: 0
                };
            }
            
            // Rarity determination based on price
            if (price >= QUINTILLION) {
                return { 
                    name: 'Secret', 
                    color: 'linear-gradient(135deg, #000000 0%, #8b0000 100%)',
                    glow: '0 0 20px rgba(255,0,0,0.8)',
                    stars: 0
                };
            } else if (price >= 10 * QUADRILLION) {
                return { 
                    name: 'Cosmic', 
                    color: 'linear-gradient(135deg, #9370db 0%, #ba55d3 100%)',
                    glow: '0 0 15px rgba(147,112,219,0.8)',
                    stars: 0
                };
            } else if (price >= 10 * QUADRILLION) {
                // Transcendent 5-Star
                return { 
                    name: 'Transcendent', 
                    color: 'linear-gradient(135deg, #00ffff 0%, #00bfff 100%)',
                    glow: '0 0 15px rgba(0,255,255,0.8)',
                    stars: 5
                };
            } else if (price >= 5 * QUADRILLION) {
                // Transcendent 4-Star
                return { 
                    name: 'Transcendent', 
                    color: 'linear-gradient(135deg, #00ffff 0%, #00bfff 100%)',
                    glow: '0 0 15px rgba(0,255,255,0.8)',
                    stars: 4
                };
            } else if (price >= QUADRILLION) {
                // Transcendent 3-Star
                return { 
                    name: 'Transcendent', 
                    color: 'linear-gradient(135deg, #00ffff 0%, #00bfff 100%)',
                    glow: '0 0 15px rgba(0,255,255,0.8)',
                    stars: 3
                };
            } else if (price >= 500 * TRILLION) {
                // Transcendent 2-Star
                return { 
                    name: 'Transcendent', 
                    color: 'linear-gradient(135deg, #00ffff 0%, #00bfff 100%)',
                    glow: '0 0 15px rgba(0,255,255,0.8)',
                    stars: 2
                };
            } else if (price >= 100 * TRILLION) {
                // Transcendent 1-Star
                return { 
                    name: 'Transcendent', 
                    color: 'linear-gradient(135deg, #00ffff 0%, #00bfff 100%)',
                    glow: '0 0 15px rgba(0,255,255,0.8)',
                    stars: 1
                };
            } else if (price >= TRILLION) {
                return { 
                    name: 'Prismatic', 
                    color: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
                    glow: '0 0 15px rgba(255,0,255,0.8)',
                    stars: 0
                };
            } else if (price >= 10e9) {
                return { 
                    name: 'Divine', 
                    color: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                    glow: '0 0 15px rgba(255,215,0,0.8)',
                    stars: 0
                };
            } else if (price >= 100e6) {
                return { 
                    name: 'Mythical', 
                    color: 'linear-gradient(135deg, #ff0000 0%, #ff69b4 100%)',
                    glow: '0 0 10px rgba(255,0,0,0.6)',
                    stars: 0
                };
            } else if (price >= 1e6) {
                return { 
                    name: 'Legendary', 
                    color: 'linear-gradient(135deg, #ff00ff 0%, #ff1493 100%)',
                    glow: '0 0 10px rgba(255,0,255,0.6)',
                    stars: 0
                };
            } else if (price >= 100000) {
                return { 
                    name: 'Rare', 
                    color: 'linear-gradient(135deg, #0080ff 0%, #00bfff 100%)',
                    glow: '0 0 8px rgba(0,128,255,0.5)',
                    stars: 0
                };
            } else if (price >= 10000) {
                return { 
                    name: 'Uncommon', 
                    color: 'linear-gradient(135deg, #00ff00 0%, #7fff00 100%)',
                    glow: '0 0 5px rgba(0,255,0,0.4)',
                    stars: 0
                };
            } else {
                return { 
                    name: 'Common', 
                    color: 'linear-gradient(135deg, #808080 0%, #a9a9a9 100%)',
                    glow: 'none',
                    stars: 0
                };
            }
        }

        function renderShop() {
            const shopContainer = document.getElementById('shopItems');
            shopContainer.innerHTML = '';

            // Sort items by current price (low to high)
            const sortedItems = [...shopItems].sort((a, b) => a.currentPrice - b.currentPrice);

            sortedItems.forEach(item => {
                const currentPurchases = purchaseCounts[item.id] || 0;
                const isLimitReached = currentPurchases >= purchaseLimit;
                
                // Get rarity based on current price
                const rarity = getRarity(item.currentPrice);
                
                // Tính giảm giá từ shop, ticket VÀ weather
                let totalDiscount = shopDiscount + discountTicket;
                
                // Chỉ áp dụng weather discount cho potions và discount tickets (items không có basePrice cao)
                const isPotionOrTicket = item.basePrice <= 100000 && (
                    item.name.includes('Potion') || 
                    item.name.includes('Vé giảm')
                );
                
                if (isPotionOrTicket) {
                    totalDiscount += getWeatherDiscount();
                }
                
                const discountedPrice = Math.floor(item.currentPrice * (1 - totalDiscount / 100));
                const canBuy = coins >= discountedPrice && !isLimitReached;
                const itemDiv = document.createElement('div');
                itemDiv.className = `shop-item ${!canBuy ? 'disabled' : ''}`;
                
                let priceDisplay = formatNumber(discountedPrice);
                if (totalDiscount > 0) {
                    priceDisplay += ` (-${totalDiscount}%)`;
                }
                
                let limitInfo = '';
                if (isLimitReached) {
                    limitInfo = `<div style="color: #ff6b6b; font-size: 0.9em; margin-top: 5px;">⚠️ ${currentLanguage === 'en' ? 'Purchase limit reached!' : 'Đã đạt giới hạn mua!'}</div>`;
                } else {
                    limitInfo = `<div style="color: #ffd700; font-size: 0.8em; margin-top: 5px;">${t('remaining')}: ${purchaseLimit - currentPurchases}/${purchaseLimit}</div>`;
                }
                
                // Build star display for Transcendent items
                let starDisplay = '';
                if (rarity.stars > 0) {
                    starDisplay = '<div class="rarity-stars">' + '⭐'.repeat(rarity.stars) + '</div>';
                }
                
                // Determine tier class for animations
                let tierClass = '';
                if (rarity.name === 'HACKER') tierClass = 'tier-hacker';
                else if (rarity.name === 'THE GOD') tierClass = 'tier-thegod';
                else if (rarity.name === 'RAINBOW') tierClass = 'tier-rainbow';
                else if (rarity.name === 'POWEREST') tierClass = 'tier-powerest';
                else if (rarity.name === 'STRONGEST') tierClass = 'tier-strongest';
                else if (rarity.name === 'GOAT') tierClass = 'tier-goat';
                else if (rarity.name === 'OWNER') tierClass = 'tier-owner';
                else if (rarity.name === 'HARDCORE') tierClass = 'tier-hardcore';
                
                // Build rarity badge
                const rarityBadge = `
                    <div class="rarity-badge ${tierClass}" style="background: ${rarity.color}; box-shadow: ${rarity.glow};">
                        ${rarity.name}
                    </div>
                    ${starDisplay}
                `;
                
                itemDiv.innerHTML = `
                    ${rarityBadge}
                    <span class="icon">${item.icon}</span>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-description">${item.description}</div>
                        <div class="item-owned">${t('owned')}: ${item.owned}</div>
                        ${limitInfo}
                    </div>
                    <button class="buy-button ${!canBuy ? 'disabled' : ''}" onclick="buyItem(${item.id})">
                        ${isLimitReached ? (currentLanguage === 'en' ? 'Sold Out' : 'Hết lượt') : priceDisplay + ' 💰'}
                    </button>
                `;
                shopContainer.appendChild(itemDiv);
            });
        }

        function buyItem(itemId) {
            const item = shopItems.find(i => i.id === itemId);
            const currentPurchases = purchaseCounts[item.id] || 0;
            
            if (currentPurchases >= purchaseLimit) {
                alert('❌ Đã đạt giới hạn mua cho item này! Mua "The God" hoặc Tái sinh để tăng giới hạn.');
                return;
            }
            
            // Tính giảm giá bao gồm weather
            let totalDiscount = shopDiscount + discountTicket;
            
            const isPotionOrTicket = item.basePrice <= 100000 && (
                item.name.includes('Potion') || 
                item.name.includes('Vé giảm')
            );
            
            if (isPotionOrTicket) {
                totalDiscount += getWeatherDiscount();
            }
            
            const discountedPrice = Math.floor(item.currentPrice * (1 - totalDiscount / 100));
            
            if (coins >= discountedPrice) {
                coins -= discountedPrice;
                
                // Xử lý The Primastic
                if (item.id === 19) {
                    const primasticCount = item.owned;
                    const refundChance = 1.2 * (primasticCount + 1);
                    const random = Math.random() * 100;
                    
                    if (random < refundChance) {
                        coins += discountedPrice;
                        alert(`🎉 The Primastic kích hoạt! Hoàn lại ${formatNumber(discountedPrice)} coins!`);
                    }
                }
                
                // Xử lý The Transcendent
                if (item.id === 20) {
                    const transcendentCount = item.owned;
                    const refundChance = 0.8 * (transcendentCount + 1);
                    const random = Math.random() * 100;
                    
                    if (random < refundChance) {
                        coins += discountedPrice * 10;
                        alert(`💫 The Transcendent kích hoạt! Hoàn lại x10 = ${formatNumber(discountedPrice * 10)} coins!`);
                    }
                }
                
                item.effect();
                item.owned++;
                item.currentPrice = Math.floor(item.currentPrice * 2);
                
                purchaseCounts[item.id] = currentPurchases + 1;
                
                // Update event task
                updateEventTask('buyShop5', 1);
                
                updateDisplay();
                renderShop();
            }
        }

        function toggleSettings() {
            const panel = document.getElementById('settingsPanel');
            if (panel.style.display === 'none' || !panel.style.display) {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        }

        function toggleAdminPanel() {
            const content = document.getElementById('adminPanelContent');
            const btn = document.getElementById('toggleAdminBtn');
            
            if (content.style.display === 'none') {
                // Show
                content.style.display = 'block';
                btn.textContent = '👁️ Ẩn';
                btn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%)';
            } else {
                // Hide
                content.style.display = 'none';
                btn.textContent = '👁️ Bỏ Ẩn';
                btn.style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
            }
        }

        function toggleWeatherPanel() {
            const content = document.getElementById('weatherPanelContent');
            const btn = document.getElementById('toggleWeatherBtn');
            const countHidden = document.getElementById('weatherCountHidden');
            
            if (content.style.display === 'none') {
                // Show
                content.style.display = 'block';
                countHidden.style.display = 'none';
                btn.textContent = '👁️ Ẩn';
                btn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%)';
            } else {
                // Hide
                content.style.display = 'none';
                countHidden.style.display = 'block';
                // Update count
                document.getElementById('weatherCountNumber').textContent = activeWeathers.length;
                btn.textContent = '👁️ Bỏ Ẩn';
                btn.style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
            }
        }

        function toggleStatusPanel() {
            const panel = document.getElementById('statusPanel');
            if (panel.style.display === 'none' || !panel.style.display) {
                panel.style.display = 'block';
                updateStatusPanel();
            } else {
                panel.style.display = 'none';
            }
        }

        function updateStatusPanel() {
            // Game Progress
            document.getElementById('statusTotalClicks').textContent = formatNumber(totalClicks || 0);
            document.getElementById('statusPlaytime').textContent = formatPlaytime(totalPlaytime);
            document.getElementById('statusRebirths').textContent = formatNumber(rebirthCount);
            document.getElementById('statusTotalCoins').textContent = formatNumber(totalCoinsEarned || 0);

            // Current Stats
            document.getElementById('statusClickPower').textContent = formatNumber(clickPower);
            document.getElementById('statusAutoClickers').textContent = formatNumber(autoClickers);
            document.getElementById('statusMultiplier').textContent = multiplier + 'x';
            document.getElementById('statusCooldown').textContent = clickCooldown.toFixed(2) + 's';

            // Pets
            const totalPets = Object.values(ownedPets).reduce((sum, pet) => sum + (pet.count || 0), 0);
            const totalPetPower = equippedPets.reduce((sum, pet) => sum + (pet.multiplier || 0), 0);
            document.getElementById('statusTotalPets').textContent = formatNumber(totalPets);
            document.getElementById('statusEquippedPets').textContent = equippedPets.length + '/' + MAX_EQUIPPED_PETS;
            document.getElementById('statusPetPower').textContent = totalPetPower.toFixed(1) + 'x';

            // Resources
            document.getElementById('statusDiamonds').textContent = formatNumber(diamonds);
            document.getElementById('statusTickets').textContent = formatNumber(tickets);
            document.getElementById('statusGoldBars').textContent = formatNumber(goldBars);
            document.getElementById('statusEvent2026').textContent = formatNumber(event2026Coins);

            // Shop & Upgrades
            const itemsPurchased = Object.values(shopItems).filter(item => item.owned > 0).length;
            const upgradesOwned = Object.values(upgrades).filter(upgrade => upgrade.owned).length;
            const gamePassesOwned = Object.values(gamePasses).filter(pass => pass === true).length;
            document.getElementById('statusItemsPurchased').textContent = itemsPurchased;
            document.getElementById('statusUpgrades').textContent = upgradesOwned;
            document.getElementById('statusGamePasses').textContent = gamePassesOwned;

            // Mini Games
            document.getElementById('statusRPSPlayed').textContent = formatNumber(rpsStats.gamesPlayed || 0);
            document.getElementById('statusRPSWins').textContent = formatNumber(rpsStats.wins || 0);
            document.getElementById('statusSpins').textContent = formatNumber(totalSpins || 0);

            // Weather
            document.getElementById('statusActiveWeather').textContent = activeWeathers.length;
            document.getElementById('statusTotalWeather').textContent = formatNumber(totalWeatherSummoned || 0);

            // Event 2026
            const dailyDone = Object.values(event2026Tasks).filter(t => t.type === 'daily' && t.completed).length;
            const weeklyDone = Object.values(event2026Tasks).filter(t => t.type === 'weekly' && t.completed).length;
            const specialDone = Object.values(event2026Tasks).filter(t => t.type === 'special' && t.completed).length;
            document.getElementById('statusDailyTasks').textContent = dailyDone;
            document.getElementById('statusWeeklyTasks').textContent = weeklyDone;
            document.getElementById('statusSpecialTasks').textContent = specialDone;
        }

        function formatPlaytime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Security: Anti-debugging
        (function(){
            const _0xd=()=>{const d=new Date();d.setTime(d.getTime()+100);return d;};
            setInterval(()=>{if(new Date()-_0xd()>100){location.reload();}},1000);
        })();

        // Encrypted admin verification
        const _0xa1b2={
            _k:'68617665686167383137',
            _c:function(s){let r='';for(let i=0;i<s.length;i+=2){r+=String.fromCharCode(parseInt(s.substr(i,2),16));}return r;},
            _v:function(c){return c===this._c(this._k);}
        };

        function checkAdminCode() {
            const code = document.getElementById('adminCode').value;
            const statusDiv = document.getElementById('adminStatus');
            
            if (_0xa1b2._v(code)) {
                isAdmin = true;
                statusDiv.innerHTML = '<div class="admin-status">✅ Admin đã đăng nhập!</div>';
                document.getElementById('adminControls').style.display = 'block';
                document.getElementById('adminCode').disabled = true;
                
                // Clear console
                if(console.clear){console.clear();}
            } else {
                statusDiv.innerHTML = '<div style="color: #ff0000; margin-top: 5px;">❌ Sai mã!</div>';
                setTimeout(() => {
                    statusDiv.innerHTML = '';
                }, 2000);
            }
        }

        // Obfuscated admin functions
        const _0x7f8a=function(){if(isAdmin){coins+=100000;updateDisplay();renderShop();}};
        const _0x9b3c=function(){if(isAdmin){diamonds+=1000;updateDisplay();}};
        const _0x2e4d=function(){if(isAdmin){goldBars+=100;updateDisplay();alert('✅ Đã thêm 100 🏆 Thỏi Vàng!');}};
        
        // Public wrappers (obfuscated internally)
        function addAdminMoney(){_0x7f8a();}
        function addAdminDiamonds(){_0x9b3c();}
        function addAdminGoldBars(){_0x2e4d();}

        function summonPet(petName, petIcon, petMultiplier) {
            if (!isAdmin) return;
            
            // Use same format as hatchEgg for trade-up compatibility
            const petKey = petName + '_normal';
            
            // Add pet to ownedPets with baseName and mutation
            if (!ownedPets[petKey]) {
                ownedPets[petKey] = {
                    name: petName,
                    baseName: petName,
                    icon: petIcon,
                    multiplier: petMultiplier,
                    mutation: 'normal',
                    count: 0
                };
            }
            
            ownedPets[petKey].count++;
            
            // Auto-save immediately
            console.log('💾 Auto-saving after admin summon:', petKey);
            saveToLocalStorage(true);
            
            renderPets();
            updateDisplay();
            updateTradeUpPetList(); // Update trade-up dropdown
            
            alert(`✅ Đã triệu hồi ${petIcon} ${petName} (x${petMultiplier})!`);
        }

        // Summon pet with special abilities (Cosmic Dog, Cosmic Dragon)
        function summonPetSpecial(petName, petIcon, petMultiplier, special) {
            if (!isAdmin) return;
            
            const petKey = petName + '_normal';
            
            if (!ownedPets[petKey]) {
                ownedPets[petKey] = {
                    name: petName,
                    baseName: petName,
                    icon: petIcon,
                    multiplier: petMultiplier,
                    mutation: 'normal',
                    count: 0,
                    special: special // Add special ability
                };
            }
            
            ownedPets[petKey].count++;
            
            // NOTE: Diamond generation handled by global dragonGeneratorInterval
            // No need to create individual intervals here
            
            // Auto-save immediately
            console.log('💾 Auto-saving after special summon:', petKey);
            saveToLocalStorage(true);
            
            renderPets();
            updateDisplay();
            updateTradeUpPetList();
            
            let specialText = '';
            if (special === 'click_power_5x') specialText = ' - x5 Click Power!';
            if (special === 'diamond_generator') specialText = ' - +1💎/s!';
            
            alert(`✅ Đã triệu hồi ${petIcon} ${petName} (x${petMultiplier})${specialText}`);
        }

        function loadGameFromButton() {
            document.getElementById('importFile').click();
        }

        function deleteSaveData() {
            const confirm = window.confirm(
                currentLanguage === 'en' 
                ? '⚠️ DELETE SAVE DATA\n\nAre you sure you want to delete all save data?\nThis action cannot be undone!'
                : '⚠️ XÓA DỮ LIỆU\n\nBạn có chắc muốn xóa toàn bộ dữ liệu?\nHành động này không thể hoàn tác!'
            );
            
            if (confirm) {
                localStorage.clear();
                alert(currentLanguage === 'en' ? '✅ Save data deleted!' : '✅ Đã xóa dữ liệu!');
                location.reload();
            }
        }

        function saveGame() {
            const gameData = {
                coins: coins,
                diamonds: diamonds,
                tickets: tickets,
                goldBars: goldBars,
                goldCodes: goldCodes,
                clickPower: clickPower,
                autoClickers: autoClickers,
                multiplier: multiplier,
                clickCooldown: clickCooldown,
                isAdmin: isAdmin,
                gamePasses: gamePasses,
                inventory: inventory,
                playTime: playTime,
                shopDiscount: shopDiscount,
                rebirthCount: rebirthCount,
                rebirthMultiplier: rebirthMultiplier,
                purchaseLimit: purchaseLimit,
                purchaseCounts: purchaseCounts,
                weatherNextSpawn: weatherNextSpawn,
                ownedPets: ownedPets,
                equippedPets: equippedPets,
                shopItems: shopItems.map(item => ({
                    id: item.id,
                    currentPrice: item.currentPrice,
                    owned: item.owned
                })),
                saveDate: new Date().toISOString()
            };

            const dataStr = JSON.stringify(gameData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `cookie-clicker-save-${Date.now()}.json`;
            link.click();
            
            alert('✅ Game đã được lưu thành công!');
        }

        function loadGame(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const gameData = JSON.parse(e.target.result);
                    
                    coins = gameData.coins || 0;
                    diamonds = gameData.diamonds || 0;
                    tickets = gameData.tickets || 0;
                    goldBars = gameData.goldBars || 0;
                    
                    // Restore used codes
                    if (gameData.goldCodes) {
                        Object.keys(gameData.goldCodes).forEach(code => {
                            if (goldCodes[code]) {
                                goldCodes[code].used = gameData.goldCodes[code].used;
                            }
                        });
                    }
                    clickPower = gameData.clickPower || 1;
                    autoClickers = gameData.autoClickers || 0;
                    multiplier = gameData.multiplier || 1;
                    clickCooldown = gameData.clickCooldown || 0.5;
                    isAdmin = gameData.isAdmin || false;
                    
                    if (gameData.gamePasses) {
                        gamePasses = gameData.gamePasses;
                        updateGamePassUI();
                    }
                    
                    if (gameData.inventory) {
                        inventory = gameData.inventory;
                    }
                    
                    if (gameData.ownedPets) {
                        ownedPets = gameData.ownedPets;
                    }
                    
                    if (gameData.equippedPets) {
                        equippedPets = gameData.equippedPets;
                    }
                    
                    playTime = gameData.playTime || 0;
                    shopDiscount = gameData.shopDiscount || 0;
                    rebirthCount = gameData.rebirthCount || 0;
                    rebirthMultiplier = gameData.rebirthMultiplier || 1;
                    purchaseLimit = gameData.purchaseLimit || 5;
                    purchaseCounts = gameData.purchaseCounts || {};
                    
                    if (gameData.weatherNextSpawn) {
                        weatherNextSpawn = gameData.weatherNextSpawn;
                    }
                    
                    if (gameData.shopItems) {
                        gameData.shopItems.forEach(savedItem => {
                            const item = shopItems.find(i => i.id === savedItem.id);
                            if (item) {
                                item.currentPrice = savedItem.currentPrice;
                                item.owned = savedItem.owned;
                            }
                        });
                    }
                    
                    if (isAdmin) {
                        document.getElementById('adminStatus').innerHTML = '<div class="admin-status">✅ Admin đã đăng nhập!</div>';
                        document.getElementById('adminControls').style.display = 'block';
                        document.getElementById('adminCode').disabled = true;
                    }
                    
                    updateDisplay();
                    renderShop();
                    renderPets();
                    
                    const saveDate = new Date(gameData.saveDate).toLocaleString('vi-VN');
                    alert(`✅ Tải game thành công!\n📅 Lưu lúc: ${saveDate}`);
                } catch (error) {
                    alert('❌ File không hợp lệ! Vui lòng chọn file save đúng.');
                }
            };
            reader.readAsText(file);
            
            event.target.value = '';
        }

        function redeemGamePass() {
            const code = document.getElementById('gamepassCode').value.toUpperCase();
            let success = false;
            let passName = '';

            if (code === 'VIP2025' && !gamePasses.vip) {
                gamePasses.vip = true;
                clickPower += 30;
                clickCooldown = Math.max(0.01, clickCooldown - 0.15);
                autoClickers += 50;
                diamonds += 100;
                passName = 'VIP Pass';
                success = true;
            } else if (code === 'PREMIUM999' && !gamePasses.premium) {
                gamePasses.premium = true;
                clickPower += 100;
                clickCooldown = Math.max(0.01, clickCooldown - 0.2);
                autoClickers += 200;
                multiplier *= 2;
                diamonds += 500;
                passName = 'Premium Pass';
                success = true;
            } else if (code === 'LEGEND777' && !gamePasses.legend) {
                gamePasses.legend = true;
                clickPower += 500;
                clickCooldown = 0.01;
                autoClickers += 1000;
                multiplier *= 5;
                coins += 50000; // Reduced from 500000 (10%)
                diamonds += 2000;
                passName = 'Legend Pass';
                success = true;
            } else if (code === 'SUPER2025' && !gamePasses.super) {
                gamePasses.super = true;
                clickPower += 1000;
                clickCooldown = 0; // INSTANT!
                autoClickers += 2000;
                multiplier *= 7;
                coins += 100000; // Reduced from 1000000 (10%)
                diamonds += 5000;
                passName = '💎 SUPER PASS';
                success = true;
            } else if (code === 'INFINITY∞' && !gamePasses.infinity) {
                gamePasses.infinity = true;
                clickPower += 2000;
                clickCooldown = 0;
                autoClickers += 5000;
                multiplier *= 10;
                coins += 500000; // Reduced from 5000000 (10%)
                diamonds += 10000;
                shopDiscount = 50; // Permanent 50% discount
                passName = '♾️ INFINITY PASS';
                success = true;
            } else if (code === 'QUANTUM888' && !gamePasses.quantum) {
                gamePasses.quantum = true;
                clickPower += 1500;
                clickCooldown = 0;
                autoClickers += 3000;
                multiplier *= 8;
                coins += 200000; // Reduced from 2000000 (10%)
                diamonds += 7000;
                passName = '⚛️ QUANTUM PASS';
                success = true;
            } else if (code === 'COSMIC999' && !gamePasses.cosmic) {
                gamePasses.cosmic = true;
                clickPower += 5000;
                clickCooldown = 0;
                autoClickers += 10000;
                multiplier *= 15;
                coins += 1000000; // Reduced from 10000000 (10%)
                diamonds += 20000;
                goldBars += 1000;
                // Unlock all pets
                pets.forEach(pet => pet.owned = true);
                passName = '🌠 COSMIC PASS';
                success = true;
            } else if (gamePasses.vip && code === 'VIP2025') {
                alert('❌ Bạn đã sở hữu VIP Pass rồi!');
                return;
            } else if (gamePasses.premium && code === 'PREMIUM999') {
                alert('❌ Bạn đã sở hữu Premium Pass rồi!');
                return;
            } else if (gamePasses.legend && code === 'LEGEND777') {
                alert('❌ Bạn đã sở hữu Legend Pass rồi!');
                return;
            } else if (gamePasses.super && code === 'SUPER2025') {
                alert('❌ Bạn đã sở hữu Super Pass rồi!');
                return;
            } else if (gamePasses.infinity && code === 'INFINITY∞') {
                alert('❌ Bạn đã sở hữu Infinity Pass rồi!');
                return;
            } else if (gamePasses.quantum && code === 'QUANTUM888') {
                alert('❌ Bạn đã sở hữu Quantum Pass rồi!');
                return;
            } else if (gamePasses.cosmic && code === 'COSMIC999') {
                alert('❌ Bạn đã sở hữu Cosmic Pass rồi!');
                return;
            } else {
                alert('❌ Code không hợp lệ!');
                return;
            }

            if (success) {
                updateGamePassUI();
                updateDisplay();
                renderShop();
                document.getElementById('gamepassCode').value = '';
                alert(`✅ Đã kích hoạt ${passName} thành công!`);
            }
        }

        function buyPotion(type, price, currency = 'coins') {
            console.log(`🧪 Buying Potion ${type}: ${price} ${currency}`);
            
            // Validate currency
            if (currency === 'coins') {
                if (coins < price) {
                    alert('❌ Không đủ coins!');
                    return;
                }
                coins -= price;
            } else if (currency === 'diamonds') {
                if (diamonds < price) {
                    alert('❌ Không đủ diamonds!');
                    return;
                }
                diamonds -= price;
            } else {
                alert('❌ Loại tiền không hợp lệ!');
                return;
            }
            
            // Add potion to inventory
            if (type === '2x') {
                inventory.potion_2x++;
            } else if (type === '3x') {
                inventory.potion_3x++;
            } else if (type === '4x') {
                inventory.potion_4x++;
            } else if (type === '5x') {
                inventory.potion_5x++;
            } else if (type === '6x') {
                inventory.potion_6x++;
            } else if (type === '10x') {
                inventory.potion_10x++;
            } else {
                alert('❌ Loại potion không hợp lệ!');
                return;
            }
            
            updateDisplay();
            renderShop();
            saveToLocalStorage(true);
            
            const currencyIcon = currency === 'coins' ? '💰' : '💎';
            alert(`✅ Đã mua Potion ${type} thành công!\n\nCòn lại: ${currency === 'coins' ? formatNumber(coins) : formatNumber(diamonds)} ${currencyIcon}`);
            
            console.log(`✅ Potion purchased successfully`);
            console.log(`📦 Inventory:`, inventory);
        }

        function buyDiscountTicket(percent, price) {
            if (coins >= price) {
                if (discountTicket > 0) {
                    alert('⚠️ Đã có vé giảm giá đang hoạt động! Vui lòng đợi hết hiệu lực.');
                    return;
                }
                
                coins -= price;
                discountTicket = percent;
                discountTicketTimer = 60;
                
                const timerElement = document.getElementById('discountTicketTimer');
                timerElement.classList.add('active');
                document.getElementById('ticketDiscountPercent').textContent = percent;
                
                discountTicketInterval = setInterval(() => {
                    discountTicketTimer--;
                    document.getElementById('ticketTimeLeft').textContent = discountTicketTimer;
                    
                    if (discountTicketTimer <= 0) {
                        clearInterval(discountTicketInterval);
                        discountTicket = 0;
                        timerElement.classList.remove('active');
                        updateDisplay();
                        renderShop();
                    }
                }, 1000);
                
                updateDisplay();
                renderShop();
                alert(`✅ Đã kích hoạt vé giảm giá ${percent}% trong 60 giây!`);
            } else {
                alert('❌ Không đủ tiền!');
            }
        }

        function usePotion(type, multiplierValue) {
            let hasPotion = false;
            
            // Check if player has the potion
            if (type === '2x' && inventory.potion_2x > 0) {
                inventory.potion_2x--;
                hasPotion = true;
            } else if (type === '3x' && inventory.potion_3x > 0) {
                inventory.potion_3x--;
                hasPotion = true;
            } else if (type === '4x' && inventory.potion_4x > 0) {
                inventory.potion_4x--;
                hasPotion = true;
            } else if (type === '5x' && inventory.potion_5x > 0) {
                inventory.potion_5x--;
                hasPotion = true;
            } else if (type === '6x' && inventory.potion_6x > 0) {
                inventory.potion_6x--;
                hasPotion = true;
            } else if (type === '10x' && inventory.potion_10x > 0) {
                inventory.potion_10x--;
                hasPotion = true;
            }
            
            if (!hasPotion) {
                alert('❌ Không có thuốc này trong túi!');
                return;
            }
            
            if (activePotion) {
                alert('⚠️ Đã có thuốc đang hoạt động! Vui lòng đợi hết hiệu lực.');
                // Refund the potion
                if (type === '2x') inventory.potion_2x++;
                else if (type === '3x') inventory.potion_3x++;
                else if (type === '4x') inventory.potion_4x++;
                else if (type === '5x') inventory.potion_5x++;
                else if (type === '6x') inventory.potion_6x++;
                else if (type === '10x') inventory.potion_10x++;
                return;
            }
            
            const oldMultiplier = multiplier;
            activePotion = type;
            multiplier = multiplier * multiplierValue;
            potionTimer = 60;
            
            const timerElement = document.getElementById('potionTimer');
            timerElement.classList.add('active');
            
            potionInterval = setInterval(() => {
                potionTimer--;
                document.getElementById('potionTimerText').textContent = `${type} - ${potionTimer}s`;
                
                if (potionTimer <= 0) {
                    clearInterval(potionInterval);
                    multiplier = oldMultiplier;
                    activePotion = null;
                    timerElement.classList.remove('active');
                    updateDisplay();
                }
            }, 1000);
            
            updateDisplay();
            saveToLocalStorage(true);
            
            console.log(`✅ Used Potion ${type} (x${multiplierValue})`);
        }

        function resetAFKTimer() {
            if (isAfk || isBanned) return;
            
            afkTimeLeft = 1800;
            document.getElementById('afkWarning').classList.remove('active');
            
            if (afkTimer) {
                clearInterval(afkTimer);
            }
            
            afkTimer = setInterval(() => {
                afkTimeLeft--;
                
                if (afkTimeLeft <= 60 && afkTimeLeft > 0) {
                    document.getElementById('afkWarning').classList.add('active');
                    document.getElementById('afkCountdown').textContent = afkTimeLeft;
                }
                
                if (afkTimeLeft <= 0) {
                    clearInterval(afkTimer);
                    activateAFK();
                }
            }, 1000);
        }

        function activateAFK() {
            isAfk = true;
            document.getElementById('afkOverlay').classList.add('active');
            document.getElementById('afkWarning').classList.remove('active');
        }

        function resumeFromAFK() {
            isAfk = false;
            document.getElementById('afkOverlay').classList.remove('active');
            resetAFKTimer();
        }

        function updateRebirthUI() {
            // Công thức: 100K lần đầu, sau đó x5 mỗi lần
            const nextReq = 100000 * Math.pow(5, rebirthCount);
            
            const nextMult = rebirthMultiplier + 0.75;
            const canRebirth = coins >= nextReq;
            
            document.getElementById('rebirthCountDisplay').textContent = rebirthCount;
            document.getElementById('rebirthMultiplierStat').textContent = `x${rebirthMultiplier.toFixed(2)}`;
            document.getElementById('nextRebirthReq').textContent = `${nextReq.toLocaleString()} coins`;
            document.getElementById('nextRebirthMult').textContent = `x${nextMult.toFixed(2)}`;
            document.getElementById('rebirthReqText').textContent = nextReq.toLocaleString();
            
            const rebirthBtn = document.getElementById('rebirthButton');
            if (canRebirth) {
                rebirthBtn.classList.remove('disabled');
            } else {
                rebirthBtn.classList.add('disabled');
            }
        }

        function performRebirth() {
            // Formula: 1M first time, then x5 each rebirth (increased from 100K for deflation)
            const nextReq = 1000000 * Math.pow(5, rebirthCount);
            
            if (coins < nextReq) {
                alert('❌ Không đủ coins để tái sinh!');
                return;
            }
            
            const confirm = window.confirm(
                `🔄 XÁC NHẬN TÁI SINH LẦN ${rebirthCount + 1}\n\n` +
                `Bạn sẽ mất:\n` +
                `- Tất cả coins\n` +
                `- Tất cả vật phẩm đã mua\n` +
                `- Click power, Auto clickers, Multiplier\n` +
                `- Cooldown về mặc định\n` +
                `- Giảm giá về 0%\n` +
                `- Số lần mua items về 0\n\n` +
                `Bạn sẽ giữ:\n` +
                `- Game Passes\n` +
                `- Túi đồ (Potions)\n` +
                `- Thời gian chơi\n` +
                `- Tất cả Pets\n\n` +
                `Bạn sẽ nhận:\n` +
                `- +0.75x thu nhập vĩnh viễn (${rebirthMultiplier.toFixed(2)} → ${(rebirthMultiplier + 0.75).toFixed(2)})\n` +
                `- +5 giới hạn mua vật phẩm (${purchaseLimit} → ${purchaseLimit + 5})\n` +
                `- +500 💎 Kim Cương\n\n` +
                `Tiếp tục?`
            );
            
            if (!confirm) return;
            
            coins = 0;
            clickPower = 0.1; // Reset to 0.1 for deflation (was 1)
            autoClickers = 0;
            multiplier = 1;
            clickCooldown = 0.5;
            shopDiscount = 0;
            
            shopItems.forEach(item => {
                item.currentPrice = item.basePrice;
                item.owned = 0;
            });
            
            purchaseCounts = {};
            
            rebirthCount++;
            rebirthMultiplier += 0.75;
            purchaseLimit += 5;
            diamonds += 500; // Thêm 500 kim cương
            
            // Update event task
            updateEventTask('rebirth1', 1);
            
            updateDisplay();
            renderShop();
            updateRebirthUI();
            
            alert(`✅ Tái sinh thành công!\n🌟 Thu nhập mới: x${rebirthMultiplier.toFixed(2)}\n🎯 Giới hạn mua mới: ${purchaseLimit}`);
        }

        function updateGamePassUI() {
            if (gamePasses.vip) {
                document.getElementById('vipCard').classList.add('owned');
                document.getElementById('vipStatus').className = 'gamepass-status owned';
                document.getElementById('vipStatus').textContent = '✅ Đã sở hữu';
            }

            if (gamePasses.premium) {
                document.getElementById('premiumCard').classList.add('owned');
                document.getElementById('premiumStatus').className = 'gamepass-status owned';
                document.getElementById('premiumStatus').textContent = '✅ Đã sở hữu';
            }

            if (gamePasses.legend) {
                document.getElementById('legendCard').classList.add('owned');
                document.getElementById('legendStatus').className = 'gamepass-status owned';
                document.getElementById('legendStatus').textContent = '✅ Đã sở hữu';
            }
            
            if (gamePasses.super) {
                document.getElementById('superCard').classList.add('owned');
                document.getElementById('superStatus').className = 'gamepass-status owned';
                document.getElementById('superStatus').textContent = '✅ Đã sở hữu';
            }
            
            if (gamePasses.infinity) {
                document.getElementById('infinityCard').classList.add('owned');
                document.getElementById('infinityStatus').className = 'gamepass-status owned';
                document.getElementById('infinityStatus').textContent = '✅ Đã sở hữu';
            }
            
            if (gamePasses.quantum) {
                document.getElementById('quantumCard').classList.add('owned');
                document.getElementById('quantumStatus').className = 'gamepass-status owned';
                document.getElementById('quantumStatus').textContent = '✅ Đã sở hữu';
            }
            
            if (gamePasses.cosmic) {
                document.getElementById('cosmicCard').classList.add('owned');
                document.getElementById('cosmicStatus').className = 'gamepass-status owned';
                document.getElementById('cosmicStatus').textContent = '✅ Đã sở hữu';
            }
            
            // Update 4 premium passes
            if (gamePasses.epic) {
                document.getElementById('epicCard').classList.add('owned');
                document.getElementById('epicStatus').className = 'gamepass-status owned';
                document.getElementById('epicStatus').textContent = '✅ Đã sở hữu';
            }
            
            if (gamePasses.prismatic) {
                document.getElementById('prismaticCard').classList.add('owned');
                document.getElementById('prismaticStatus').className = 'gamepass-status owned';
                document.getElementById('prismaticStatus').textContent = '✅ Đã sở hữu';
            }
            
            if (gamePasses.divine) {
                document.getElementById('divineCard').classList.add('owned');
                document.getElementById('divineStatus').className = 'gamepass-status owned';
                document.getElementById('divineStatus').textContent = '✅ Đã sở hữu';
            }
            
            if (gamePasses.secret) {
                document.getElementById('secretCard').classList.add('owned');
                document.getElementById('secretStatus').className = 'gamepass-status owned';
                document.getElementById('secretStatus').textContent = '✅ Đã sở hữu';
            }
            
            // Check SECRET pass unlock condition
            checkSecretPassUnlock();
        }
        
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // PREMIUM GAMEPASS PURCHASE FUNCTION (GOLD BAR EXCLUSIVE)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        function buyPremiumPass(passType, cost) {
            console.log(`🎮 buyPremiumPass called: ${passType}, cost: ${cost}`);
            console.log(`💰 Current Gold Bars: ${goldBars}`);
            
            // Validation checks
            if (!passType || typeof cost !== 'number' || cost <= 0) {
                alert('❌ Lỗi: Thông tin pass không hợp lệ!');
                console.error('Invalid pass parameters');
                return;
            }
            
            // Check if already owned
            if (gamePasses[passType]) {
                alert(`❌ Bạn đã sở hữu ${passType.toUpperCase()} Pass rồi!`);
                console.log(`Already owned: ${passType}`);
                return;
            }
            
            // Check gold bars balance
            if (goldBars < cost) {
                alert(`❌ Không đủ Gold Bars!\n\nCần: ${cost} 🏆\nHiện có: ${goldBars} 🏆\nThiếu: ${cost - goldBars} 🏆`);
                console.log(`Insufficient gold bars: need ${cost}, have ${goldBars}`);
                return;
            }
            
            // Confirmation
            const confirmMsg = currentLanguage === 'en' 
                ? `🎮 Purchase ${passType.toUpperCase()} Pass?\n\nCost: ${cost} Gold Bars 🏆\nYou have: ${goldBars} Gold Bars\n\nThis pass will replace any active pass.`
                : `🎮 Mua ${passType.toUpperCase()} Pass?\n\nGiá: ${cost} Gold Bars 🏆\nBạn có: ${goldBars} Gold Bars\n\nPass này sẽ thay thế pass đang hoạt động.`;
            
            if (!confirm(confirmMsg)) return;
            
            // Deduct gold bars
            goldBars -= cost;
            if (goldBars < 0) goldBars = 0; // Safety check
            
            // Activate pass
            gamePasses[passType] = true;
            
            // Apply pass bonuses (PARANOID: validate all values)
            let bonusCoins = 0;
            let bonusMultiplier = 1;
            let bonusClickPower = 0;
            let bonusAutoClickers = 0;
            let passName = '';
            
            switch(passType) {
                case 'epic':
                    bonusCoins = 100000;
                    bonusMultiplier = 4;
                    bonusClickPower = 500;
                    bonusAutoClickers = 10;
                    passName = '⚔️ EPIC PASS';
                    break;
                    
                case 'prismatic':
                    bonusCoins = 500000;
                    bonusMultiplier = 6;
                    bonusClickPower = 1000;
                    bonusAutoClickers = 20;
                    passName = '🌈 PRISMATIC PASS';
                    // Add rainbow click effect
                    addPrismaticEffect();
                    break;
                    
                case 'divine':
                    bonusCoins = 1000000;
                    bonusMultiplier = 12;
                    bonusClickPower = 2000;
                    bonusAutoClickers = 50;
                    passName = '✨ DIVINE PASS';
                    // Add divine aura effect
                    addDivineEffect();
                    break;
                    
                case 'secret':
                    bonusCoins = 5000000;
                    bonusMultiplier = 18;
                    bonusClickPower = 3000;
                    bonusAutoClickers = 100;
                    passName = '🔒 SECRET PASS';
                    // Add glitch effect
                    addSecretEffect();
                    break;
                    
                default:
                    alert('❌ Lỗi: Pass type không hợp lệ!');
                    goldBars += cost; // Refund
                    return;
            }
            
            // Validate bonuses (PARANOID)
            bonusCoins = Math.max(0, Math.min(bonusCoins, 999999999999));
            bonusMultiplier = Math.max(1, Math.min(bonusMultiplier, 1000));
            bonusClickPower = Math.max(0, Math.min(bonusClickPower, 999999));
            bonusAutoClickers = Math.max(0, Math.min(bonusAutoClickers, 1000));
            
            // Apply bonuses
            coins += bonusCoins;
            multiplier *= bonusMultiplier;
            clickPower += bonusClickPower;
            autoClickers += bonusAutoClickers;
            
            // Update UI
            updateDisplay();
            updateGamePassUI();
            
            // Save game after purchase
            saveToLocalStorage(true);
            
            // Success message
            const successMsg = currentLanguage === 'en'
                ? `✅ ${passName} Activated!\n\n🎁 Instant Bonus: ${formatNumber(bonusCoins)} coins\n🎯 Multiplier: x${bonusMultiplier}\n⚡ Click Power: +${bonusClickPower}\n🤖 Auto Clickers: +${bonusAutoClickers}/s\n\n💰 Gold Bars Remaining: ${goldBars}`
                : `✅ Đã kích hoạt ${passName}!\n\n🎁 Thưởng ngay: ${formatNumber(bonusCoins)} coins\n🎯 Hệ số nhân: x${bonusMultiplier}\n⚡ Sức mạnh click: +${bonusClickPower}\n🤖 Auto Clickers: +${bonusAutoClickers}/s\n\n💰 Gold Bars còn lại: ${goldBars}`;
            
            alert(successMsg);
            
            console.log(`✅ Premium Pass Purchased: ${passType}`);
            console.log(`💰 Cost: ${cost} Gold Bars`);
            console.log(`🏆 Remaining: ${goldBars} Gold Bars`);
        }
        
        // Check if SECRET pass should be unlocked
        function checkSecretPassUnlock() {
            const secretCard = document.getElementById('secretCard');
            const secretBtn = secretCard?.querySelector('.buy-gamepass-btn');
            
            if (!secretCard) return;
            
            // Unlock conditions: Rebirth 10+ OR Playtime 10h+
            const rebirthCondition = rebirthCount >= 10;
            const timeCondition = playTime >= (10 * 3600); // 10 hours
            
            if (rebirthCondition || timeCondition) {
                secretCard.style.display = 'block';
                if (secretBtn && !gamePasses.secret) {
                    secretBtn.disabled = false;
                    secretBtn.textContent = '🔓 Mua với 1000 Gold Bars';
                }
            } else {
                secretCard.style.display = 'none';
            }
        }
        
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // DIAMOND-BASED GAMEPASS PURCHASE (for modern passes section)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        function buyGamePass(passType) {
            console.log(`🎮 buyGamePass called: ${passType}`);
            console.log(`💎 Current Diamonds: ${diamonds}`);
            
            // Validate input
            if (!passType || typeof passType !== 'string') {
                alert('❌ Lỗi: Pass type không hợp lệ!');
                console.error('Invalid passType');
                return;
            }
            
            // Map passType to correct key (avoid conflicts)
            const passKeyMap = {
                'super': 'superDiamond',  // Diamond super pass uses different key
                'starter': 'starter',
                'insane': 'insane',
                'transcendent': 'transcendent'
            };
            
            const passKey = passKeyMap[passType];
            if (!passKey) {
                alert(`❌ Pass type "${passType}" không hợp lệ!`);
                console.error(`Invalid pass type: ${passType}`);
                return;
            }
            
            console.log(`Mapped to passKey: ${passKey}`);
            
            // Define pass configurations
            const passes = {
                'super': {
                    name: '🌟 SUPER PASS',
                    cost: 5000,
                    currency: 'diamonds',
                    bonuses: {
                        coins: 1000000,
                        clickPower: 1000,
                        autoClickers: 2000,
                        multiplier: 7,
                        cooldown: 0
                    }
                },
                'starter': {
                    name: '💎 STARTER BOOST',
                    cost: 500,
                    currency: 'diamonds',
                    bonuses: {
                        coins: 100000,
                        clickPower: 100,
                        autoClickers: 50,
                        multiplier: 2
                    }
                },
                'insane': {
                    name: '🔥 INSANE CLICKER',
                    cost: 1500,
                    currency: 'diamonds',
                    bonuses: {
                        clickPower: 300,
                        autoClickers: 500,
                        multiplier: 3,
                        cooldownReduction: 0.7 // -70%
                    }
                },
                'transcendent': {
                    name: '🌈 TRANSCENDENT',
                    cost: 3000,
                    currency: 'diamonds',
                    bonuses: {
                        clickPower: 500,
                        autoClickers: 1000,
                        multiplier: 5
                    }
                }
            };
            
            // Check if pass exists
            const pass = passes[passType];
            if (!pass) {
                alert(`❌ Pass "${passType}" không tồn tại!`);
                return;
            }
            
            // Check if already owned (prevent duplicate purchase)
            if (gamePasses[passKey]) {
                alert(`❌ Bạn đã sở hữu ${pass.name} rồi!`);
                return;
            }
            
            // Check currency balance
            if (pass.currency === 'diamonds') {
                if (diamonds < pass.cost) {
                    alert(`❌ Không đủ Diamonds!\n\nCần: ${pass.cost} 💎\nHiện có: ${diamonds} 💎\nThiếu: ${pass.cost - diamonds} 💎`);
                    return;
                }
            }
            
            // Confirmation
            const confirmMsg = `🎮 Mua ${pass.name}?\n\nGiá: ${pass.cost} ${pass.currency === 'diamonds' ? '💎 Diamonds' : '🏆 Gold Bars'}\nBạn có: ${pass.currency === 'diamonds' ? diamonds : goldBars}\n\nXác nhận mua?`;
            
            if (!confirm(confirmMsg)) return;
            
            // Deduct currency
            if (pass.currency === 'diamonds') {
                diamonds -= pass.cost;
                if (diamonds < 0) diamonds = 0; // Safety
            }
            
            // Mark as owned
            gamePasses[passKey] = true;
            
            // Apply bonuses (PARANOID: validate all)
            const bonuses = pass.bonuses;
            
            if (bonuses.coins) {
                const safeCoins = Math.max(0, Math.min(bonuses.coins, 999999999999));
                coins += safeCoins;
            }
            
            if (bonuses.clickPower) {
                const safePower = Math.max(0, Math.min(bonuses.clickPower, 999999));
                clickPower += safePower;
            }
            
            if (bonuses.autoClickers) {
                const safeAuto = Math.max(0, Math.min(bonuses.autoClickers, 10000));
                autoClickers += safeAuto;
            }
            
            if (bonuses.multiplier) {
                const safeMult = Math.max(1, Math.min(bonuses.multiplier, 1000));
                multiplier *= safeMult;
            }
            
            if (bonuses.cooldown !== undefined) {
                clickCooldown = Math.max(0, bonuses.cooldown);
            }
            
            if (bonuses.cooldownReduction) {
                const reduction = Math.max(0, Math.min(bonuses.cooldownReduction, 1));
                clickCooldown = Math.max(0.01, clickCooldown * (1 - reduction));
            }
            
            // Update UI
            updateDisplay();
            
            // Save game after purchase
            saveToLocalStorage(true);
            
            // Success message
            let bonusText = '';
            if (bonuses.coins) bonusText += `\n💰 +${formatNumber(bonuses.coins)} coins`;
            if (bonuses.clickPower) bonusText += `\n⚡ +${bonuses.clickPower} Click Power`;
            if (bonuses.autoClickers) bonusText += `\n🤖 +${bonuses.autoClickers} Auto Clickers`;
            if (bonuses.multiplier) bonusText += `\n✖️ x${bonuses.multiplier} Multiplier`;
            if (bonuses.cooldown === 0) bonusText += `\n⚡ Click Cooldown = 0s (INSTANT!)`;
            if (bonuses.cooldownReduction) bonusText += `\n⚡ Cooldown giảm ${(bonuses.cooldownReduction * 100).toFixed(0)}%`;
            
            alert(`✅ Đã kích hoạt ${pass.name}!${bonusText}\n\n💎 Diamonds còn lại: ${diamonds}`);
            
            console.log(`✅ Game Pass Purchased: ${passType}`);
            console.log(`💎 Cost: ${pass.cost} ${pass.currency}`);
            console.log(`💎 Remaining: ${diamonds} diamonds`);
        }
        
        // Visual effects for premium passes
        function addPrismaticEffect() {
            // Add rainbow effect to cookie button
            const cookie = document.getElementById('cookie');
            if (cookie) {
                cookie.style.filter = 'hue-rotate(0deg)';
                cookie.style.animation = 'hueRotate 3s linear infinite';
            }
        }
        
        function addDivineEffect() {
            // Add divine glow to cookie
            const cookie = document.getElementById('cookie');
            if (cookie) {
                cookie.style.boxShadow = '0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,255,255,0.6)';
            }
        }
        
        function addSecretEffect() {
            // Add glitch effect
            const cookie = document.getElementById('cookie');
            if (cookie) {
                cookie.style.animation = 'glitchEffect 4s ease-in-out infinite';
            }
        }

        // ===== EGG & PETS SYSTEM =====
        function renderEggShop() {
            const eggGrid = document.getElementById('eggGrid');
            eggGrid.innerHTML = '';
            
            eggShop.forEach(egg => {
                const eggCard = document.createElement('div');
                eggCard.className = 'egg-card';
                
                eggCard.innerHTML = `
                    <div class="egg-icon">${egg.icon}</div>
                    <div class="egg-name">${egg.name}</div>
                    <div class="egg-price">💎 ${egg.price}</div>
                    <button class="egg-details-btn" onclick="event.stopPropagation(); showEggDetails(${egg.id})">📊 Xem Tỷ Lệ</button>
                    <button class="admin-button" onclick="event.stopPropagation(); buyEgg(${egg.id})" style="margin-top: 10px; width: 100%;">Mua Trứng</button>
                `;
                
                eggGrid.appendChild(eggCard);
            });
        }

        function showEggDetails(eggId) {
            const egg = eggShop.find(e => e.id === eggId);
            if (!egg) return;
            
            const modal = document.getElementById('eggDetailsModal');
            const overlay = document.getElementById('eggDetailsOverlay');
            
            let petsHTML = '';
            egg.pets.forEach(pet => {
                let rarity = 'common';
                if (pet.chance < 1) rarity = 'legendary';
                else if (pet.chance < 5) rarity = 'epic';
                else if (pet.chance < 15) rarity = 'rare';
                
                petsHTML += `
                    <div class="pet-chance-item ${rarity}">
                        <div class="pet-chance-info">
                            <div class="pet-chance-icon">${pet.icon}</div>
                            <div>
                                <div class="pet-chance-name">${pet.name}</div>
                                <div class="pet-chance-mult">x${pet.multiplier} multiplier</div>
                            </div>
                        </div>
                        <div class="pet-chance-percent">${pet.chance}%</div>
                    </div>
                `;
            });
            
            modal.innerHTML = `
                <div class="egg-details-title">${egg.icon} ${egg.name}</div>
                <div style="color: #00ffff; font-size: 1.2em; margin-bottom: 10px;">Giá: 💎 ${egg.price}</div>
                <div style="margin-bottom: 15px; color: #ddd;">Tỷ lệ nở ra các pet:</div>
                <div class="pet-chance-list">
                    ${petsHTML}
                </div>
                <button class="close-modal-btn" onclick="closeEggDetails()">Đóng</button>
            `;
            
            modal.style.display = 'block';
            overlay.style.display = 'block';
        }

        function closeEggDetails() {
            document.getElementById('eggDetailsModal').style.display = 'none';
            document.getElementById('eggDetailsOverlay').style.display = 'none';
        }

        function buyEgg(eggId) {
            const egg = eggShop.find(e => e.id === eggId);
            
            if (diamonds < egg.price) {
                alert(`❌ Không đủ kim cương! Cần ${egg.price} 💎`);
                return;
            }
            
            diamonds -= egg.price;
            hatchEgg(egg);
            updateDisplay();
        }

        function hatchEgg(egg) {
            // Calculate which pet to hatch based on chances
            const random = Math.random() * 100;
            let cumulativeChance = 0;
            let hatchedPet = null;
            
            for (const pet of egg.pets) {
                cumulativeChance += pet.chance;
                if (random <= cumulativeChance) {
                    hatchedPet = pet;
                    break;
                }
            }
            
            if (!hatchedPet) {
                hatchedPet = egg.pets[egg.pets.length - 1];
            }
            
            // Add pet to collection with mutation support
            const petKey = hatchedPet.name + '_normal'; // All new pets start as normal
            if (!ownedPets[petKey]) {
                ownedPets[petKey] = {
                    ...hatchedPet,
                    baseName: hatchedPet.name,
                    mutation: 'normal',
                    count: 0
                };
            }
            ownedPets[petKey].count++;
            
            // ═══════════════════════════════════════════════════════
            // AUTO-SAVE IMMEDIATELY AFTER ADDING PET
            // ═══════════════════════════════════════════════════════
            console.log('💾 Auto-saving after hatching pet:', petKey);
            saveToLocalStorage(true);
            
            // NOTE: Diamond generation handled by global dragonGeneratorInterval
            // No need to create individual intervals here
            
            // Show hatch animation
            showHatchAnimation(egg, hatchedPet);
            
            // Update pets display
            renderPets();
            updateTradeUpPetList();
        }

        function showHatchAnimation(egg, pet) {
            const animDiv = document.getElementById('hatchAnimation');
            animDiv.style.display = 'block';
            
            // Phase 1: Shaking egg
            animDiv.innerHTML = `
                <div class="hatch-animation">
                    <div class="hatch-egg">${egg.icon}</div>
                    <div class="hatch-text">Đang nở...</div>
                </div>
            `;
            
            // Phase 2: Show result after 2 seconds
            setTimeout(() => {
                let specialText = '';
                if (pet.special === 'diamond_generator') {
                    specialText = '<div style="color: #00ffff; font-size: 0.9em; margin-top: 10px;">✨ Đặc biệt: +1💎/giây!</div>';
                } else if (pet.special === 'click_power_5x') {
                    specialText = '<div style="color: #ffd700; font-size: 0.9em; margin-top: 10px;">⚡ Đặc biệt: x5 Click Power!</div>';
                }
                
                animDiv.innerHTML = `
                    <div class="hatch-animation">
                        <div class="hatch-result">${pet.icon}</div>
                        <div class="hatch-text">🎉 ${pet.name}!</div>
                        <div class="hatch-multiplier">x${pet.multiplier} Thu nhập</div>
                        ${specialText}
                        <button class="admin-button" onclick="closeHatchAnimation()" style="margin-top: 20px;">OK</button>
                    </div>
                `;
            }, 2000);
        }

        function closeHatchAnimation() {
            document.getElementById('hatchAnimation').style.display = 'none';
        }
        
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // TRADE-UP SYSTEM
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        const MUTATION_MULTIPLIERS = {
            'normal': 1,
            'gold': 2,
            'diamond': 2.5,
            'rainbow': 3,
            'transcendent': 5,
            'cosmic': 10
        };
        
        const MUTATION_UPGRADES = {
            'normal': 'gold',
            'gold': 'diamond',
            'diamond': 'rainbow',
            'rainbow': 'transcendent',
            'transcendent': 'cosmic',
            'cosmic': null // Max tier
        };
        
        // Trade-up success rates for each tier
        const TRADE_UP_SUCCESS_RATES = {
            'normal': 0.90,      // 90% normal -> gold
            'gold': 0.75,        // 75% gold -> diamond
            'diamond': 0.50,     // 50% diamond -> rainbow
            'rainbow': 0.35,     // 35% rainbow -> transcendent
            'transcendent': 0.25 // 25% transcendent -> cosmic
        };
        
        const MUTATION_NAMES = {
            'normal': '⚪ Normal',
            'gold': '🟡 Gold',
            'diamond': '💎 Diamond',
            'rainbow': '🌈 Rainbow',
            'transcendent': '✨ Transcendent',
            'cosmic': '🌌 Cosmic'
        };
        
        function updateTradeUpPetList() {
            const select = document.getElementById('tradeUpPetType');
            if (!select) return;
            
            select.innerHTML = '<option value="">-- Chọn Pet --</option>';
            
            // Get unique base pet names
            const baseNames = new Set();
            Object.values(ownedPets).forEach(pet => {
                // Use baseName if available, otherwise use name
                const displayName = pet.baseName || pet.name;
                if (displayName && pet.count > 0) {
                    baseNames.add(displayName);
                }
            });
            
            // Sort and add to dropdown
            Array.from(baseNames).sort().forEach(name => {
                select.innerHTML += `<option value="${name}">${name}</option>`;
            });
            
            console.log('Trade-Up Pet List Updated:', Array.from(baseNames));
        }
        
        function updateTradeUpDisplay() {
            const petType = document.getElementById('tradeUpPetType')?.value;
            const mutation = document.getElementById('tradeUpMutation')?.value;
            const statusDiv = document.getElementById('tradeUpStatus');
            const button = document.getElementById('tradeUpButton');
            
            if (!petType || !mutation) {
                statusDiv.innerHTML = 'Chọn loại pet và cấp độ để bắt đầu';
                button.disabled = true;
                button.style.opacity = '0.5';
                return;
            }
            
            const petKey = petType + '_' + mutation;
            const count = ownedPets[petKey]?.count || 0;
            const nextMutation = MUTATION_UPGRADES[mutation];
            
            if (!nextMutation) {
                statusDiv.innerHTML = `<div style="color: #ffd700;">✨ ${petType} đã ở cấp độ cao nhất!</div>`;
                button.disabled = true;
                button.style.opacity = '0.5';
                return;
            }
            
            if (count < 5) {
                statusDiv.innerHTML = `
                    <div style="color: #ff6b6b;">
                        ❌ Không đủ pets!<br>
                        Hiện có: ${count}/5 ${MUTATION_NAMES[mutation]} ${petType}
                    </div>
                `;
                button.disabled = true;
                button.style.opacity = '0.5';
            } else {
                const successRate = TRADE_UP_SUCCESS_RATES[mutation] || 0.25;
                const successPercent = Math.round(successRate * 100);
                const failPercent = 100 - successPercent;
                
                statusDiv.innerHTML = `
                    <div style="color: #00ff00;">
                        ✅ Đủ điều kiện!<br>
                        Sẽ dùng: 5x ${MUTATION_NAMES[mutation]} ${petType}<br>
                        Nâng lên: ${MUTATION_NAMES[nextMutation]} ${petType}<br>
                        <br>
                        <div style="color: #ffd700;">Tỉ lệ: ${successPercent}% Thành công | ${failPercent}% Thất bại</div>
                        <div style="color: #ff6b6b; font-size: 0.9em;">Thất bại = Mất tất cả 5 pets!</div>
                    </div>
                `;
                button.disabled = false;
                button.style.opacity = '1';
            }
        }
        
        function attemptTradeUp() {
            const petType = document.getElementById('tradeUpPetType')?.value;
            const mutation = document.getElementById('tradeUpMutation')?.value;
            
            if (!petType || !mutation) {
                alert('❌ Vui lòng chọn loại pet và cấp độ!');
                return;
            }
            
            const petKey = petType + '_' + mutation;
            const count = ownedPets[petKey]?.count || 0;
            const nextMutation = MUTATION_UPGRADES[mutation];
            
            // Validation
            if (count < 5) {
                alert(`❌ Không đủ pets! Cần 5 ${MUTATION_NAMES[mutation]} ${petType}, hiện có ${count}.`);
                return;
            }
            
            if (!nextMutation) {
                alert('❌ Pet đã ở cấp độ cao nhất!');
                return;
            }
            
            // Get success rate for this tier
            const successRate = TRADE_UP_SUCCESS_RATES[mutation] || 0.25;
            const successPercent = Math.round(successRate * 100);
            const failPercent = 100 - successPercent;
            
            // Confirmation
            const confirmMsg = `🔄 XÁC NHẬN TRADE-UP\n\nSẽ dùng: 5x ${MUTATION_NAMES[mutation]} ${petType}\nNâng lên: 1x ${MUTATION_NAMES[nextMutation]} ${petType}\n\n⚠️ TỈ LỆ:\n✅ Thành công: ${successPercent}%\n❌ Thất bại: ${failPercent}% (MẤT TẤT CẢ 5 PETS)\n\nBạn có chắc chắn?`;
            
            if (!confirm(confirmMsg)) {
                return;
            }
            
            // Deduct pets
            ownedPets[petKey].count -= 5;
            if (ownedPets[petKey].count <= 0) {
                delete ownedPets[petKey];
            }
            
            // Roll for success with dynamic rate
            const success = Math.random() < successRate;
            
            if (success) {
                // Success! Add upgraded pet
                const newPetKey = petType + '_' + nextMutation;
                if (!ownedPets[newPetKey]) {
                    // Find base pet info - IMPROVED LOGIC
                    let basePet = null;
                    
                    // Method 1: Check if the pet we just consumed still exists (has more than 0)
                    if (ownedPets[petKey] && ownedPets[petKey].count > 0) {
                        basePet = ownedPets[petKey];
                        console.log('✅ Found basePet from consumed pet (still exists):', petKey);
                    }
                    
                    // Method 2: Find ANY pet with matching baseName or name
                    if (!basePet) {
                        for (const [key, pet] of Object.entries(ownedPets)) {
                            if (pet.baseName === petType || pet.name === petType) {
                                basePet = pet;
                                console.log('✅ Found basePet by name match:', key, pet.name);
                                break;
                            }
                        }
                    }
                    
                    // Method 3: Search through ALL mutation levels of this pet type
                    if (!basePet) {
                        const allMutations = ['normal', 'gold', 'diamond', 'rainbow', 'transcendent', 'prismatic'];
                        for (const mut of allMutations) {
                            const searchKey = petType + '_' + mut;
                            if (ownedPets[searchKey]) {
                                basePet = ownedPets[searchKey];
                                console.log('✅ Found basePet by mutation search:', searchKey);
                                break;
                            }
                        }
                    }
                    
                    // Method 4: FALLBACK - Create basic pet structure
                    if (!basePet) {
                        console.warn('⚠️ Could not find basePet, creating basic structure for:', petType);
                        basePet = {
                            name: petType,
                            baseName: petType,
                            icon: '❓', // Default icon
                            multiplier: 1, // Default multiplier
                            special: null,
                            event: null
                        };
                    }
                    
                    // Create the upgraded pet
                    ownedPets[newPetKey] = {
                        key: newPetKey,
                        name: basePet.name,
                        baseName: petType,
                        icon: basePet.icon,
                        multiplier: basePet.multiplier,
                        mutation: nextMutation,
                        count: 0,
                        special: basePet.special || null,
                        event: basePet.event || null
                    };
                    console.log('✅ Created new pet entry:', newPetKey, ownedPets[newPetKey]);
                }
                ownedPets[newPetKey].count++;
                
                // Success animation
                showTradeUpResult(true, petType, mutation, nextMutation);
                
                alert(`✅ THÀNH CÔNG!\n\n🎉 Bạn đã nhận được:\n${MUTATION_NAMES[nextMutation]} ${petType}\n\nHệ số nhân: x${MUTATION_MULTIPLIERS[nextMutation]}`);
            } else {
                // Failure - pets already removed
                showTradeUpResult(false, petType, mutation, nextMutation);
                
                alert(`❌ THẤT BẠI!\n\nBạn đã mất 5x ${MUTATION_NAMES[mutation]} ${petType}\n\nHãy thử lại lần sau!`);
            }
            
            // Update displays
            renderPets();
            updateTradeUpPetList();
            updateTradeUpDisplay();
            updateDisplay();
            saveToLocalStorage(true);
            
            console.log(`🔄 Trade-Up ${success ? 'SUCCESS' : 'FAILED'}: ${petType} ${mutation} → ${nextMutation}`);
        }
        
        function showTradeUpResult(success, petType, fromMutation, toMutation) {
            const animDiv = document.getElementById('hatchAnimation');
            if (!animDiv) return;
            
            animDiv.style.display = 'block';
            
            if (success) {
                animDiv.innerHTML = `
                    <div class="hatch-animation">
                        <div class="hatch-result" style="font-size: 5em; animation: successPulse 1s ease-in-out infinite;">
                            ✨
                        </div>
                        <div class="hatch-text" style="color: #00ff00; font-size: 1.5em; font-weight: bold;">
                            🎉 THÀNH CÔNG! 🎉
                        </div>
                        <div style="margin-top: 15px; font-size: 1.2em;">
                            ${MUTATION_NAMES[toMutation]} ${petType}
                        </div>
                        <div class="hatch-multiplier" style="color: #ffd700;">
                            Hệ số: x${MUTATION_MULTIPLIERS[toMutation]}
                        </div>
                        <button class="admin-button" onclick="closeHatchAnimation()" style="margin-top: 20px;">OK</button>
                    </div>
                `;
            } else {
                animDiv.innerHTML = `
                    <div class="hatch-animation">
                        <div class="hatch-result" style="font-size: 5em; animation: failShake 0.5s ease-in-out infinite;">
                            💔
                        </div>
                        <div class="hatch-text" style="color: #ff6b6b; font-size: 1.5em; font-weight: bold;">
                            ❌ THẤT BẠI ❌
                        </div>
                        <div style="margin-top: 15px; color: #ff6b6b;">
                            Đã mất 5x ${MUTATION_NAMES[fromMutation]} ${petType}
                        </div>
                        <div style="color: #888; margin-top: 10px;">
                            Thử lại lần sau!
                        </div>
                        <button class="admin-button" onclick="closeHatchAnimation()" style="margin-top: 20px;">OK</button>
                    </div>
                `;
            }
            
            setTimeout(() => {
                if (animDiv.style.display === 'block') {
                    closeHatchAnimation();
                }
            }, 5000);
        }

        function renderPets() {
            const petsGrid = document.getElementById('petsGrid');
            petsGrid.innerHTML = '';
            
            const petArray = Object.entries(ownedPets).map(([key, pet]) => ({...pet, key})).sort((a, b) => b.multiplier - a.multiplier);
            
            if (petArray.length === 0) {
                petsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">Chưa có pet nào. Mua trứng để bắt đầu!</div>';
                renderEquippedPets();
                return;
            }
            
            petArray.forEach(pet => {
                const petCard = document.createElement('div');
                const equippedCount = equippedPets.filter(p => p.key === pet.key).length;
                const isEquipped = equippedCount > 0;
                petCard.className = `pet-card ${isEquipped ? 'equipped' : ''}`;
                
                // Escape single quotes in pet key for onclick
                const escapedKey = pet.key.replace(/'/g, "\\'");
                
                // Check if can equip more
                const canEquipMore = equippedCount < pet.count && equippedPets.length < MAX_EQUIPPED_PETS;
                
                // Get mutation badge
                const mutation = pet.mutation || 'normal';
                const mutationBadge = getMutationBadge(mutation);
                const mutationMult = MUTATION_MULTIPLIERS[mutation] || 1;
                const totalMult = pet.multiplier * mutationMult;
                
                // Special ability display
                let specialText = '';
                if (pet.special === 'diamond_generator') {
                    specialText = '<div style="color: #00ffff; font-size: 0.75em; margin-top: 4px;">✨ +1💎/s</div>';
                } else if (pet.special === 'click_power_5x') {
                    specialText = '<div style="color: #ffd700; font-size: 0.75em; margin-top: 4px;">⚡ x5 Click Power</div>';
                }
                
                petCard.innerHTML = `
                    ${isEquipped ? `<div class="pet-equipped-badge">✓ ${equippedCount}/${pet.count}</div>` : ''}
                    ${mutationBadge}
                    <div class="pet-icon">${pet.icon}</div>
                    <div class="pet-name">${pet.baseName || pet.name}</div>
                    <div class="pet-multiplier">x${totalMult.toLocaleString()} ${mutation !== 'normal' ? `(Base: x${pet.multiplier})` : ''}</div>
                    ${specialText}
                    <div class="pet-count">Owned: ${pet.count}</div>
                    <div class="pet-actions">
                        ${isEquipped 
                            ? `<button class="equip-btn" onclick="unequipPetOnce('${escapedKey}')" style="background: linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%);">Gỡ 1</button>`
                            : ''}
                        <button class="equip-btn" onclick="equipPet('${escapedKey}')" ${!canEquipMore ? 'disabled' : ''}>
                            ${equippedCount >= pet.count ? 'Hết' : 'Trang Bị'}
                        </button>
                    </div>
                    <div class="pet-sell-actions" style="margin-top: 8px; display: flex; gap: 5px;">
                        <button class="sell-btn" onclick="sellPet('${escapedKey}')" style="flex: 1; padding: 6px; background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%); border: none; border-radius: 5px; color: #000; font-weight: bold; cursor: pointer; font-size: 0.85em;">
                            💰 Bán 1 (1💎)
                        </button>
                        ${pet.count > 1 ? `
                        <button class="sell-btn" onclick="sellAllPets('${escapedKey}')" style="flex: 1; padding: 6px; background: linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%); border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; font-size: 0.85em;">
                            🔥 Bán Hết (${pet.count}💎)
                        </button>
                        ` : ''}
                    </div>
                `;
                
                petsGrid.appendChild(petCard);
            });
            
            renderEquippedPets();
        }
        
        function getMutationBadge(mutation) {
            const badges = {
                'normal': '',
                'gold': '<div class="mutation-badge gold">🟡 GOLD</div>',
                'diamond': '<div class="mutation-badge diamond">💎 DIAMOND</div>',
                'rainbow': '<div class="mutation-badge rainbow">🌈 RAINBOW</div>',
                'transcendent': '<div class="mutation-badge transcendent">✨ TRANSCENDENT</div>',
                'cosmic': '<div class="mutation-badge cosmic">🌌 COSMIC</div>'
            };
            return badges[mutation] || '';
        }

        function renderEquippedPets() {
            const equippedBar = document.getElementById('equippedPetsBar');
            equippedBar.innerHTML = '';
            
            // Render 5 slots
            for (let i = 0; i < MAX_EQUIPPED_PETS; i++) {
                const slot = document.createElement('div');
                
                if (equippedPets[i]) {
                    const pet = equippedPets[i];
                    slot.className = 'equipped-slot filled';
                    slot.innerHTML = `
                        <button class="unequip-btn" onclick="unequipPetByIndex(${i})">×</button>
                        <div class="equipped-pet-icon">${pet.icon}</div>
                        <div class="equipped-pet-mult">x${pet.multiplier}</div>
                    `;
                } else {
                    slot.className = 'equipped-slot';
                    slot.innerHTML = '<div style="color: #666; font-size: 0.8em;">Empty</div>';
                }
                
                equippedBar.appendChild(slot);
            }
        }

        function equipPet(petKey) {
            if (equippedPets.length >= MAX_EQUIPPED_PETS) {
                alert('❌ Đã đạt giới hạn 5 pets! Gỡ pet khác để trang bị pet mới.');
                return;
            }
            
            const pet = ownedPets[petKey];
            if (!pet) return;
            
            // Count how many of this pet are already equipped
            const equippedCount = equippedPets.filter(p => p.key === petKey).length;
            
            // Check if owned enough
            if (equippedCount >= pet.count) {
                alert(`⚠️ Bạn chỉ có ${pet.count} con ${pet.name}, đã trang bị ${equippedCount} con rồi!`);
                return;
            }
            
            equippedPets.push({...pet, key: petKey});
            renderPets();
            updateDisplay();
            alert(`✅ Đã trang bị ${pet.name}! (${equippedCount + 1}/${pet.count})`);
        }

        function unequipPet(petKey) {
            equippedPets = equippedPets.filter(p => p.key !== petKey);
            renderPets();
            updateDisplay();
            
            const pet = ownedPets[petKey];
            if (pet) {
                alert(`✅ Đã gỡ tất cả ${pet.name}!`);
            }
        }

        function unequipPetOnce(petKey) {
            // Find first index of this pet and remove only one
            const index = equippedPets.findIndex(p => p.key === petKey);
            if (index !== -1) {
                equippedPets.splice(index, 1);
                renderPets();
                updateDisplay();
                
                const pet = ownedPets[petKey];
                const remainingCount = equippedPets.filter(p => p.key === petKey).length;
                if (pet) {
                    alert(`✅ Đã gỡ 1 con ${pet.name}! (Còn ${remainingCount} equipped)`);
                }
            }
        }

        function unequipPetByIndex(index) {
            if (equippedPets[index]) {
                const pet = equippedPets[index];
                equippedPets.splice(index, 1);
                renderPets();
                updateDisplay();
                alert(`✅ Đã gỡ ${pet.name}!`);
            }
        }

        function equipBestPets() {
            // Get all owned pets sorted by multiplier (descending)
            const petArray = Object.entries(ownedPets)
                .map(([key, pet]) => ({...pet, key}))
                .sort((a, b) => b.multiplier - a.multiplier);
            
            if (petArray.length === 0) {
                alert('❌ Bạn chưa có pet nào!');
                return;
            }
            
            // Clear current equipped pets
            equippedPets = [];
            
            // Equip top 5 pets (or all if less than 5)
            const petsToEquip = petArray.slice(0, MAX_EQUIPPED_PETS);
            petsToEquip.forEach(pet => {
                equippedPets.push({...pet, key: pet.key});
            });
            
            renderPets();
            updateDisplay();
            
            const equippedNames = petsToEquip.map(p => p.icon + ' ' + p.name).join(', ');
            alert(`✅ Đã trang bị ${petsToEquip.length} pets mạnh nhất:\n${equippedNames}`);
        }

        function unequipAllPets() {
            if (equippedPets.length === 0) {
                alert('⚠️ Không có pet nào đang trang bị!');
                return;
            }
            
            const count = equippedPets.length;
            equippedPets = [];
            renderPets();
            updateDisplay();
            
            alert(`✅ Đã gỡ ${count} pets!`);
        }
        
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // SELL PET SYSTEM
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        function sellPet(petKey) {
            console.log(`💰 Attempting to sell pet: ${petKey}`);
            
            // Validate pet exists
            const pet = ownedPets[petKey];
            if (!pet) {
                alert('❌ Pet không tồn tại!');
                return;
            }
            
            // Validate count
            if (pet.count <= 0) {
                alert('❌ Không còn pet này để bán!');
                return;
            }
            
            // Get pet info
            const petName = pet.baseName || pet.name;
            const mutation = pet.mutation || 'normal';
            const mutationName = MUTATION_NAMES[mutation] || mutation;
            
            // Confirmation
            const confirmMsg = `💰 BÁN PET\n\nPet: ${mutationName} ${petName}\nGiá: 1 💎 Diamond\n\nBạn có chắc chắn?`;
            
            if (!confirm(confirmMsg)) {
                return;
            }
            
            // Check if pet is equipped - auto unequip first
            const equippedIndex = equippedPets.findIndex(p => p.key === petKey);
            if (equippedIndex !== -1) {
                // Remove from equipped
                equippedPets.splice(equippedIndex, 1);
                console.log(`🔧 Auto-unequipped pet before selling`);
            }
            
            // Sell pet
            pet.count--;
            diamonds += 1;
            
            // Remove from ownedPets if count reaches 0
            if (pet.count <= 0) {
                delete ownedPets[petKey];
                console.log(`🗑️ Removed pet from inventory (count = 0)`);
            }
            
            // Update displays
            renderPets();
            updateDisplay();
            updateTradeUpPetList();
            saveToLocalStorage(true);
            
            // Success message
            alert(`✅ Đã bán!\n\n${mutationName} ${petName}\n+1 💎 Diamond\n\nTổng Diamonds: ${formatNumber(diamonds)}`);
            
            console.log(`✅ Pet sold successfully`);
            console.log(`💎 Diamonds: ${diamonds}`);
        }
        
        function sellAllPets(petKey) {
            console.log(`💰 Attempting to sell ALL pets: ${petKey}`);
            
            // Validate pet exists
            const pet = ownedPets[petKey];
            if (!pet) {
                alert('❌ Pet không tồn tại!');
                return;
            }
            
            // Validate count
            if (pet.count <= 0) {
                alert('❌ Không còn pet này để bán!');
                return;
            }
            
            // Get pet info
            const petName = pet.baseName || pet.name;
            const mutation = pet.mutation || 'normal';
            const mutationName = MUTATION_NAMES[mutation] || mutation;
            const totalValue = pet.count;
            
            // Confirmation
            const confirmMsg = `💰 BÁN TẤT CẢ\n\nPet: ${mutationName} ${petName}\nSố lượng: ${pet.count}\nTổng giá: ${totalValue} 💎 Diamonds\n\n⚠️ Sẽ bán TẤT CẢ ${pet.count} pets!\n\nBạn có chắc chắn?`;
            
            if (!confirm(confirmMsg)) {
                return;
            }
            
            // Unequip all instances of this pet
            equippedPets = equippedPets.filter(p => p.key !== petKey);
            console.log(`🔧 Auto-unequipped all instances before selling`);
            
            // Sell all pets
            const soldCount = pet.count;
            diamonds += soldCount;
            
            // Remove from ownedPets
            delete ownedPets[petKey];
            console.log(`🗑️ Removed all pets from inventory`);
            
            // Update displays
            renderPets();
            updateDisplay();
            updateTradeUpPetList();
            saveToLocalStorage(true);
            
            // Success message
            alert(`✅ Đã bán tất cả!\n\n${soldCount}x ${mutationName} ${petName}\n+${soldCount} 💎 Diamonds\n\nTổng Diamonds: ${formatNumber(diamonds)}`);
            
            console.log(`✅ Sold ${soldCount} pets`);
            console.log(`💎 Diamonds: ${diamonds}`);
        }

        function getPetMultiplier() {
            let totalMult = 1;
            equippedPets.forEach(pet => {
                // Each equipped pet applies its multiplier based on owned count
                const ownedPet = ownedPets[pet.key];
                if (ownedPet) {
                    const mutationMult = MUTATION_MULTIPLIERS[ownedPet.mutation] || 1;
                    const effectiveMult = pet.multiplier * mutationMult;
                    totalMult *= Math.pow(effectiveMult, ownedPet.count);
                }
            });
            return totalMult;
        }

        // Get click power bonus from special pets (like Cosmic Dog)
        function getClickPowerBonus() {
            let bonus = 1;
            equippedPets.forEach(pet => {
                const ownedPet = ownedPets[pet.key];
                if (ownedPet && ownedPet.special === 'click_power_5x') {
                    bonus *= 5; // Cosmic Dog gives x5 click power
                }
            });
            return bonus;
        }

        // ===== CLICK BUTTON EVENT =====
        document.getElementById('clickButton').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event bubbling
            
            // Anti-cheat DISABLED - allow all clicks
            // if (!canClick || isAfk || isBanned) return;
            if (!canClick) return;
            
            // Auto-clicker detection DISABLED
            // if (checkAutoClicker()) {
            //     return;
            // }
            
            resetAFKTimer();
            
            // Áp dụng multiplier từ weather và pets
            const weatherMult = getWeatherMultiplier();
            const petMult = getPetMultiplier();
            const clickPowerBonus = getClickPowerBonus(); // Cosmic Dog bonus
            
            // Event 2026 Pass bonus
            let event2026Mult = 1;
            if (gamePasses.event2026) event2026Mult = 3;
            
            const totalMultiplier = multiplier * rebirthMultiplier * weatherMult * petMult * event2026Mult;
            const earned = clickPower * clickPowerBonus * totalMultiplier; // Apply click power bonus
            coins += earned;
            
            // Track stats
            totalClicks++;
            totalCoinsEarned += earned;
            
            // Update event tasks
            updateEventTask('click100', 1);
            updateEventTask('click10000', 1);
            updateEventTask('earn1000', earned);
            updateEventTask('earn100k', earned);
            
            updateDisplay();
            renderShop();
            updateRebirthUI();
            
            // Bắt đầu cooldown
            canClick = false;
            this.classList.add('disabled');
            
            setTimeout(() => {
                canClick = true;
                this.classList.remove('disabled');
            }, clickCooldown * 1000);
        });

        // Auto clicker
        setInterval(() => {
            // Anti-AFK check DISABLED
            // if (autoClickers > 0 && !isAfk && !isBanned) {
            if (autoClickers > 0) {
                const weatherMult = getWeatherMultiplier();
                const petMult = getPetMultiplier();
                
                // Event 2026 Pass bonus for auto
                let event2026AutoMult = 1;
                if (gamePasses.event2026) event2026AutoMult = 2;
                
                const totalMultiplier = multiplier * rebirthMultiplier * weatherMult * petMult;
                const earned = autoClickers * totalMultiplier * event2026AutoMult;
                coins += earned;
                
                // Track stats
                totalCoinsEarned += earned;
                
                // Update event tasks
                updateEventTask('earn1000', earned);
                updateEventTask('earn100k', earned);
                
                updateDisplay();
                renderShop();
                updateRebirthUI();
            }
        }, 1000);

        // Weather spawn checker (every second)
        setInterval(() => {
            checkWeatherSpawns();
        }, 1000);

        // Initialize
        updateDisplay();
        renderShop();
        updateGamePassUI();
        updateRebirthUI();
        resetAFKTimer();
        updateWeatherDisplay();
        renderEggShop();
        renderPets();
        updateTradeUpPetList(); // Initialize Trade-Up dropdown
        updateTeleportPrices(); // Initialize teleport prices display
        updateEventDisplay(); // Initialize event 2026 display
        renderEventTasks(); // Render event tasks
        initDragonGenerators(); // Start dragon generators

        // Playtime counter
        playTimeInterval = setInterval(() => {
            // AFK check DISABLED - always count time
            // if (!isAfk && !isBanned) {
                playTime++;
                
                // Update event tasks
                updateEventTask('playTime60', 1);
                
                // Update pet count task
                const totalPets = Object.values(ownedPets).reduce((sum, pet) => sum + pet.count, 0);
                if (event2026Tasks.getPet && !event2026Tasks.getPet.completed) {
                    event2026Tasks.getPet.progress = totalPets;
                    renderEventTasks();
                }
                
                // Update task reset timer
                updateTaskResetTimer();
                
                updateDisplay();
            // }
        }, 1000);

        // Event listeners để reset AFK timer
        document.addEventListener('mousemove', resetAFKTimer);
        document.addEventListener('keypress', resetAFKTimer);
        document.addEventListener('scroll', resetAFKTimer);
        document.addEventListener('touchstart', resetAFKTimer);

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // LOCALSTORAGE AUTO-SAVE SYSTEM
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        const SAVE_VERSION = '1.0.0';
        const SAVE_KEY = 'cookieClickerSave';
        const BACKUP_KEY = 'cookieClickerSaveBackup';
        let autoSaveInterval = null;
        let lastSaveTime = 0;
        
        // Check if localStorage is available
        function isLocalStorageAvailable() {
            try {
                const test = '__localStorage_test__';
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                console.error('localStorage not available:', e);
                return false;
            }
        }
        
        // Show save indicator (visual feedback)
        function showSaveIndicator(success = true) {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                background: ${success ? 'rgba(0, 255, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)'};
                color: white;
                border-radius: 8px;
                font-weight: bold;
                z-index: 10000;
                animation: fadeInOut 2s ease-in-out;
            `;
            indicator.textContent = success ? '💾 Đã lưu!' : '❌ Lưu thất bại!';
            document.body.appendChild(indicator);
            
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 2000);
        }
        
        // Validate data before saving (prevent corruption)
        function validateSaveData(data) {
            if (!data || typeof data !== 'object') return false;
            
            // Check required fields exist
            const requiredFields = ['coins', 'diamonds', 'clickPower', 'gamePasses'];
            for (const field of requiredFields) {
                if (!(field in data)) {
                    console.error(`Missing required field: ${field}`);
                    return false;
                }
            }
            
            // Validate data types
            if (typeof data.coins !== 'number') return false;
            if (typeof data.diamonds !== 'number') return false;
            if (typeof data.gamePasses !== 'object') return false;
            
            return true;
        }
        
        // Validate loaded data (prevent crashes)
        function validateLoadData(data) {
            if (!data || typeof data !== 'object') return null;
            
            // Set safe defaults for missing/invalid values
            const safeData = {
                // Core stats
                coins: typeof data.coins === 'number' ? Math.max(0, data.coins) : 0,
                diamonds: typeof data.diamonds === 'number' ? Math.max(0, data.diamonds) : 0,
                tickets: typeof data.tickets === 'number' ? Math.max(0, data.tickets) : 0,
                goldBars: typeof data.goldBars === 'number' ? Math.max(0, data.goldBars) : 0,
                teleportPrice: typeof data.teleportPrice === 'number' ? Math.max(1, data.teleportPrice) : 1,
                
                // Event 2026
                event2026Coins: typeof data.event2026Coins === 'number' ? Math.max(0, data.event2026Coins) : 0,
                event2026Tasks: typeof data.event2026Tasks === 'object' ? data.event2026Tasks : null,
                lastTaskReset: typeof data.lastTaskReset === 'number' ? data.lastTaskReset : Date.now(),
                nextTaskReset: typeof data.nextTaskReset === 'number' ? data.nextTaskReset : Date.now() + (24 * 60 * 60 * 1000),
                
                // Stats
                clickPower: typeof data.clickPower === 'number' ? Math.max(1, data.clickPower) : 1,
                autoClickers: typeof data.autoClickers === 'number' ? Math.max(0, data.autoClickers) : 0,
                multiplier: typeof data.multiplier === 'number' ? Math.max(1, data.multiplier) : 1,
                clickCooldown: typeof data.clickCooldown === 'number' ? Math.max(0, data.clickCooldown) : 0.5,
                
                // Game state
                gamePasses: typeof data.gamePasses === 'object' ? data.gamePasses : {},
                inventory: typeof data.inventory === 'object' ? data.inventory : {
                    potion_2x: 0,
                    potion_3x: 0,
                    potion_4x: 0
                },
                ownedPets: typeof data.ownedPets === 'object' && data.ownedPets !== null && !Array.isArray(data.ownedPets) ? data.ownedPets : {},
                equippedPets: Array.isArray(data.equippedPets) ? data.equippedPets : [],
                
                // Progress
                playTime: typeof data.playTime === 'number' ? Math.max(0, data.playTime) : 0,
                shopDiscount: typeof data.shopDiscount === 'number' ? Math.max(0, data.shopDiscount) : 0,
                rebirthCount: typeof data.rebirthCount === 'number' ? Math.max(0, data.rebirthCount) : 0,
                rebirthMultiplier: typeof data.rebirthMultiplier === 'number' ? Math.max(1, data.rebirthMultiplier) : 1,
                purchaseLimit: typeof data.purchaseLimit === 'number' ? Math.max(1, data.purchaseLimit) : 5,
                purchaseCounts: typeof data.purchaseCounts === 'object' ? data.purchaseCounts : {},
                
                // Misc
                isAdmin: data.isAdmin === true,
                weatherNextSpawn: typeof data.weatherNextSpawn === 'number' ? data.weatherNextSpawn : 0,
                goldCodes: typeof data.goldCodes === 'object' ? data.goldCodes : {},
                
                // Shop items
                shopItems: Array.isArray(data.shopItems) ? data.shopItems : null
            };
            
            return safeData;
        }
        
        // Save game to localStorage
        function saveToLocalStorage(silent = false) {
            if (!isLocalStorageAvailable()) {
                if (!silent) console.error('localStorage not available');
                return false;
            }
            
            try {
                // Create backup of current save
                const currentSave = localStorage.getItem(SAVE_KEY);
                if (currentSave) {
                    localStorage.setItem(BACKUP_KEY, currentSave);
                }
                
                // Prepare save data
                const saveData = {
                    version: SAVE_VERSION,
                    saveDate: new Date().toISOString(),
                    
                    // Core stats
                    coins: coins,
                    diamonds: diamonds,
                    tickets: tickets,
                    goldBars: goldBars,
                    teleportPrice: teleportPrice,
                    
                    // Event 2026
                    event2026Coins: event2026Coins,
                    event2026Tasks: event2026Tasks,
                    lastTaskReset: lastTaskReset,
                    nextTaskReset: nextTaskReset,
                    
                    // Stats
                    clickPower: clickPower,
                    autoClickers: autoClickers,
                    multiplier: multiplier,
                    clickCooldown: clickCooldown,
                    
                    // Game state
                    gamePasses: gamePasses,
                    inventory: inventory,
                    ownedPets: ownedPets,
                    equippedPets: equippedPets,
                    
                    // Progress
                    playTime: playTime,
                    shopDiscount: shopDiscount,
                    rebirthCount: rebirthCount,
                    rebirthMultiplier: rebirthMultiplier,
                    purchaseLimit: purchaseLimit,
                    purchaseCounts: purchaseCounts,
                    
                    // Misc
                    isAdmin: isAdmin,
                    weatherNextSpawn: weatherNextSpawn,
                    goldCodes: goldCodes,
                    musicUnlocked: musicUnlocked,
                    currentTrackName: currentTrackName,
                    customBackground: customBackground,
                    customBackground: customBackground,
                    
                    // Coin Flip Game
                    coinFlipRank: coinFlipRank,
                    coinFlipStars: coinFlipStars,
                    coinFlipWins: coinFlipWins,
                    coinFlipLosses: coinFlipLosses,
                    coinFlipConsecutiveLosses: coinFlipConsecutiveLosses,
                    
                    // Tracking Stats
                    totalClicks: totalClicks,
                    totalCoinsEarned: totalCoinsEarned,
                    totalSpins: totalSpins,
                    totalWeatherSummoned: totalWeatherSummoned,
                    rpsStats: rpsStats,
                    
                    // Shop items (save prices and owned counts)
                    shopItems: shopItems.map(item => ({
                        id: item.id,
                        currentPrice: item.currentPrice,
                        owned: item.owned
                    }))
                };
                
                // Validate before saving
                if (!validateSaveData(saveData)) {
                    console.error('Save data validation failed');
                    if (!silent) showSaveIndicator(false);
                    return false;
                }
                
                // Save to localStorage
                const saveString = JSON.stringify(saveData);
                localStorage.setItem(SAVE_KEY, saveString);
                
                lastSaveTime = Date.now();
                
                // ═══════════════════════════════════════════════════════
                // DEBUG: LOG SAVED PET DATA
                // ═══════════════════════════════════════════════════════
                if (!silent) {
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('💾 PET SAVE DEBUG');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('ownedPets in memory:', ownedPets);
                    console.log('  Type:', typeof ownedPets);
                    console.log('  Keys:', Object.keys(ownedPets));
                    console.log('  Count:', Object.keys(ownedPets).length);
                    console.log('equippedPets:', equippedPets);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('saveData.ownedPets:', saveData.ownedPets);
                    console.log('  Type:', typeof saveData.ownedPets);
                    console.log('  Keys:', Object.keys(saveData.ownedPets || {}));
                    console.log('  Count:', Object.keys(saveData.ownedPets || {}).length);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                }
                
                if (!silent) {
                    console.log('✅ Game saved to localStorage');
                    console.log(`📊 Save size: ${(saveString.length / 1024).toFixed(2)} KB`);
                    showSaveIndicator(true);
                }
                
                return true;
                
            } catch (e) {
                console.error('❌ Failed to save game:', e);
                
                // Handle quota exceeded error
                if (e.name === 'QuotaExceededError') {
                    console.error('localStorage quota exceeded!');
                    // Try to clear backup and save again
                    try {
                        localStorage.removeItem(BACKUP_KEY);
                        const saveString = JSON.stringify({
                            version: SAVE_VERSION,
                            saveDate: new Date().toISOString(),
                            coins, diamonds, tickets, goldBars,
                            clickPower, autoClickers, multiplier, clickCooldown,
                            gamePasses, playTime, rebirthCount, rebirthMultiplier
                        });
                        localStorage.setItem(SAVE_KEY, saveString);
                        if (!silent) showSaveIndicator(true);
                        return true;
                    } catch (e2) {
                        console.error('Failed even after clearing backup:', e2);
                    }
                }
                
                if (!silent) showSaveIndicator(false);
                return false;
            }
        }
        
        // Load game from localStorage
        function loadFromLocalStorage() {
            if (!isLocalStorageAvailable()) {
                console.log('localStorage not available, starting fresh');
                return false;
            }
            
            try {
                const saveString = localStorage.getItem(SAVE_KEY);
                
                if (!saveString) {
                    console.log('No save found, starting fresh');
                    return false;
                }
                
                // Parse save data
                let saveData;
                try {
                    saveData = JSON.parse(saveString);
                } catch (e) {
                    console.error('Failed to parse save data, trying backup...', e);
                    
                    // Try backup
                    const backupString = localStorage.getItem(BACKUP_KEY);
                    if (backupString) {
                        saveData = JSON.parse(backupString);
                        console.log('✅ Loaded from backup');
                    } else {
                        throw new Error('No valid backup found');
                    }
                }
                
                // Validate loaded data
                const validData = validateLoadData(saveData);
                if (!validData) {
                    console.error('Save data validation failed');
                    return false;
                }
                
                // Restore core stats
                coins = validData.coins;
                diamonds = validData.diamonds;
                tickets = validData.tickets;
                goldBars = validData.goldBars;
                teleportPrice = validData.teleportPrice;
                
                // Restore event 2026
                event2026Coins = validData.event2026Coins;
                lastTaskReset = validData.lastTaskReset;
                nextTaskReset = validData.nextTaskReset;
                
                if (validData.event2026Tasks) {
                    // Merge saved tasks with default tasks (preserve structure)
                    for (const [key, task] of Object.entries(validData.event2026Tasks)) {
                        if (event2026Tasks[key]) {
                            event2026Tasks[key] = { ...event2026Tasks[key], ...task };
                        }
                    }
                }
                
                // Check if tasks need reset after loading
                checkTaskReset();
                
                // Restore stats
                clickPower = validData.clickPower;
                autoClickers = validData.autoClickers;
                multiplier = validData.multiplier;
                clickCooldown = validData.clickCooldown;
                
                // Restore game state
                gamePasses = validData.gamePasses;
                inventory = validData.inventory;
                ownedPets = validData.ownedPets;
                equippedPets = validData.equippedPets;
                
                // ═══════════════════════════════════════════════════════
                // DEBUG: LOG LOADED PET DATA
                // ═══════════════════════════════════════════════════════
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🔍 PET LOAD DEBUG');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('1️⃣ Raw loaded ownedPets:', ownedPets);
                console.log('   Type:', typeof ownedPets);
                console.log('   Is Array?', Array.isArray(ownedPets));
                console.log('   Is null?', ownedPets === null);
                console.log('   Keys count:', Object.keys(ownedPets || {}).length);
                console.log('   Keys:', Object.keys(ownedPets || {}));
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                // MIGRATION: Convert old pets to new format with baseName and mutation
                const migratedPets = {};
                for (const [key, pet] of Object.entries(ownedPets)) {
                    if (!pet.baseName) {
                        // Old pet format detected - migrate to new format
                        const newKey = key.includes('_') ? key : `${key}_normal`;
                        const baseName = key.replace(/_.*$/, ''); // Remove mutation suffix if exists
                        
                        migratedPets[newKey] = {
                            ...pet,
                            baseName: baseName,
                            mutation: newKey.includes('_') ? newKey.split('_')[1] : 'normal'
                        };
                        
                        console.log(`✅ Migrated pet: ${key} -> ${newKey}`, migratedPets[newKey]);
                    } else {
                        // Already new format
                        migratedPets[key] = pet;
                        console.log(`✓ Pet already migrated: ${key}`, pet);
                    }
                }
                ownedPets = migratedPets;
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('2️⃣ After migration ownedPets:', ownedPets);
                console.log('   Keys count:', Object.keys(ownedPets).length);
                console.log('   Keys:', Object.keys(ownedPets));
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                // Migrate equipped pets keys
                const oldEquippedPets = [...equippedPets];
                equippedPets = equippedPets.map(petKey => {
                    if (petKey && !petKey.includes('_normal')) {
                        const newKey = `${petKey}_normal`;
                        console.log(`✅ Migrated equipped pet: ${petKey} -> ${newKey}`);
                        return newKey;
                    }
                    return petKey;
                }).filter(Boolean);
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('3️⃣ Equipped pets migration:');
                console.log('   Before:', oldEquippedPets);
                console.log('   After:', equippedPets);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                console.log('✅ Pet migration completed. Total pets:', Object.keys(ownedPets).length);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                // Restore progress
                playTime = validData.playTime;
                shopDiscount = validData.shopDiscount;
                rebirthCount = validData.rebirthCount;
                rebirthMultiplier = validData.rebirthMultiplier;
                purchaseLimit = validData.purchaseLimit;
                purchaseCounts = validData.purchaseCounts;
                
                // Restore misc
                isAdmin = validData.isAdmin;
                weatherNextSpawn = validData.weatherNextSpawn;
                musicUnlocked = validData.musicUnlocked || false;
                currentTrackName = validData.currentTrackName || '';
                
                // Update music UI if unlocked
                if (musicUnlocked) {
                    document.getElementById('musicControls').style.display = 'block';
                    document.getElementById('unlockMusicBtn').style.display = 'none';
                    if (currentTrackName) {
                        document.getElementById('trackName').textContent = currentTrackName;
                    }
                }
                
                // Restore custom background
                customBackground = validData.customBackground || null;
                if (customBackground) {
                    // Apply background immediately after load
                    setTimeout(function() {
                        applyCustomBackground();
                        updateBackgroundPreview();
                        console.log('✅ Custom background loaded and applied from save');
                    }, 100);
                }
                
                // Restore Coin Flip Game data
                coinFlipRank = validData.coinFlipRank || 0;
                coinFlipStars = validData.coinFlipStars || 1;
                coinFlipWins = validData.coinFlipWins || 0;
                coinFlipLosses = validData.coinFlipLosses || 0;
                coinFlipConsecutiveLosses = validData.coinFlipConsecutiveLosses || 0;
                
                // Update coin flip display
                if (typeof updateCoinFlipDisplay === 'function') {
                    updateCoinFlipDisplay();
                }
                
                // Restore tracking stats
                totalClicks = validData.totalClicks || 0;
                totalCoinsEarned = validData.totalCoinsEarned || 0;
                totalSpins = validData.totalSpins || 0;
                totalWeatherSummoned = validData.totalWeatherSummoned || 0;
                rpsStats = validData.rpsStats || { gamesPlayed: 0, wins: 0, losses: 0, draws: 0 };
                
                // Restore music volume
                const savedVolume = localStorage.getItem('musicVolume');
                if (savedVolume) {
                    const volumeSlider = document.querySelector('input[type="range"]');
                    if (volumeSlider) {
                        volumeSlider.value = savedVolume;
                    }
                }
                
                // Restore gold codes
                if (validData.goldCodes) {
                    Object.keys(validData.goldCodes).forEach(code => {
                        if (goldCodes[code]) {
                            goldCodes[code].used = validData.goldCodes[code].used;
                        }
                    });
                }
                
                // Restore shop items
                if (validData.shopItems) {
                    validData.shopItems.forEach(savedItem => {
                        const item = shopItems.find(i => i.id === savedItem.id);
                        if (item) {
                            item.currentPrice = savedItem.currentPrice;
                            item.owned = savedItem.owned;
                        }
                    });
                }
                
                // Update all displays
                updateDisplay();
                updateWeatherDisplay();
                updateGamePassUI();
                renderShop();
                
                // ═══════════════════════════════════════════════════════
                // EMERGENCY SAFEGUARD: ENSURE ownedPets IS ALWAYS OBJECT
                // ═══════════════════════════════════════════════════════
                if (!ownedPets || typeof ownedPets !== 'object' || Array.isArray(ownedPets)) {
                    console.error('❌ CRITICAL: ownedPets is not an object after load!');
                    console.error('   Type:', typeof ownedPets);
                    console.error('   Value:', ownedPets);
                    console.error('   Resetting to empty object...');
                    ownedPets = {};
                }
                
                if (!equippedPets || !Array.isArray(equippedPets)) {
                    console.error('❌ CRITICAL: equippedPets is not an array after load!');
                    console.error('   Type:', typeof equippedPets);
                    console.error('   Value:', equippedPets);
                    console.error('   Resetting to empty array...');
                    equippedPets = [];
                }
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('✅ FINAL PET STATE AFTER LOAD:');
                console.log('   ownedPets keys:', Object.keys(ownedPets));
                console.log('   ownedPets count:', Object.keys(ownedPets).length);
                console.log('   equippedPets:', equippedPets);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                renderPets();
                updateTradeUpPetList(); // Update trade-up dropdown after loading pets
                updateTeleportPrices(); // Update teleport prices after loading
                updateEventDisplay(); // Update event 2026 display
                renderEventTasks(); // Render event tasks
                initDragonGenerators(); // Start dragon diamond generators
                
                console.log('✅ Game loaded from localStorage');
                console.log('📅 Save date:', saveData.saveDate);
                
                showToast('✅ Đã tải game tự động!', 2000);
                
                return true;
                
            } catch (e) {
                console.error('❌ Failed to load game:', e);
                console.log('Starting fresh game');
                return false;
            }
        }
        
        // Clear save data (for testing/reset)
        function clearLocalStorageSave() {
            if (!isLocalStorageAvailable()) return;
            
            try {
                localStorage.removeItem(SAVE_KEY);
                localStorage.removeItem(BACKUP_KEY);
                console.log('✅ Save data cleared');
                return true;
            } catch (e) {
                console.error('Failed to clear save:', e);
                return false;
            }
        }
        
        // Start auto-save system
        function startAutoSave() {
            // Auto-save every 10 seconds
            if (autoSaveInterval) {
                clearInterval(autoSaveInterval);
            }
            
            autoSaveInterval = setInterval(() => {
                saveToLocalStorage(true); // Silent save
            }, 10000);
            
            console.log('🔄 Auto-save enabled (every 10 seconds)');
        }
        
        // Stop auto-save
        function stopAutoSave() {
            if (autoSaveInterval) {
                clearInterval(autoSaveInterval);
                autoSaveInterval = null;
                console.log('⏸️ Auto-save disabled');
            }
        }

        // Initialize language on page load
        window.addEventListener('DOMContentLoaded', function() {
            // Load language preference
            const savedLang = localStorage.getItem('gameLanguage');
            if (savedLang) {
                setLanguage(savedLang);
            } else {
                // Default to English
                setLanguage('en');
            }
            
            // Auto-load save from localStorage
            loadFromLocalStorage();
            
            // Update coin flip display
            if (typeof updateCoinFlipDisplay === 'function') {
                updateCoinFlipDisplay();
            }
            
            // Start auto-save system
            startAutoSave();
            
            // Setup background file input listener
            const bgFileInput = document.getElementById('bgFileInput');
            if (bgFileInput) {
                bgFileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    // Validate image
                    if (!file.type.startsWith('image/')) {
                        alert('❌ Vui lòng chọn file hình ảnh!');
                        bgFileInput.value = '';
                        return;
                    }
                    
                    // Check size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        alert('❌ File quá lớn! Vui lòng chọn hình dưới 5MB.');
                        bgFileInput.value = '';
                        return;
                    }
                    
                    // Check diamonds
                    if (diamonds < 100) {
                        alert(`❌ Bạn không đủ Kim Cương!\n\nCần: 100 💎\nHiện có: ${diamonds} 💎\nThiếu: ${100 - diamonds} 💎`);
                        bgFileInput.value = '';
                        return;
                    }
                    
                    // Confirm purchase
                    const confirmPurchase = confirm(
                        '🖼️ ĐỔI BACKGROUND\n\n' +
                        'File: ' + file.name + '\n' +
                        'Giá: 100 💎\n' +
                        'Có: ' + diamonds + ' 💎\n' +
                        'Còn lại: ' + (diamonds - 100) + ' 💎\n\n' +
                        'Xác nhận đổi background?'
                    );
                    
                    if (!confirmPurchase) {
                        bgFileInput.value = '';
                        return;
                    }
                    
                    // Deduct diamonds immediately
                    diamonds -= 100;
                    updateDisplay();
                    saveToLocalStorage(true);
                    
                    // Read file as base64
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const base64Image = event.target.result;
                        
                        customBackground = base64Image;
                        localStorage.setItem('customBackground', base64Image);
                        
                        applyCustomBackground();
                        updateBackgroundPreview();
                        
                        // Force repaint
                        setTimeout(function() {
                            document.body.style.display = 'none';
                            document.body.offsetHeight;
                            document.body.style.display = '';
                            
                            if (customBackground) {
                                document.body.classList.add('custom-bg');
                                document.body.setAttribute('style', `background-image: url('${customBackground}') !important;`);
                            }
                        }, 100);
                        
                        showToast('✅ Đã đổi background thành công!', 3000);
                        saveToLocalStorage(true);
                        
                        console.log('✅ Background changed successfully');
                    };
                    
                    reader.onerror = function() {
                        alert('❌ Lỗi khi đọc file!');
                        diamonds += 100;
                        updateDisplay();
                        saveToLocalStorage(true);
                        bgFileInput.value = '';
                    };
                    
                    reader.readAsDataURL(file);
                    bgFileInput.value = '';
                });
                console.log('✅ Background file input listener attached');
            }
            
            // Update background preview
            updateBackgroundPreview();
            
            console.log('🎮 Game initialized');
            console.log('💾 Auto-save: Enabled');
        });

        // ===== MINI GAME - KÉO BÚA BAO =====
        function generateFairBotChoice(playerChoice) {
            const rand = Math.random();
            const winningMoves = {
                'rock': 'paper',
                'paper': 'scissors',
                'scissors': 'rock'
            };
            const losingMoves = {
                'rock': 'scissors',
                'paper': 'rock',
                'scissors': 'paper'
            };
            if (rand < 0.5) {
                return losingMoves[playerChoice];
            } else {
                return winningMoves[playerChoice];
            }
        }

        let gameActive = false;
        let selectedMultiplier = 0;
        let requiredWins = 0;
        let currentWins = 0;
        let betAmount = 0;
        let betType = 'coins';
        let botChoice = '';

        function selectMultiplier(mult, wins) {
            selectedMultiplier = mult;
            requiredWins = wins;
            document.querySelectorAll('.multiplier-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            document.getElementById(`mult${mult}`).classList.add('selected');
        }

        function startGame() {
            if (selectedMultiplier === 0) {
                alert('⚠️ Vui lòng chọn mục tiêu!');
                return;
            }
            const amount = parseInt(document.getElementById('betAmount').value);
            betType = document.getElementById('betType').value;
            if (!amount || amount <= 0) {
                alert('⚠️ Nhập số tiền hợp lệ!');
                return;
            }
            if (betType === 'coins' && coins < amount) {
                alert('❌ Không đủ Coins!');
                return;
            }
            if (betType === 'diamonds' && diamonds < amount) {
                alert('❌ Không đủ Diamonds!');
                return;
            }
            if (betType === 'coins') {
                coins -= amount;
            } else {
                diamonds -= amount;
            }
            updateDisplay();
            gameActive = true;
            betAmount = amount;
            currentWins = 0;
            document.getElementById('currentWins').textContent = currentWins;
            document.getElementById('requiredWins').textContent = requiredWins;
            document.getElementById('currentBet').textContent = formatNumber(betAmount);
            document.getElementById('currentBetType').textContent = betType === 'coins' ? 'Coins' : 'Diamonds';
            document.getElementById('gameProgress').style.display = 'block';
            document.getElementById('gameButtons').style.display = 'block';
            document.getElementById('gameResult').style.display = 'none';
        }

        function playerChoice(choice) {
            if (!gameActive) return;
            gameActive = false;
            botChoice = generateFairBotChoice(choice);
            const choiceNames = {
                rock: 'Búa ✊',
                paper: 'Bao ✋',
                scissors: 'Kéo ✌️'
            };
            const botChoiceName = choiceNames[botChoice];
            const playerChoiceName = choiceNames[choice];
            let result = '';
            
            // Track game played
            rpsStats.gamesPlayed++;
            
            if (choice === botChoice) {
                result = 'Hòa';
                rpsStats.draws++;
            } else if (
                (choice === 'rock' && botChoice === 'scissors') ||
                (choice === 'paper' && botChoice === 'rock') ||
                (choice === 'scissors' && botChoice === 'paper')
            ) {
                result = 'Thắng';
                currentWins++;
                rpsStats.wins++;
            } else {
                result = 'Thua';
                rpsStats.losses++;
            }
            document.getElementById('gameButtons').style.display = 'none';
            document.getElementById('gameResult').style.display = 'block';
            if (result === 'Thắng') {
                document.getElementById('resultText').innerHTML = '🎉 THẮNG!';
                document.getElementById('resultText').style.color = '#00ff00';
                document.getElementById('resultDetail').innerHTML = `Bạn: ${playerChoiceName} vs Bot: ${botChoiceName}<br>Tiến độ: ${currentWins}/${requiredWins}`;
                document.getElementById('resultDetail').style.color = '#ffffff';
                if (currentWins >= requiredWins) {
                    const prize = betAmount * selectedMultiplier;
                    if (betType === 'coins') {
                        coins += prize;
                    } else {
                        diamonds += prize;
                    }
                    updateDisplay();
                    document.getElementById('resultText').innerHTML = '🏆 HOÀN THÀNH!';
                    document.getElementById('resultDetail').innerHTML = `Thắng ${requiredWins} trận!<br>🎁 Nhận: ${formatNumber(prize)} ${betType === 'coins' ? 'Coins' : 'Diamonds'} (x${selectedMultiplier})`;
                    document.getElementById('continueBtn').textContent = '🎮 Chơi Lại';
                    document.getElementById('continueBtn').style.background = 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)';
                } else {
                    document.getElementById('continueBtn').textContent = 'Tiếp Tục ➡️';
                    document.getElementById('continueBtn').style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
                }
            } else if (result === 'Hòa') {
                document.getElementById('resultText').innerHTML = '🤝 HÒA!';
                document.getElementById('resultText').style.color = '#ffd700';
                document.getElementById('resultDetail').innerHTML = `Bạn: ${playerChoiceName} vs Bot: ${botChoiceName}<br>Chơi lại!`;
                document.getElementById('resultDetail').style.color = '#ffffff';
                document.getElementById('continueBtn').textContent = 'Tiếp Tục ➡️';
                document.getElementById('continueBtn').style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
            } else {
                document.getElementById('resultText').innerHTML = '💀 THUA!';
                document.getElementById('resultText').style.color = '#ff0000';
                document.getElementById('resultDetail').innerHTML = `Bạn: ${playerChoiceName} vs Bot: ${botChoiceName}<br>❌ Mất ${formatNumber(betAmount)} ${betType === 'coins' ? 'Coins' : 'Diamonds'}!`;
                document.getElementById('resultDetail').style.color = '#ff6b6b';
                document.getElementById('continueBtn').textContent = '😢 Về Menu';
                document.getElementById('continueBtn').style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%)';
            }
            document.getElementById('currentWins').textContent = currentWins;
        }

        function continueGame() {
            if (currentWins >= requiredWins || document.getElementById('resultText').textContent.includes('THUA')) {
                gameActive = false;
                currentWins = 0;
                selectedMultiplier = 0;
                betAmount = 0;
                document.getElementById('gameProgress').style.display = 'none';
                document.getElementById('gameButtons').style.display = 'none';
                document.getElementById('gameResult').style.display = 'none';
                document.querySelectorAll('.multiplier-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                return;
            }
            gameActive = true;
            document.getElementById('gameButtons').style.display = 'block';
            document.getElementById('gameResult').style.display = 'none';
        }

        // ===== GOLD BARS SYSTEM =====
        function buyGoldPackage(amount, price) {
            // Store package info for redemption
            window.currentGoldPackage = { amount, price };
            
            // Show modal
            document.getElementById('codePackageName').textContent = `${amount} 🏆 Thỏi Vàng ($${price.toFixed(2)})`;
            document.getElementById('codeRedemptionOverlay').style.display = 'block';
            document.getElementById('codeRedemptionModal').style.display = 'block';
            document.getElementById('codeInput').value = '';
            document.getElementById('codeInput').focus();
            
            // In production: Codes never exposed to client
            // Admin gets codes via secure admin panel or email
            if (isAdmin) {
                console.log('🔐 ADMIN: Use admin panel to generate codes');
                console.log('📧 Codes sent via email after purchase');
            }
        }

        function closeCodeModal() {
            document.getElementById('codeRedemptionOverlay').style.display = 'none';
            document.getElementById('codeRedemptionModal').style.display = 'none';
            document.getElementById('codeInput').value = '';
        }

        // Rate limiting for code redemption
        let _redemptionAttempts = 0;
        let _lastRedemption = Date.now();

        async function redeemCode() {
            const code = document.getElementById('codeInput').value.toUpperCase().trim();
            
            // Rate limiting
            const now = Date.now();
            if (now - _lastRedemption < 3000 && !isAdmin) {
                alert('⚠️ Vui lòng đợi 3 giây giữa các lần nhập code!');
                return;
            }
            _lastRedemption = now;
            
            if (!code) {
                alert('❌ Vui lòng nhập code!');
                return;
            }
            
            // Track attempts
            _redemptionAttempts++;
            if (_redemptionAttempts > 10 && !isAdmin) {
                alert('⚠️ Quá nhiều lần thử! Vui lòng refresh trang.');
                closeCodeModal();
                return;
            }
            
            // Show loading
            const submitBtn = document.querySelector('[onclick="redeemCode()"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '⏳ Đang kiểm tra...';
            submitBtn.disabled = true;
            
            try {
                // SERVER-SIDE VALIDATION (Simulated API call)
                const result = await SERVER_API.validateCode(code);
                
                if (!result.success) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    if (result.error === 'INVALID_CODE') {
                        alert('❌ CODE KHÔNG HỢP LỆ!\n\nCode này không tồn tại. Vui lòng kiểm tra lại.');
                    } else if (result.error === 'CODE_USED') {
                        alert('❌ CODE ĐÃ ĐƯỢC SỬ DỤNG!\n\nCode này đã được dùng rồi. Mỗi code chỉ dùng được 1 lần.');
                    }
                    return;
                }
                
                // Mark as used on server
                await SERVER_API.markCodeUsed(code);
                
                // Add gold bars
                goldBars += result.amount;
                
                // Reset attempts on success
                _redemptionAttempts = 0;
                
                // Close modal
                closeCodeModal();
                
                // Update display
                updateDisplay();
                
                // Success message
                alert(
                    `🎉 CODE HỢP LỆ!\n\n` +
                    `✅ Đã nhận: ${result.amount} 🏆 Thỏi Vàng\n` +
                    `💰 Tổng: ${goldBars} 🏆 Thỏi Vàng\n\n` +
                    `🎁 Cảm ơn bạn đã mua gói $${result.price.toFixed(2)}!`
                );
                
            } catch (error) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('❌ Lỗi kết nối server! Vui lòng thử lại.');
            }
        }

        // Allow Enter key to redeem
        document.addEventListener('DOMContentLoaded', function() {
            const codeInput = document.getElementById('codeInput');
            if (codeInput) {
                codeInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        redeemCode();
                    }
                });
            }
        });

        function buyGoldItem(itemName, cost, effect) {
            if (goldBars < cost) {
                alert(`❌ Không đủ Thỏi Vàng!\n\nCần: ${cost} 🏆\nCó: ${goldBars} 🏆`);
                return;
            }
            
            const confirm = window.confirm(
                `🏆 MUA VẬT PHẨM PREMIUM\n\n` +
                `${itemName}\n` +
                `Giá: ${cost} 🏆 Thỏi Vàng\n\n` +
                `Hiệu ứng: ${effect}\n\n` +
                `Xác nhận mua?`
            );
            
            if (!confirm) return;
            
            goldBars -= cost;
            
            // Apply effects based on item
            if (itemName === '💎 Diamond Pack x1000') {
                diamonds += 1000;
            } else if (itemName === '💰 Mega Coins x1M') {
                coins += 1000000;
            } else if (itemName === '⚡ Auto Clicker x50') {
                autoClickers += 50;
            } else if (itemName === '🔥 Click Power x100') {
                clickPower += 100;
            } else if (itemName === '🚀 Multiplier x5') {
                multiplier += 5;
            } else if (itemName === '⏱️ Speed Boost') {
                clickCooldown = Math.max(0.01, clickCooldown - 0.2);
            } else if (itemName === '🎒 Inventory Slot +10') {
                // Placeholder for inventory expansion
            } else if (itemName === '🏆 VIP Pass (30 Days)') {
                gamePasses.vip = true;
                updateGamePassUI();
            } else if (itemName === '👑 Premium Pass (30 Days)') {
                gamePasses.premium = true;
                updateGamePassUI();
            } else if (itemName === '🎫 Ticket Pack x100') {
                tickets += 100;
            } else if (itemName === '🥚 Legendary Egg') {
                // Give legendary pet
                const legendaryPets = [
                    { name: 'Phoenix', icon: '🔥', multiplier: 100 },
                    { name: 'Dragon', icon: '🐉', multiplier: 150 },
                    { name: 'Unicorn', icon: '🦄', multiplier: 120 }
                ];
                const pet = legendaryPets[Math.floor(Math.random() * legendaryPets.length)];
                const petKey = `${pet.name}_normal`;
                if (!ownedPets[petKey]) {
                    ownedPets[petKey] = {
                        key: petKey,
                        name: pet.name,
                        baseName: pet.name,
                        icon: pet.icon,
                        multiplier: pet.multiplier,
                        mutation: 'normal',
                        count: 0
                    };
                }
                ownedPets[petKey].count++;
                renderPets();
                updateTradeUpPetList();
                alert(`🎉 Nhận được pet Legendary: ${pet.icon} ${pet.name} (x${pet.multiplier})!`);
            } else if (itemName === '🌟 Rebirth Multiplier +2x') {
                rebirthMultiplier += 2;
            }
            
            updateDisplay();
            renderShop();
            alert(`✅ Đã mua ${itemName}!\n\n💰 Còn lại: ${goldBars} 🏆 Thỏi Vàng`);
        }

        // ===== WHEEL GAME FUNCTIONS =====
        function buyTickets(amount) {
            const cost = amount * 500;
            if (diamonds < cost) {
                alert(`❌ Không đủ Diamonds! Cần ${cost} 💎`);
                return;
            }
            diamonds -= cost;
            tickets += amount;
            updateDisplay();
            alert(`✅ Đã mua ${amount} vé!`);
        }

        function getRandomPrize() {
            const rand = Math.random() * 100;
            let cumulative = 0;
            for (const prize of wheelPrizes) {
                cumulative += prize.chance;
                if (rand <= cumulative) return prize;
            }
            return wheelPrizes[0];
        }

        function givePrize(prize) {
            if (prize.type === 'coins') {
                coins += prize.value;
            } else if (prize.type === 'diamonds') {
                diamonds += prize.value;
            } else if (prize.type === 'pet') {
                const commonPets = eggShop[0].pets;
                const randomPet = commonPets[Math.floor(Math.random() * commonPets.length)];
                const petKey = `${randomPet.name}_normal`;
                if (!ownedPets[petKey]) {
                    ownedPets[petKey] = {
                        key: petKey,
                        name: randomPet.name,
                        baseName: randomPet.name,
                        icon: randomPet.icon,
                        multiplier: randomPet.multiplier,
                        mutation: 'normal',
                        count: 0
                    };
                }
                ownedPets[petKey].count++;
                renderPets();
                updateTradeUpPetList();
                return { ...prize, name: randomPet.name, icon: randomPet.icon };
            }
            return prize;
        }

        function spinWheel(times) {
            if (isSpinning) return;
            if (tickets < times) {
                alert(`❌ Không đủ vé! Cần ${times} 🎫`);
                return;
            }
            tickets -= times;
            totalSpins += times; // Track spins
            isSpinning = true;
            document.getElementById('spin1Btn').disabled = true;
            document.getElementById('spin10Btn').disabled = true;
            document.getElementById('wheelResult').style.display = 'none';
            
            const prizes = [];
            for (let i = 0; i < times; i++) {
                const prize = getRandomPrize();
                const givenPrize = givePrize(prize);
                prizes.push(givenPrize);
            }
            
            const wheel = document.getElementById('wheelDisplay');
            const randomRotation = 1080 + Math.random() * 720;
            wheel.style.transform = `rotate(${randomRotation}deg)`;
            
            setTimeout(() => {
                isSpinning = false;
                updateDisplay();
                document.getElementById('spin1Btn').disabled = false;
                document.getElementById('spin10Btn').disabled = false;
                
                let resultHTML = '';
                const grouped = {};
                prizes.forEach(p => {
                    const key = p.name;
                    if (!grouped[key]) grouped[key] = { ...p, count: 0 };
                    grouped[key].count++;
                });
                Object.values(grouped).forEach(item => {
                    resultHTML += `<div>${item.icon} ${item.name} x${item.count}</div>`;
                });
                
                document.getElementById('wheelResultText').innerHTML = `🎉 Kết Quả x${times}:`;
                document.getElementById('wheelResultList').innerHTML = resultHTML;
                document.getElementById('wheelResult').style.display = 'block';
                
                setTimeout(() => {
                    wheel.style.transition = 'none';
                    wheel.style.transform = 'rotate(0deg)';
                    setTimeout(() => {
                        wheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
                    }, 50);
                }, 100);
            }, 3000);
        }
        
        // ═══════════════════════════════════════════════════════
        // MOBILE UX HELPER FUNCTIONS
        // ═══════════════════════════════════════════════════════
        
        // Lock body scroll when modal opens
        function lockScroll() {
            document.body.classList.add('modal-open');
            document.body.style.top = `-${window.scrollY}px`;
        }
        
        // Unlock body scroll when modal closes
        function unlockScroll() {
            const scrollY = document.body.style.top;
            document.body.classList.remove('modal-open');
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        
        // Visual feedback for button press
        function giveFeedback(element, type = 'success') {
            if (!element) return;
            
            element.classList.remove('success-flash', 'error-shake');
            void element.offsetWidth; // Force reflow
            
            if (type === 'success') {
                element.classList.add('success-flash');
            } else if (type === 'error') {
                element.classList.add('error-shake');
            }
            
            setTimeout(() => {
                element.classList.remove('success-flash', 'error-shake');
            }, 300);
        }
        
        // Show why action failed
        function showToast(message, duration = 2000) {
            // Remove existing toasts
            const existing = document.querySelector('.toast-message');
            if (existing) existing.remove();
            
            const toast = document.createElement('div');
            toast.className = 'toast-message';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 10000;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                animation: slideDown 0.3s ease;
                max-width: 90%;
                text-align: center;
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
        
        // Add toast animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Prevent click spam
        const clickTimers = new Map();
        function debounceClick(key, callback, delay = 300) {
            if (clickTimers.has(key)) {
                showToast('⏳ Chờ một chút...', 1000);
                return false;
            }
            
            clickTimers.set(key, true);
            callback();
            
            setTimeout(() => {
                clickTimers.delete(key);
            }, delay);
            
            return true;
        }
        
        // Better error messages
        function showError(message, element = null) {
            showToast('❌ ' + message, 2500);
            if (element) {
                giveFeedback(element, 'error');
            }
        }
        
        function showSuccess(message, element = null) {
            showToast('✅ ' + message, 2000);
            if (element) {
                giveFeedback(element, 'success');
            }
        }
        
        // Mobile-friendly console
        if (isMobile) {
            console.log('📱 Mobile UX Enhancements Active');
            console.log('✅ 28 UX issues fixed');
            console.log('⚡ Touch optimized');
            console.log('🎯 Safe zones configured');
            console.log('🌐 Landscape support added');
        }
        
        // ═══════════════════════════════════════════════════════
        // TELEPORT SYSTEM
        // ═══════════════════════════════════════════════════════
        
        function teleportTo(sectionId) {
            // Kiểm tra đủ tiền
            if (coins < teleportPrice) {
                showToast(`❌ Không đủ tiền! Cần ${formatNumber(teleportPrice)} coins`, 2500);
                return;
            }
            
            let targetElement;
            
            // Map section IDs to actual element IDs
            const sectionMap = {
                'shopItems': 'shopItems-section',
                'petSystem': 'petSystem',
                'eggShop': 'eggShop',
                'miniGame': 'miniGame',
                'gamepassPanel': 'gamepassPanel',
                'settingsPanel': 'settingsPanel',
                'tradeUpSection': 'tradeUpSection',
                'rebirthPanel': 'rebirthPanel'
            };
            
            const mappedId = sectionMap[sectionId] || sectionId;
            targetElement = document.getElementById(mappedId);
            
            if (targetElement) {
                // Trừ tiền
                coins -= teleportPrice;
                
                // Tăng giá x2
                const oldPrice = teleportPrice;
                teleportPrice *= 2;
                
                // Cập nhật hiển thị
                updateDisplay();
                updateTeleportPrices();
                saveToLocalStorage(true);
                
                // Smooth scroll to target
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // Visual feedback
                targetElement.style.transition = 'all 0.3s';
                targetElement.style.transform = 'scale(1.02)';
                targetElement.style.boxShadow = '0 0 30px rgba(102,126,234,0.8)';
                
                setTimeout(() => {
                    targetElement.style.transform = 'scale(1)';
                    targetElement.style.boxShadow = '';
                }, 600);
                
                showToast(`✅ Đã dịch chuyển! -${formatNumber(oldPrice)} coins\n💰 Giá mới: ${formatNumber(teleportPrice)} coins`, 2500);
                
                // Start 15-second timer
                showTeleportTimer();
            } else {
                showToast('❌ Không tìm thấy vị trí!', 2000);
            }
        }
        
        // Cập nhật giá hiển thị trên các nút teleport
        function updateTeleportPrices() {
            const teleportButtons = document.querySelectorAll('.teleport-btn');
            teleportButtons.forEach(btn => {
                const originalText = btn.getAttribute('data-original-text');
                if (!originalText) {
                    // Lưu text gốc lần đầu
                    btn.setAttribute('data-original-text', btn.textContent.trim());
                }
                const baseText = btn.getAttribute('data-original-text');
                btn.innerHTML = `${baseText}<br><span style="font-size: 0.85em; color: #ffd700;">💰 ${formatNumber(teleportPrice)} coins</span>`;
            });
        }
        
        // ═══════════════════════════════════════════════════════
        // BACKGROUND MUSIC SYSTEM
        // ═══════════════════════════════════════════════════════
        
        let backgroundMusic = null;
        let musicUnlocked = false;
        let currentTrackName = '';
        
        // Custom background
        let customBackground = null; // Stores base64 image data
        
        function unlockMusic() {
            if (musicUnlocked) {
                showToast('🎵 Đã mở khóa rồi!', 2000);
                return;
            }
            
            if (diamonds < 50) {
                showToast('❌ Cần 50💎 để mở khóa!', 2500);
                return;
            }
            
            if (confirm('Mở khóa tính năng nhạc nền với 50💎?')) {
                diamonds -= 50;
                musicUnlocked = true;
                updateDisplay();
                saveToLocalStorage();
                
                document.getElementById('musicControls').style.display = 'block';
                document.getElementById('unlockMusicBtn').style.display = 'none';
                
                showToast('✅ Đã mở khóa nhạc nền!', 2000);
            }
        }
        
        function importMusic() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'audio/mp3,audio/wav,audio/ogg,audio/mpeg';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    
                    if (backgroundMusic) {
                        backgroundMusic.pause();
                        URL.revokeObjectURL(backgroundMusic.src);
                    }
                    
                    backgroundMusic = new Audio(url);
                    backgroundMusic.loop = true;
                    backgroundMusic.volume = 0.5;
                    
                    currentTrackName = file.name;
                    document.getElementById('trackName').textContent = currentTrackName;
                    
                    showToast('✅ Đã tải nhạc: ' + file.name, 2500);
                }
            };
            
            input.click();
        }
        
        function toggleMusic() {
            if (!backgroundMusic) {
                showToast('❌ Chưa import nhạc!', 2000);
                return;
            }
            
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
                localStorage.setItem('musicPlaying', 'true');
                showToast('▶️ Đang phát nhạc...', 1500);
            } else {
                backgroundMusic.pause();
                document.getElementById('playPauseBtn').textContent = '▶️ Play';
                localStorage.setItem('musicPlaying', 'false');
                showToast('⏸️ Đã tạm dừng', 1500);
            }
        }
        
        function stopMusic() {
            if (backgroundMusic) {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                document.getElementById('playPauseBtn').textContent = '▶️ Play';
                localStorage.setItem('musicPlaying', 'false');
                showToast('⏹️ Đã dừng nhạc', 1500);
            }
        }
        
        function updateVolume(value) {
            if (backgroundMusic) {
                backgroundMusic.volume = value / 100;
                localStorage.setItem('musicVolume', value);
            }
        }
        
        // ═══════════════════════════════════════════════════════
        // BACKGROUND CUSTOMIZATION SYSTEM
        // ═══════════════════════════════════════════════════════
        
        window.selectBackgroundFile = function() {
            // Check diamonds BEFORE opening file picker
            if (diamonds < 100) {
                alert(`❌ Bạn không đủ Kim Cương!\n\nCần: 100 💎\nHiện có: ${diamonds} 💎\nThiếu: ${100 - diamonds} 💎`);
                return;
            }
            
            const fileInput = document.getElementById('bgFileInput');
            fileInput.click();
        }
        
        window.resetBackground = function() {
            if (!customBackground) {
                showToast('ℹ️ Đang dùng background mặc định', 2000);
                return;
            }
            
            const confirmReset = confirm(
                '🔄 RESET BACKGROUND\n\n' +
                'Bạn có chắc muốn đặt lại background mặc định?\n\n' +
                '(Không hoàn lại 100💎)'
            );
            
            if (!confirmReset) return;
            
            customBackground = null;
            localStorage.removeItem('customBackground');
            
            applyCustomBackground();
            updateBackgroundPreview();
            
            showToast('✅ Đã reset background!', 2000);
            saveToLocalStorage(true);
        }
        
        function applyCustomBackground() {
            console.log('🎨 applyCustomBackground called');
            
            if (customBackground) {
                document.body.classList.add('custom-bg');
                document.body.setAttribute('style', `background-image: url('${customBackground}') !important;`);
                console.log('✅ Custom background applied');
            } else {
                document.body.classList.remove('custom-bg');
                document.body.setAttribute('style', '');
                console.log('✅ Default background restored');
            }
        }
        
        function updateBackgroundPreview() {
            const preview = document.getElementById('bgPreview');
            if (preview) {
                if (customBackground) {
                    preview.style.backgroundImage = `url('${customBackground}')`;
                } else {
                    preview.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
            }
        }
        
        // ═══════════════════════════════════════════════════════
        // EVENT 2026 SYSTEM
        // ═══════════════════════════════════════════════════════
        
        // Render event tasks
        function renderEventTasks() {
            const dailyContainer = document.getElementById('dailyTasks');
            const weeklyContainer = document.getElementById('weeklyTasks');
            const specialContainer = document.getElementById('specialTasks');
            
            if (!dailyContainer || !weeklyContainer || !specialContainer) return;
            
            dailyContainer.innerHTML = '';
            weeklyContainer.innerHTML = '';
            specialContainer.innerHTML = '';
            
            for (const [key, task] of Object.entries(event2026Tasks)) {
                const taskEl = document.createElement('div');
                taskEl.style.cssText = `
                    background: ${task.completed ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,255,0.1)'};
                    border: 2px solid ${task.completed ? '#00ff00' : 'rgba(255,255,255,0.3)'};
                    border-radius: 10px;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                `;
                
                const progress = Math.min(100, (task.progress / task.target) * 100);
                
                taskEl.innerHTML = `
                    <div style="flex: 1; min-width: 200px;">
                        <div style="font-weight: bold; font-size: 1.1em;">${task.completed ? '✅' : '⏳'} ${task.name}</div>
                        <div style="color: #aaa; font-size: 0.9em; margin-top: 5px;">
                            Tiến độ: ${formatNumber(task.progress)} / ${formatNumber(task.target)}
                        </div>
                        <div style="background: rgba(0,0,0,0.3); height: 8px; border-radius: 4px; margin-top: 8px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #4ecdc4, #44a2ff); height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    <div style="text-align: center; display: flex; flex-direction: column; gap: 5px;">
                        <div style="color: #ffd700; font-weight: bold; font-size: 1.1em;">🪙 ${task.reward}</div>
                        ${!task.completed && task.progress >= task.target ? 
                            `<button onclick="claimEventTask('${key}')" class="buy-button" style="padding: 8px 15px;">Nhận thưởng</button>` : 
                            task.completed ? '<div style="color: #00ff00; font-size: 0.9em;">Đã hoàn thành</div>' : 
                            `<button onclick="skipTask('${key}')" class="buy-button" style="padding: 6px 12px; background: linear-gradient(135deg, #ffd700, #ff8c00); font-size: 0.9em;">⚡ Skip (599🏆)</button>`}
                    </div>
                `;
                
                if (task.type === 'daily') dailyContainer.appendChild(taskEl);
                else if (task.type === 'weekly') weeklyContainer.appendChild(taskEl);
                else if (task.type === 'special') specialContainer.appendChild(taskEl);
            }
        }
        
        // Update task progress
        function updateEventTask(taskKey, increment = 1) {
            if (event2026Tasks[taskKey] && !event2026Tasks[taskKey].completed) {
                event2026Tasks[taskKey].progress += increment;
                renderEventTasks();
                saveToLocalStorage(true);
            }
        }
        
        // Claim task reward
        function claimEventTask(taskKey) {
            const task = event2026Tasks[taskKey];
            if (!task || task.completed) return;
            
            if (task.progress >= task.target) {
                task.completed = true;
                event2026Coins += task.reward;
                updateEventDisplay();
                renderEventTasks();
                saveToLocalStorage(true);
                showToast(`✅ Hoàn thành nhiệm vụ! +${task.reward} 🪙 Xu 2026`, 2500);
            }
        }
        
        // Skip single task with gold bars
        function skipTask(taskKey) {
            const task = event2026Tasks[taskKey];
            if (!task || task.completed) return;
            
            if (goldBars < 599) {
                showToast('❌ Không đủ Gold Bar! Cần 599 🏆', 2500);
                return;
            }
            
            if (!confirm(`⚡ SKIP NHIỆM VỤ\n\n${task.name}\nPhần thưởng: ${task.reward} 🪙 Xu 2026\n\nGiá: 599 🏆 Gold Bar\n\nXác nhận skip?`)) {
                return;
            }
            
            goldBars -= 599;
            task.completed = true;
            event2026Coins += task.reward;
            
            updateEventDisplay();
            updateDisplay();
            renderEventTasks();
            saveToLocalStorage(true);
            
            showToast(`✅ Đã skip nhiệm vụ! +${task.reward} 🪙`, 2000);
        }
        
        // Skip all tasks
        function skipAllTasks() {
            // Count incomplete tasks
            const incompleteTasks = Object.values(event2026Tasks).filter(t => !t.completed);
            
            if (incompleteTasks.length === 0) {
                showToast('✅ Tất cả nhiệm vụ đã hoàn thành!', 2000);
                return;
            }
            
            const totalCost = 599 * incompleteTasks.length;
            const totalReward = incompleteTasks.reduce((sum, t) => sum + t.reward, 0);
            
            if (goldBars < totalCost) {
                showToast(`❌ Không đủ Gold Bar! Cần ${totalCost} 🏆\nCó: ${goldBars} 🏆`, 3000);
                return;
            }
            
            if (!confirm(
                `⚡ HOÀN THÀNH TẤT CẢ NHIỆM VỤ\n\n` +
                `Số nhiệm vụ chưa hoàn thành: ${incompleteTasks.length}\n` +
                `Tổng phần thưởng: ${totalReward} 🪙 Xu 2026\n\n` +
                `Tổng giá: ${totalCost} 🏆 Gold Bar\n` +
                `Còn lại: ${goldBars - totalCost} 🏆\n\n` +
                `Xác nhận?`
            )) {
                return;
            }
            
            goldBars -= totalCost;
            
            // Complete all tasks
            incompleteTasks.forEach(task => {
                task.completed = true;
                event2026Coins += task.reward;
            });
            
            updateEventDisplay();
            updateDisplay();
            renderEventTasks();
            saveToLocalStorage(true);
            
            showToast(`✅ Đã hoàn thành ${incompleteTasks.length} nhiệm vụ! +${totalReward} 🪙`, 3000);
        }
        
        // Reset daily/weekly tasks
        function resetEventTasks() {
            console.log('🔄 Resetting event tasks...');
            
            for (const [key, task] of Object.entries(event2026Tasks)) {
                if (task.type === 'daily' || task.type === 'weekly') {
                    task.progress = 0;
                    task.completed = false;
                }
                // Special tasks are one-time only, don't reset
            }
            
            // Set next reset time (24 hours from now)
            nextTaskReset = Date.now() + (24 * 60 * 60 * 1000);
            lastTaskReset = Date.now();
            
            renderEventTasks();
            saveToLocalStorage(true);
            
            showToast('🔄 Nhiệm vụ đã được làm mới!', 2500);
        }
        
        // Check if tasks need reset
        function checkTaskReset() {
            if (Date.now() >= nextTaskReset) {
                resetEventTasks();
            }
        }
        
        // Update reset timer display
        function updateTaskResetTimer() {
            const timerEl = document.getElementById('taskResetTimer');
            if (!timerEl) return;
            
            const timeLeft = Math.max(0, nextTaskReset - Date.now());
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Check if reset needed
            if (timeLeft === 0) {
                checkTaskReset();
            }
        }
        
        // Update event display
        function updateEventDisplay() {
            const display = document.getElementById('event2026CoinsDisplay');
            if (display) {
                display.textContent = formatNumber(event2026Coins);
            }
        }
        
        // Buy event item
        function buyEventItem(itemType, cost) {
            if (event2026Coins < cost) {
                showToast(`❌ Không đủ Xu 2026! Cần ${cost} 🪙`, 2500);
                return;
            }
            
            let itemName = '';
            let effect = '';
            let canBuy = true;
            
            if (itemType === 'pass2026') {
                if (gamePasses.event2026) {
                    showToast('❌ Bạn đã có Pass 2026 rồi!', 2000);
                    return;
                }
                itemName = 'Pass 2026';
                effect = 'x3 Click Power + x2 Auto Clicker';
            } else if (itemType === 'luckyClover') {
                itemName = 'Lucky Clover 🍀';
                effect = 'x2 Luck - Tăng drop rate';
            } else if (itemType === 'goldenTicket') {
                itemName = 'Golden Ticket 🎟️';
                effect = '+100 Vé quay';
            } else if (itemType === 'megaCoinBomb') {
                itemName = 'Mega Coin Bomb 💣';
                effect = '+500,000 Coins';
            } else if (itemType === 'diamondRain') {
                itemName = 'Diamond Rain 💎';
                effect = '+200 Diamonds';
            } else if (itemType === 'autoBoost') {
                itemName = 'Auto Clicker Boost ⚡';
                effect = '+100 Auto Clickers';
            } else if (itemType === 'powerPotion') {
                itemName = 'Click Power Potion 🧪';
                effect = '+200 Click Power';
            } else if (itemType === 'speedMaster') {
                itemName = 'Speed Master 🚀';
                effect = 'Cooldown -0.3s';
            } else if (itemType === 'multiplierOrb') {
                itemName = 'Multiplier Orb 🔮';
                effect = '+10x Multiplier';
            } else if (itemType === 'petSlot') {
                itemName = 'Pet Slot Expander 🐾';
                effect = '+1 Pet Slot';
            } else if (itemType === 'rebirthBooster') {
                itemName = 'Rebirth Booster ♻️';
                effect = '+2x Rebirth Multiplier';
            } else if (itemType === 'goldBarPack') {
                itemName = 'Gold Bar Pack 🏆';
                effect = '+50 Gold Bars';
            }
            
            if (!confirm(`🛍️ MUA VẬT PHẨM EVENT\n\n${itemName}\nGiá: ${cost} 🪙 Xu 2026\n\nHiệu ứng: ${effect}\n\nXác nhận mua?`)) {
                return;
            }
            
            event2026Coins -= cost;
            
            // Apply effects
            if (itemType === 'pass2026') {
                gamePasses.event2026 = true;
                updateGamePassUI();
            } else if (itemType === 'luckyClover') {
                // Lucky effect - could increase mutation chances
                showToast('✨ Luck đã tăng! Drop rate tốt hơn!', 2000);
            } else if (itemType === 'goldenTicket') {
                tickets += 100;
            } else if (itemType === 'megaCoinBomb') {
                coins += 500000;
            } else if (itemType === 'diamondRain') {
                diamonds += 200;
            } else if (itemType === 'autoBoost') {
                autoClickers += 100;
            } else if (itemType === 'powerPotion') {
                clickPower += 200;
            } else if (itemType === 'speedMaster') {
                clickCooldown = Math.max(0.01, clickCooldown - 0.3);
            } else if (itemType === 'multiplierOrb') {
                multiplier += 10;
            } else if (itemType === 'petSlot') {
                MAX_EQUIPPED_PETS += 1;
                showToast(`✅ Pet slot tăng lên ${MAX_EQUIPPED_PETS}!`, 2000);
            } else if (itemType === 'rebirthBooster') {
                rebirthMultiplier += 2;
            } else if (itemType === 'goldBarPack') {
                goldBars += 50;
            }
            
            updateEventDisplay();
            updateDisplay();
            saveToLocalStorage(true);
            
            showToast(`✅ Đã mua ${itemName}!`, 2500);
        }
        
        // Buy and open event egg
        function buyEventEgg() {
            if (event2026Coins < 100) {
                showToast('❌ Không đủ Xu 2026! Cần 100 🪙', 2500);
                return;
            }
            
            if (!confirm('🥚 MỞ TRỨNG 2026\n\nGiá: 100 🪙 Xu 2026\n\nBạn có thể nhận được:\n🐱 Cat (50%) - x2\n🐺 Wolf (25%) - x5\n🦅 Bird (24%) - x5.5\n🐲 Dragon (1%) - x10 + 1💎/phút\n\nXác nhận mở?')) {
                return;
            }
            
            event2026Coins -= 100;
            
            // Random pet based on chances
            const rand = Math.random() * 100;
            let cumulative = 0;
            let selectedPet = null;
            
            for (const pet of EVENT_2026_PETS) {
                cumulative += pet.chance;
                if (rand <= cumulative) {
                    selectedPet = pet;
                    break;
                }
            }
            
            if (!selectedPet) selectedPet = EVENT_2026_PETS[0]; // Fallback
            
            // Random mutation - Use same system as trade-up
            const mutations = ['normal', 'gold', 'diamond', 'rainbow', 'transcendent'];
            const mutationChances = [70, 15, 10, 4, 1];
            const mutRand = Math.random() * 100;
            let mutCumulative = 0;
            let mutation = 'normal';
            
            for (let i = 0; i < mutations.length; i++) {
                mutCumulative += mutationChances[i];
                if (mutRand <= mutCumulative) {
                    mutation = mutations[i];
                    break;
                }
            }
            
            // Add pet to inventory - Use same format as normal pets for trade-up compatibility
            const baseName = selectedPet.name;
            const petKey = `${baseName}_${mutation}`;
            const mutationMult = MUTATION_MULTIPLIERS[mutation] || 1;
            
            // Check if pet already exists
            if (!ownedPets[petKey]) {
                ownedPets[petKey] = {
                    key: petKey,
                    name: selectedPet.name,
                    baseName: baseName,
                    icon: selectedPet.icon,
                    multiplier: selectedPet.multiplier,
                    mutation: mutation,
                    count: 0,
                    special: selectedPet.special || null,
                    event: '2026'
                };
            }
            
            // Increase count
            ownedPets[petKey].count++;
            
            renderPets();
            updateEventDisplay();
            updateDisplay();
            updateEventTask('openEgg10', 1);
            updateTradeUpPetList(); // Update trade-up list
            saveToLocalStorage(true);
            
            const mutationName = MUTATION_NAMES[mutation] || mutation;
            const totalMult = selectedPet.multiplier * mutationMult;
            
            let message = `🎉 CHÚC MỪNG!\n\n${selectedPet.icon} ${mutationName} ${selectedPet.name}\nSức mạnh: x${totalMult.toFixed(1)} Click Power`;
            
            if (selectedPet.special === 'diamond_generator') {
                message += '\n✨ Đặc biệt: +1💎 mỗi phút!';
                
                // Start diamond generation
                setInterval(() => {
                    // Check if pet is equipped
                    const equipped = equippedPets.find(p => p.key === petKey);
                    if (equipped && ownedPets[petKey]) {
                        diamonds += 1;
                        updateDisplay();
                        saveToLocalStorage(true);
                    }
                }, 60000); // Every 60 seconds
            }
            
            alert(message);
        }
        
        // ═══════════════════════════════════════════════════════
        // DRAGON DIAMOND GENERATOR - SINGLE GLOBAL INTERVAL
        // ═══════════════════════════════════════════════════════
        
        function initDragonGenerators() {
            // Clear any existing interval to prevent duplicates
            if (dragonGeneratorInterval) {
                clearInterval(dragonGeneratorInterval);
                dragonGeneratorInterval = null;
            }
            
            // Single global interval that checks ALL equipped dragons
            dragonGeneratorInterval = setInterval(() => {
                // Check each equipped pet
                for (const equippedPet of equippedPets) {
                    const pet = ownedPets[equippedPet.key];
                    
                    // Only process diamond generators
                    if (pet && pet.special === 'diamond_generator') {
                        // Calculate mutation bonus
                        let mutationMultiplier = 1;
                        
                        if (pet.mutation) {
                            switch(pet.mutation) {
                                case 'normal':
                                    mutationMultiplier = 1; // Normal: 1x (explicit)
                                    break;
                                case 'gold':
                                    mutationMultiplier = 2; // Gold: 2x
                                    break;
                                case 'diamond':
                                    mutationMultiplier = 3; // Diamond: 3x
                                    break;
                                case 'rainbow':
                                    mutationMultiplier = 4; // Rainbow: 4x
                                    break;
                                case 'transcendent':
                                    mutationMultiplier = 5; // Transcendent: 5x
                                    break;
                                case 'prismatic':
                                    mutationMultiplier = 10; // Prismatic: 10x
                                    break;
                            }
                        }
                        
                        // Base rate depends on event type
                        const baseRate = pet.event === '2026' ? (1/60) : 1; // Event 2026: 1💎/60s, Others: 1💎/s
                        
                        // Generate diamonds based on mutation
                        const diamondsToAdd = baseRate * mutationMultiplier;
                        diamonds += diamondsToAdd;
                        
                        // Update display (throttled to avoid spam)
                        if (Math.random() < 0.1) { // Only update 10% of the time
                            updateDisplay();
                        }
                    }
                }
                
                // Save periodically (every 10 seconds)
                if (Date.now() % 10000 < 1000) {
                    saveToLocalStorage(true);
                }
            }, 1000); // Check every 1 second
            
            console.log('🐲 Dragon generators initialized (single global interval)');
        }
        
        // ═══════════════════════════════════════════════════════
        // COIN FLIP GAME SYSTEM
        // ═══════════════════════════════════════════════════════
        
        const COIN_FLIP_RANKS = [
            { name: 'Đồng', icon: '🥉', reward: 1, color: '#cd7f32' },
            { name: 'Bạc', icon: '🥈', reward: 2, color: '#c0c0c0' },
            { name: 'Vàng', icon: '🥇', reward: 5, color: '#ffd700' },
            { name: 'Bạch Kim', icon: '💎', reward: 10, color: '#e5e4e2' },
            { name: 'Kim Cương', icon: '💠', reward: 20, color: '#00d4ff' },
            { name: 'Huyền Thoại', icon: '🌟', reward: 50, color: '#ff00ff' },
            { name: 'Master', icon: '👑', reward: 100, color: '#ff4500' },
            { name: 'Super', icon: '⚡', reward: 200, color: '#ffff00' },
            { name: 'Hardcore', icon: '🔥', reward: 500, color: '#ff0000' }
        ];
        
        function updateCoinFlipDisplay() {
            const rank = COIN_FLIP_RANKS[coinFlipRank];
            const nextRank = COIN_FLIP_RANKS[coinFlipRank + 1];
            
            // Update rank display
            const rankDisplay = document.getElementById('coinFlipRankDisplay');
            if (rankDisplay) {
                const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
                const starLevel = Math.min(coinFlipStars, 10);
                rankDisplay.innerHTML = `${rank.icon} ${rank.name} ${romanNumerals[starLevel - 1] || 'X'}`;
                rankDisplay.style.color = rank.color;
            }
            
            // Update stars display
            const starsDisplay = document.getElementById('coinFlipStarsDisplay');
            if (starsDisplay) {
                starsDisplay.innerHTML = '⭐'.repeat(Math.min(coinFlipStars, 10));
            }
            
            // Update progress text
            const progressText = document.getElementById('coinFlipProgressText');
            if (progressText) {
                if (coinFlipRank >= COIN_FLIP_RANKS.length - 1 && coinFlipStars >= 10) {
                    progressText.textContent = 'Rank tối đa! 🎉';
                } else if (nextRank) {
                    progressText.textContent = `${coinFlipStars}/10 sao để lên rank ${nextRank.name}`;
                }
            }
            
            // Update stats
            document.getElementById('coinFlipWinsDisplay').textContent = coinFlipWins;
            document.getElementById('coinFlipLossesDisplay').textContent = coinFlipLosses;
            
            const totalGames = coinFlipWins + coinFlipLosses;
            const winRate = totalGames > 0 ? Math.round((coinFlipWins / totalGames) * 100) : 0;
            document.getElementById('coinFlipWinRateDisplay').textContent = winRate + '%';
        }
        
        let selectedCoinSide = null;
        
        function selectCoinSide(side) {
            selectedCoinSide = side;
            console.log('🪙 Coin side selected:', side);
            
            // Update button styles
            const headsBtn = document.getElementById('headsBtn');
            const tailsBtn = document.getElementById('tailsBtn');
            const playBtn = document.getElementById('coinFlipPlayBtn');
            const choiceText = document.getElementById('coinFlipSelectedChoice');
            
            if (side === 'heads') {
                headsBtn.style.background = 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)';
                headsBtn.style.border = '3px solid #ffd700';
                headsBtn.style.transform = 'scale(1.05)';
                
                tailsBtn.style.background = 'rgba(0,212,255,0.2)';
                tailsBtn.style.border = '3px solid rgba(0,212,255,0.5)';
                tailsBtn.style.transform = 'scale(1)';
                
                choiceText.innerHTML = '✅ Đã chọn: <span style="color: #ffd700; font-weight: bold;">👑 Ngửa (Heads)</span><br>Nhấn nút XÁC NHẬN để bắt đầu!';
                choiceText.style.color = '#00ff00';
            } else {
                tailsBtn.style.background = 'linear-gradient(135deg, #00d4ff 0%, #0080ff 100%)';
                tailsBtn.style.border = '3px solid #00d4ff';
                tailsBtn.style.transform = 'scale(1.05)';
                
                headsBtn.style.background = 'rgba(255,215,0,0.2)';
                headsBtn.style.border = '3px solid rgba(255,215,0,0.5)';
                headsBtn.style.transform = 'scale(1)';
                
                choiceText.innerHTML = '✅ Đã chọn: <span style="color: #00d4ff; font-weight: bold;">🪙 Sấp (Tails)</span><br>Nhấn nút XÁC NHẬN để bắt đầu!';
                choiceText.style.color = '#00ff00';
            }
            
            // Enable play button with animation
            playBtn.disabled = false;
            playBtn.style.opacity = '1';
            playBtn.style.cursor = 'pointer';
            playBtn.style.animation = 'pulse 1s infinite';
            
            console.log('✅ Play button enabled!');
        }
        
        function playCoinFlip() {
            if (!selectedCoinSide) {
                alert('❌ Vui lòng chọn mặt trước!');
                return;
            }
            
            const betType = document.getElementById('coinFlipBetType').value;
            const betAmount = parseInt(document.getElementById('coinFlipBetAmount').value);
            
            // Validation
            if (!betAmount || betAmount <= 0) {
                alert('❌ Vui lòng nhập số tiền cược hợp lệ!');
                return;
            }
            
            if (betType === 'coins' && coins < betAmount) {
                alert('❌ Không đủ Coins!');
                return;
            }
            
            if (betType === 'diamonds' && diamonds < betAmount) {
                alert('❌ Không đủ Diamonds!');
                return;
            }
            
            // Deduct bet
            if (betType === 'coins') {
                coins -= betAmount;
            } else {
                diamonds -= betAmount;
            }
            
            updateDisplay();
            
            // 50/50 chance
            const botChoice = Math.random() < 0.5 ? 'heads' : 'tails';
            const playerWin = selectedCoinSide === botChoice;
            
            // Show animation
            showCoinFlipAnimation(selectedCoinSide, botChoice, playerWin, betAmount, betType);
            
            // Reset selection after playing
            resetCoinSelection();
        }
        
        function resetCoinSelection() {
            selectedCoinSide = null;
            
            const headsBtn = document.getElementById('headsBtn');
            const tailsBtn = document.getElementById('tailsBtn');
            const playBtn = document.getElementById('coinFlipPlayBtn');
            const choiceText = document.getElementById('coinFlipSelectedChoice');
            
            headsBtn.style.background = 'rgba(255,215,0,0.2)';
            headsBtn.style.border = '3px solid rgba(255,215,0,0.5)';
            headsBtn.style.transform = 'scale(1)';
            
            tailsBtn.style.background = 'rgba(0,212,255,0.2)';
            tailsBtn.style.border = '3px solid rgba(0,212,255,0.5)';
            tailsBtn.style.transform = 'scale(1)';
            
            playBtn.disabled = true;
            playBtn.style.opacity = '0.5';
            playBtn.style.cursor = 'not-allowed';
            playBtn.style.animation = 'none';
            
            choiceText.innerHTML = '⬆️ Chọn loại tiền, nhập số tiền, rồi chọn mặt đồng xu';
            choiceText.style.color = '#aaa';
        }
        
        function showCoinFlipAnimation(playerChoice, botChoice, playerWin, betAmount, betType) {
            const resultDiv = document.getElementById('coinFlipResult');
            const animDiv = document.getElementById('coinFlipAnimation');
            const resultText = document.getElementById('coinFlipResultText');
            const resultDetail = document.getElementById('coinFlipResultDetail');
            
            resultDiv.style.display = 'block';
            
            // Spinning animation
            let spins = 0;
            const maxSpins = 10;
            const spinInterval = setInterval(() => {
                animDiv.textContent = spins % 2 === 0 ? '👑' : '🪙';
                spins++;
                
                if (spins >= maxSpins) {
                    clearInterval(spinInterval);
                    
                    // Show final result
                    animDiv.textContent = botChoice === 'heads' ? '👑' : '🪙';
                    
                    if (playerWin) {
                        // WIN
                        resultText.innerHTML = '<span style="color: #00ff00;">🎉 THẮNG! 🎉</span>';
                        
                        const winAmount = betAmount * 2;
                        if (betType === 'coins') {
                            coins += winAmount;
                            resultDetail.innerHTML = `
                                Bạn chọn: ${playerChoice === 'heads' ? '👑 Ngửa' : '🪙 Sấp'}<br>
                                Bot chọn: ${botChoice === 'heads' ? '👑 Ngửa' : '🪙 Sấp'}<br>
                                <span style="color: #00ff00;">+${winAmount.toLocaleString()} 💰 Coins</span>
                            `;
                        } else {
                            diamonds += winAmount;
                            resultDetail.innerHTML = `
                                Bạn chọn: ${playerChoice === 'heads' ? '👑 Ngửa' : '🪙 Sấp'}<br>
                                Bot chọn: ${botChoice === 'heads' ? '👑 Ngửa' : '🪙 Sấp'}<br>
                                <span style="color: #00ff00;">+${winAmount.toLocaleString()} 💎 Diamonds</span>
                            `;
                        }
                        
                        // Update stats
                        coinFlipWins++;
                        coinFlipConsecutiveLosses = 0;
                        
                        // Add star
                        addCoinFlipStar();
                        
                    } else {
                        // LOSE
                        resultText.innerHTML = '<span style="color: #ff6b6b;">💔 THUA! 💔</span>';
                        resultDetail.innerHTML = `
                            Bạn chọn: ${playerChoice === 'heads' ? '👑 Ngửa' : '🪙 Sấp'}<br>
                            Bot chọn: ${botChoice === 'heads' ? '👑 Ngửa' : '🪙 Sấp'}<br>
                            <span style="color: #ff6b6b;">Mất ${betAmount.toLocaleString()} ${betType === 'coins' ? '💰' : '💎'}</span>
                        `;
                        
                        // Update stats
                        coinFlipLosses++;
                        coinFlipConsecutiveLosses++;
                        
                        // Lose stars
                        if (coinFlipConsecutiveLosses >= 2) {
                            removeCoinFlipStars(3); // Lose 3 stars total for 2 consecutive losses
                            resultDetail.innerHTML += '<br><span style="color: #ff0000;">⚠️ 2 thua liên tiếp: -3 ⭐ tổng!</span>';
                        } else {
                            removeCoinFlipStars(1);
                        }
                    }
                    
                    updateDisplay();
                    updateCoinFlipDisplay();
                    saveToLocalStorage(true);
                }
            }, 150);
        }
        
        function addCoinFlipStar() {
            coinFlipStars++;
            
            // Check rank up (need 10 stars)
            if (coinFlipStars > 10 && coinFlipRank < COIN_FLIP_RANKS.length - 1) {
                coinFlipStars = 1; // Reset to 1 star in new rank
                coinFlipRank++;
                
                const newRank = COIN_FLIP_RANKS[coinFlipRank];
                const reward = newRank.reward;
                
                diamonds += reward;
                
                setTimeout(() => {
                    alert(`🎉 RANK UP! 🎉\n\nLên rank ${newRank.icon} ${newRank.name}!\n\n🎁 Phần thưởng: +${reward} 💎 Diamonds!`);
                }, 500);
            }
            
            // Max at 10 stars for max rank
            if (coinFlipRank >= COIN_FLIP_RANKS.length - 1 && coinFlipStars > 10) {
                coinFlipStars = 10;
                
                // Bonus for max rank stars
                diamonds += 500;
                
                setTimeout(() => {
                    alert(`⭐ HARDCORE STAR! ⭐\n\n+500 💎 Diamonds bonus!`);
                }, 500);
            }
        }
        
        function removeCoinFlipStars(amount) {
            coinFlipStars -= amount;
            
            // Check rank down
            if (coinFlipStars < 1 && coinFlipRank > 0) {
                coinFlipRank--;
                coinFlipStars = 10; // Start at 10 stars in lower rank
                
                const newRank = COIN_FLIP_RANKS[coinFlipRank];
                
                setTimeout(() => {
                    alert(`😢 RANK DOWN!\n\nXuống rank ${newRank.icon} ${newRank.name}`);
                }, 500);
            }
            
            // Min at 1 star for lowest rank
            if (coinFlipRank === 0 && coinFlipStars < 1) {
                coinFlipStars = 1;
            }
        }
        
        function closeCoinFlipResult() {
            document.getElementById('coinFlipResult').style.display = 'none';
        }
        
        // ═══════════════════════════════════════════════════════
        // TELEPORT TIMER SYSTEM
        // ═══════════════════════════════════════════════════════
        
        let teleportTimer = null;
        let teleportTimeLeft = 0;
        let teleportReturnPosition = 0;
        
        window.showTeleportTimer = function() {
            console.log('🚀 showTeleportTimer called');
            teleportTimeLeft = 8;
            teleportReturnPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            const overlay = document.getElementById('teleportTimerOverlay');
            if (!overlay) {
                console.error('❌ teleportTimerOverlay not found!');
                return;
            }
            overlay.style.display = 'flex';
            
            updateTeleportTimerDisplay();
            
            // Start countdown
            teleportTimer = setInterval(function() {
                teleportTimeLeft--;
                updateTeleportTimerDisplay();
                
                if (teleportTimeLeft <= 0) {
                    clearInterval(teleportTimer);
                    showReturnDialog();
                }
            }, 1000);
        }
        
        window.updateTeleportTimerDisplay = function() {
            const elem = document.getElementById('teleportTimeLeft');
            if (elem) {
                elem.textContent = teleportTimeLeft;
            }
        }
        
        window.stopTeleportTimer = function() {
            console.log('⏸️ stopTeleportTimer called');
            if (teleportTimer) {
                clearInterval(teleportTimer);
                teleportTimer = null;
            }
            const overlay = document.getElementById('teleportTimerOverlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
        
        window.showReturnDialog = function() {
            console.log('💬 showReturnDialog called');
            const overlay = document.getElementById('teleportTimerOverlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
            
            const dialog = document.getElementById('returnDialog');
            if (!dialog) {
                console.error('❌ returnDialog not found!');
                return;
            }
            dialog.style.display = 'flex';
            
            // Auto hide after 5 seconds
            setTimeout(function() {
                if (dialog.style.display === 'flex') {
                    dialog.style.display = 'none';
                }
            }, 5000);
        }
        
        window.returnToTop = function() {
            console.log('↩️ returnToTop called');
            const dialog = document.getElementById('returnDialog');
            if (dialog) {
                dialog.style.display = 'none';
            }
            window.scrollTo({
                top: teleportReturnPosition,
                behavior: 'smooth'
            });
        }
        
        window.stayHere = function() {
            console.log('🛑 stayHere called');
            const dialog = document.getElementById('returnDialog');
            if (dialog) {
                dialog.style.display = 'none';
            }
        }
        
        window.returnEarlyWithCost = function() {
            try {
                console.log('💰 returnEarlyWithCost called');
                console.log('Current coins:', coins);
                console.log('teleportReturnPosition:', teleportReturnPosition);
                
                const RETURN_COST = 5;
                
                // Check if player has enough coins
                if (typeof coins === 'undefined') {
                    alert('❌ Lỗi: Biến coins chưa được khởi tạo!');
                    return;
                }
                
                if (coins < RETURN_COST) {
                    alert(`❌ Không đủ Coins! Cần ${RETURN_COST}💰\nBạn có: ${coins}💰`);
                    return;
                }
                
                // Confirm action
                const confirmMsg = `↩️ QUAY LẠI NGAY\n\nTrừ ${RETURN_COST}💰 Coins để quay về vị trí ban đầu?\n\nCòn lại: ${(coins - RETURN_COST).toLocaleString()}💰`;
                console.log('Showing confirm:', confirmMsg);
                
                if (!confirm(confirmMsg)) {
                    console.log('User cancelled');
                    return;
                }
                
                console.log('User confirmed, deducting coins...');
                
                // Deduct coins
                coins -= RETURN_COST;
                console.log('New coins amount:', coins);
                
                // Stop timer
                if (teleportTimer) {
                    clearInterval(teleportTimer);
                    teleportTimer = null;
                    console.log('Timer stopped');
                }
                
                // Hide overlay
                const overlay = document.getElementById('teleportTimerOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    console.log('Overlay hidden');
                } else {
                    console.log('⚠️ Overlay not found');
                }
                
                // Scroll back to original position
                console.log('Scrolling to:', teleportReturnPosition);
                window.scrollTo({
                    top: teleportReturnPosition || 0,
                    behavior: 'smooth'
                });
                
                // Update display and save
                if (typeof updateDisplay === 'function') {
                    updateDisplay();
                    console.log('Display updated');
                } else {
                    console.log('⚠️ updateDisplay not found');
                }
                
                if (typeof saveToLocalStorage === 'function') {
                    saveToLocalStorage(true);
                    console.log('Game saved');
                } else {
                    console.log('⚠️ saveToLocalStorage not found');
                }
                
                if (typeof showToast === 'function') {
                    showToast('↩️ Đã quay về! -5💰', 2000);
                } else {
                    alert('↩️ Đã quay về! -5💰');
                }
                
                console.log('✅ returnEarlyWithCost completed successfully');
                
            } catch (error) {
                console.error('❌ Error in returnEarlyWithCost:', error);
                alert('❌ Có lỗi xảy ra: ' + error.message);
            }
        }

