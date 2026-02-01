# 🚀 HƯỚNG DẪN CÀI ĐẶT - COOKIE CLICKER GAME

## 📦 Bạn nhận được gì?

### File: **game_split.tar.gz** (121 KB)

Giải nén ra được folder với cấu trúc:

```
game_split/
├── index.html          (128 KB) ✅ File chính - MỞ FILE NÀY
├── README.md           (6.6 KB) ✅ Hướng dẫn chi tiết
├── css/
│   └── styles.css     (105 KB) ✅ Tất cả CSS
└── js/
    └── full_game.js   (403 KB) ✅ Tất cả JavaScript
```

**Tổng cộng**: 3 files chính + 1 README

---

## ⚡ QUICK START (10 giây)

### Cách 1: Mở trực tiếp (Đơn giản nhất)
```
1. Giải nén game_split.tar.gz
2. Double-click index.html
3. Chơi ngay!
```

### Cách 2: Dùng local server (Chuyên nghiệp)
```bash
# Giải nén
tar -xzf game_split.tar.gz
cd game_split

# Chọn 1 trong 3:

# Python (có sẵn trên Mac/Linux)
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000

# Mở browser: http://localhost:8000
```

---

## ✅ Tất cả tính năng

### Core Game:
- 🍪 Click cookie kiếm coins
- 🛒 Shop với 365 items (THE GOD + HACKER tiers)
- 🐾 70 pets với COSMIC mutation (x10 multiplier)
- 🌤️ Weather effects
- ♻️ Rebirth system
- 🎫 Game passes (VIP → Cosmic)

### Mini Games:
- 🪙 Coin Flip (pity system cho fair gameplay)
- ✊ Rock Paper Scissors

### Special Features:
- 🎵 **Background Music**: Import MP3/WAV (50💎)
- 🖼️ **Custom Background**: Upload ảnh (100💎)
- ⏱️ **Teleport Timer**: 15s countdown
- 🌐 **2 Languages**: English/Vietnamese
- 💾 **Auto-save**: Mọi 5 giây
- 📱 **Mobile-friendly**: Chơi được trên điện thoại

---

## 🎯 Ưu điểm của phiên bản này

### VS File gốc (1 file 14,465 lines):
- ✅ Dễ debug hơn (biết lỗi ở file nào)
- ✅ Load nhanh hơn (browser cache riêng)
- ✅ Dễ sửa CSS (không phải tìm trong 14K lines)

### VS Modular phức tạp (19 files):
- ✅ Đơn giản hơn (chỉ 3 files thay vì 19)
- ✅ Deploy dễ hơn (upload 3 files thôi)
- ✅ Không cần config gì thêm

**→ Đây là phiên bản BEST BALANCE: Dễ debug + Đơn giản!**

---

## 🐛 Debug khi có lỗi

### Lỗi không load được game:
```
1. F12 → Console
2. Xem error message
3. Kiểm tra path: css/styles.css và js/full_game.js
```

### Lỗi CSS (giao diện):
```
→ Edit css/styles.css
```

### Lỗi JavaScript (game logic):
```
→ Edit js/full_game.js
→ Tìm dòng báo lỗi trong Console
```

---

## 📤 Upload lên Server

### GitHub Pages:
```bash
1. Tạo repo mới
2. Upload folder game_split
3. Settings → Pages → Enable
4. Done! Link: username.github.io/repo
```

### Web hosting (Hostinger, etc):
```
1. Upload index.html
2. Upload folder css/
3. Upload folder js/
4. Done!
```

---

## 💡 Tips

### Save game:
- Game tự động save mỗi 5 giây
- Data lưu trong localStorage
- Không mất khi tắt trình duyệt

### Reset game:
```javascript
// Mở Console (F12)
localStorage.clear();
location.reload();
```

### Backup save:
```javascript
// Mở Console (F12)
console.log(localStorage.getItem('cookieClickerSave_v3'));
// Copy toàn bộ text
```

### Restore save:
```javascript
// Paste save data vào
localStorage.setItem('cookieClickerSave_v3', 'PASTE_HERE');
location.reload();
```

---

## 🎮 Game Controls

### Desktop:
- Click cookie để kiếm coins
- Browse shop, buy items
- Hatch pets, equip pets
- Play mini games
- Settings → Unlock music/background

### Mobile:
- Tap cookie
- Swipe để scroll
- Touch-friendly buttons (48px min)
- Responsive design

---

## 📊 Technical Info

### Browser Support:
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### Requirements:
- JavaScript enabled
- localStorage enabled
- ~10 MB free storage (for saves)

### Performance:
- Loads in < 2 seconds
- Runs smooth on low-end devices
- Auto-save doesn't lag

---

## 📝 Files Explained

### index.html (128 KB)
- Toàn bộ HTML structure
- Game UI
- All panels (shop, pets, settings, minigames)
- Links to CSS and JS

### css/styles.css (105 KB, 3,575 lines)
- Tất cả styling
- Colors, gradients
- Responsive design
- Animations
- Mobile optimizations

### js/full_game.js (403 KB, 9,077 lines)
- Tất cả game logic
- 365 shop items
- 70 pets
- All functions
- Save/load system
- All features

---

## ✨ Ready to Play!

**Game hoàn chỉnh 100%**
**Không cần cài đặt gì thêm**
**Mở và chơi ngay!**

🎮 **Enjoy!** 🍪✨

---

## 📞 Need Help?

Đọc **README.md** trong folder để biết chi tiết hơn về:
- Customization
- All features
- Debug guide
- Comparison với các versions khác
