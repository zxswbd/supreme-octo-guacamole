// ==UserScript==
// @name         Bing Search Automation - Panel di Bawah Pencarian
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Automate Bing searches with UI positioned under the search bar.
// @author       You (Layout modification by Gemini)
// @match        https://www.bing.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Daftar 200 pencarian (Tidak diubah)
    const searchQueries = [
        "cara memasak nasi goreng", "resep rendang padang", "tutorial photoshop", "tips belajar bahasa inggris",
        "sejarah indonesia", "teknologi terbaru 2024", "cara membuat website", "tips kesehatan",
        "olahraga di rumah", "resep kue brownies", "cara investasi saham", "belajar programming",
        "wisata indonesia", "kuliner nusantara", "fashion terkini", "gadget terbaru",
        "film terbaik 2024", "musik indonesia", "berita hari ini", "cuaca jakarta",
        "harga emas hari ini", "kurs dollar", "jadwal kereta api", "cara diet sehat",
        "tips kecantikan", "perawatan wajah", "gaya hidup sehat", "makanan bergizi",
        "vitamin untuk imun", "cara tidur nyenyak", "mengatasi stress", "yoga untuk pemula",
        "meditasi harian", "cara berhenti merokok", "manfaat air putih", "olahraga kardio",
        "latihan kekuatan", "stretching rutin", "cara menurunkan berat badan", "diet keto",
        "intermittent fasting", "superfood indonesia", "antioksidan alami", "herbal tradisional",
        "jamu untuk kesehatan", "tanaman obat", "aromaterapi", "essential oil",
        "cara mengatasi insomnia", "tips produktif", "manajemen waktu", "skill komunikasi",
        "public speaking", "leadership", "teamwork", "problem solving",
        "critical thinking", "kreativitas", "inovasi", "entrepreneurship",
        "bisnis online", "digital marketing", "social media marketing", "SEO tips",
        "content marketing", "email marketing", "affiliate marketing", "dropshipping",
        "e-commerce", "marketplace", "fintech", "cryptocurrency",
        "blockchain technology", "artificial intelligence", "machine learning", "data science",
        "cloud computing", "cybersecurity", "internet of things", "5G technology",
        "virtual reality", "augmented reality", "robotics", "automation",
        "renewable energy", "solar panel", "electric vehicle", "sustainable living",
        "zero waste", "recycling", "environmental protection", "climate change",
        "global warming", "conservation", "biodiversity", "ecosystem",
        "wildlife protection", "marine life", "forest conservation", "green technology",
        "organic farming", "permaculture", "urban gardening", "hydroponics",
        "vertical farming", "sustainable agriculture", "food security", "water conservation",
        "clean water", "sanitation", "public health", "pandemic prevention",
        "vaccine development", "medical research", "healthcare innovation", "telemedicine",
        "mental health", "psychology", "counseling", "therapy",
        "mindfulness", "emotional intelligence", "self improvement", "personal development",
        "life coaching", "motivation", "goal setting", "habit formation",
        "time management", "productivity hacks", "work life balance", "remote work",
        "freelancing", "gig economy", "career development", "job interview tips",
        "resume writing", "networking", "professional skills", "industry trends",
        "market analysis", "economic forecast", "investment strategy", "retirement planning",
        "insurance", "tax planning", "budgeting", "saving money",
        "frugal living", "minimalism", "decluttering", "organization",
        "home improvement", "interior design", "architecture", "real estate",
        "property investment", "mortgage", "home buying", "renovation",
        "DIY projects", "woodworking", "gardening", "landscaping",
        "pet care", "dog training", "cat behavior", "aquarium",
        "bird watching", "wildlife photography", "nature", "hiking",
        "camping", "outdoor activities", "adventure sports", "travel tips",
        "backpacking", "budget travel", "luxury travel", "cultural tourism",
        "historical sites", "museums", "art galleries", "festivals",
        "local cuisine", "street food", "fine dining", "cooking techniques",
        "baking", "pastry", "desserts", "beverages",
        "coffee culture", "tea ceremony", "wine tasting", "craft beer",
        "cocktails", "mixology", "food photography", "recipe development",
        "nutrition facts", "calorie counting", "macro nutrients", "supplements",
        "protein powder", "pre workout", "post workout", "recovery",
        "injury prevention", "physical therapy", "massage", "acupuncture",
        "chiropractic", "alternative medicine", "holistic health", "wellness",
        "spa treatments", "skincare routine", "anti aging", "sunscreen",
        "makeup tutorials", "hair care", "nail art", "fashion trends",
        "style guide", "wardrobe essentials", "sustainable fashion", "vintage clothing",
        "luxury brands", "designer fashion", "street style", "accessories",
        "jewelry", "watches", "handbags", "shoes",
        "sneakers", "athletic wear", "formal wear", "casual outfit",
        "seasonal fashion", "color coordination", "body type", "personal style",
        "photography tips", "camera settings", "lighting techniques", "photo editing",
        "video editing", "content creation", "social media tips", "blogging",
        "web design", "graphic design", "user experience", "mobile apps",
        "software development", "coding bootcamp", "data analysis", "excel tips",
        "microsoft office", "google workspace", "productivity apps", "time tracking",
        "project management", "agile methodology", "scrum", "kanban",
        "remote work tools", "video conferencing", "collaboration", "team building",
        "public relations", "brand management", "customer service", "sales techniques",
        "negotiation skills", "presentation skills", "storytelling", "copywriting",
        "content strategy", "influencer marketing", "viral marketing", "growth hacking",
        "startup funding", "venture capital", "angel investors", "crowdfunding",
        "business plan", "market research", "competitive analysis", "SWOT analysis",
        "financial planning", "cash flow", "profit margin", "ROI calculation",
        "accounting basics", "bookkeeping", "invoicing", "expense tracking",
        "legal advice", "intellectual property", "trademark", "copyright",
        "contract law", "employment law", "business registration", "licensing",
        "sustainability", "corporate responsibility", "ethical business", "social impact"
    ];

    // Variabel state (Tidak diubah)
    let isRunning = false;
    let isPaused = false;
    let currentSearch = 0;
    let maxSearches = 3;
    let countdownInterval;
    let searchInterval;
    let initialRewardPoints = null;
    let currentRewardPoints = null;
    let successfulSearches = 0;
    let unsuccessfulSearches = 0;
    let countdownSeconds = 0;

    // Fungsi helper (Tidak diubah)
    function isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function getRewardPoints() {
        const selectors = [
            '[data-testid="rewards-points"]', '.id_rc', '#id_rc', '[id*="reward"]', '[class*="reward"]',
            '[class*="points"]', '.rewards-icon + span', '#rewards .points', '.muid-rebrand .points', '.top-bar .points'
        ];
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent || element.innerText;
                const points = text.match(/\d+/);
                if (points) return parseInt(points[0]);
            }
        }
        const topElements = document.querySelectorAll('header *, nav *, .header *, .top-bar *, [class*="top"] *');
        for (let element of topElements) {
            const text = element.textContent || element.innerText;
            if (text && text.match(/^\d+$/) && text.length > 0 && text.length < 6) {
                const points = parseInt(text);
                if (points > 0 && points < 100000) return points;
            }
        }
        return null;
    }

    // --- BAGIAN UI YANG DIMODIFIKASI ---

    // Fungsi untuk membuat UI utama
    function createUI() {
        const existingUI = document.getElementById('bing-automation-container');
        if (existingUI) existingUI.remove();

        // Container utama untuk semua elemen UI
        const container = document.createElement('div');
        container.id = 'bing-automation-container';
        container.style.cssText = `
            position: absolute;
            z-index: 9999;
            font-family: 'Segoe UI', Arial, sans-serif;
            transition: all 0.3s ease;
        `;

        // Panel Pengaturan
        const settingsPanel = createSettingsPanel();
        // Panel Utama (Status)
        const mainPanel = createMainPanel();

        container.appendChild(settingsPanel);
        container.appendChild(mainPanel);
        document.body.appendChild(container);

        // Posisikan UI di bawah kolom pencarian
        updateUIPosition();

        // Update tampilan data
        updateMainPanelDisplay();
        updateRewardDisplay();

        // Event listeners
        document.getElementById('start-pause-btn').addEventListener('click', toggleScript);
    }

    // Fungsi untuk memposisikan ulang seluruh UI
    function updateUIPosition() {
        const container = document.getElementById('bing-automation-container');
        if (!container) return;

        const searchForm = document.querySelector('#sb_form') || document.querySelector('.b_searchboxForm');
        if (searchForm) {
            const rect = searchForm.getBoundingClientRect();
            const scrollY = window.scrollY;

            container.style.top = `${rect.bottom + scrollY + 5}px`; // 5px jarak dari bawah form
            container.style.left = `${rect.left}px`;
            container.style.width = `${rect.width}px`;
            container.style.opacity = '1';
        } else {
            container.style.opacity = '0'; // Sembunyikan jika form tidak ditemukan
        }
    }

    // Fungsi untuk membuat panel pengaturan
    function createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel';
        settingsPanel.style.cssText = `
            background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(245,245,245,0.98));
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            margin-bottom: 10px; /* Jarak ke panel utama */
        `;

        settingsPanel.innerHTML = `
            <div style="margin-bottom: 12px; color: #333; font-weight: bold; text-align: center; font-size: 16px;">
                ⚙️ Pengaturan
            </div>
            <div style="margin-bottom: 12px;">
                <label style="color: #333; display: block; margin-bottom: 5px; font-size: 13px;">
                    Jumlah Pencarian:
                </label>
                <input type="number" id="max-searches" value="3" min="1" max="200"
                       style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
            </div>
            <button id="start-pause-btn" style="
                width: 100%; height: 45px; background: linear-gradient(135deg, #0078d4, #005a9e);
                color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: bold;
                cursor: pointer; box-shadow: 0 4px 15px rgba(0,120,212,0.4); transition: all 0.3s ease;">
                🚀 Mulai Script
            </button>
            <div style="margin-top: 8px; font-size: 12px; color: #666; text-align: center;">
                Script otomatis dengan jeda acak
            </div>
        `;
        return settingsPanel;
    }

    // Fungsi untuk membuat panel utama (status)
    function createMainPanel() {
        const mainPanel = document.createElement('div');
        mainPanel.id = 'main-panel';
        mainPanel.style.cssText = `
            background: linear-gradient(135deg, rgba(0,0,0,0.92), rgba(40,40,40,0.92));
            color: white; padding: 20px; border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4); backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;
        `;
        return mainPanel;
    }

    // Fungsi untuk mengupdate tampilan panel utama (status)
    function updateMainPanelDisplay() {
        const panel = document.getElementById('main-panel');
        if (!panel) return;

        let status = 'Siap Dimulai', statusColor = '#90EE90', statusIcon = '⏸️';
        if (isRunning && !isPaused) { status = 'Sedang Berjalan'; statusColor = '#FFD700'; statusIcon = '▶️'; }
        else if (isPaused) { status = 'Dijeda'; statusColor = '#FFA500'; statusIcon = '⏸️'; }
        else if (currentSearch >= maxSearches && currentSearch > 0) { status = 'Selesai'; statusColor = '#90EE90'; statusIcon = '✅'; }

        const percentage = maxSearches > 0 ? (currentSearch / maxSearches) * 100 : 0;
        const mobile = isMobile();

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div style="color: ${statusColor}; font-weight: bold; font-size: ${mobile ? '14px' : '16px'};">${statusIcon} ${status}</div>
                <div style="font-size: ${mobile ? '12px' : '14px'}; color: #ccc;">${currentSearch}/${maxSearches}</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 8px; margin: 12px 0; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #0078d4, #40E0D0); height: 100%; border-radius: 10px; width: ${percentage}%; transition: width 0.5s ease;"></div>
            </div>
            <div id="countdown-display" style="font-size: ${mobile ? '12px' : '14px'}; color: #E0E0E0; margin: 10px 0; text-align: center; min-height: 20px;"></div>
            <div style="display: ${mobile ? 'block' : 'flex'}; ${mobile ? '' : 'justify-content: space-between;'} margin-top: 15px;">
                <div style="background: rgba(0,120,212,0.2); padding: 12px; border-radius: 8px; ${mobile ? 'margin-bottom: 10px;' : 'flex: 1; margin-right: 10px;'}">
                    <div style="font-size: ${mobile ? '11px' : '12px'}; color: #ccc; margin-bottom: 5px;">📊 Reward Points</div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Awal:</span><span style="font-weight: bold; color: #40E0D0;">${initialRewardPoints || '...'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Sekarang:</span><span style="font-weight: bold; color: #40E0D0;">${currentRewardPoints || '...'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Perubahan:</span><span style="font-weight: bold; color: ${getPointsChange() > 0 ? '#90EE90' : '#FFB6C1'};">${getPointsChange() > 0 ? '+' : ''}${getPointsChange()}</span>
                    </div>
                </div>
                <div style="background: rgba(40,40,40,0.3); padding: 12px; border-radius: 8px; ${mobile ? '' : 'flex: 1;'}">
                    <div style="font-size: ${mobile ? '11px' : '12px'}; color: #ccc; margin-bottom: 5px;">📈 Statistik</div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span style="color: #90EE90;">✓ Berhasil:</span><span style="font-weight: bold; color: #90EE90;">${successfulSearches}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #FFB6C1;">✗ Gagal:</span><span style="font-weight: bold; color: #FFB6C1;">${unsuccessfulSearches}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // --- SISA LOGIKA SCRIPT (TIDAK DIUBAH) ---

    function getPointsChange() {
        return (initialRewardPoints !== null && currentRewardPoints !== null) ? currentRewardPoints - initialRewardPoints : 0;
    }

    function updateRewardDisplay() {
        currentRewardPoints = getRewardPoints();
        updateMainPanelDisplay();
    }

    function startCountdown(seconds, callback) {
        countdownSeconds = seconds;
        countdownInterval = setInterval(() => {
            if (isPaused) return;
            const countdownElement = document.getElementById('countdown-display');
            if (countdownElement) {
                const minutes = Math.floor(countdownSeconds / 60);
                const secs = countdownSeconds % 60;
                countdownElement.innerHTML = `⏰ Pencarian berikutnya: <strong>${minutes}:${secs.toString().padStart(2, '0')}</strong>`;
            }
            countdownSeconds--;
            if (countdownSeconds < 0) {
                clearInterval(countdownInterval);
                if (callback && !isPaused) callback();
            }
        }, 1000);
    }

    function toggleScript() {
        const button = document.getElementById('start-pause-btn');
        if (!isRunning) {
            startScript();
            button.innerHTML = '⏸️ Jeda Script';
            button.style.background = 'linear-gradient(135deg, #d83b01, #b12e00)';
        } else if (!isPaused) {
            pauseScript();
            button.innerHTML = '▶️ Lanjutkan';
            button.style.background = 'linear-gradient(135deg, #107c10, #0e6e0e)';
        } else {
            resumeScript();
            button.innerHTML = '⏸️ Jeda Script';
            button.style.background = 'linear-gradient(135deg, #d83b01, #b12e00)';
        }
    }

    function startScript() {
        isRunning = true;
        isPaused = false;
        currentSearch = 0;
        successfulSearches = 0;
        unsuccessfulSearches = 0;
        const maxSearchInput = document.getElementById('max-searches');
        if (maxSearchInput) maxSearches = parseInt(maxSearchInput.value) || 3;
        initialRewardPoints = getRewardPoints();
        updateMainPanelDisplay();
        console.log('Script dimulai - Initial points:', initialRewardPoints);
        performSearch();
    }

    function pauseScript() {
        isPaused = true;
        clearInterval(countdownInterval);
        clearTimeout(searchInterval);
        const countdownElement = document.getElementById('countdown-display');
        if (countdownElement) countdownElement.innerHTML = '⏸️ <strong>Script dijeda...</strong>';
        updateMainPanelDisplay();
        console.log('Script dijeda');
    }

    function resumeScript() {
        isPaused = false;
        updateMainPanelDisplay();
        console.log('Script dilanjutkan');
        setTimeout(() => {
            if (!isPaused && isRunning && currentSearch < maxSearches) performSearch();
        }, 2000);
    }

    function stopScript() {
        isRunning = false;
        isPaused = false;
        clearInterval(countdownInterval);
        clearTimeout(searchInterval);
        const button = document.getElementById('start-pause-btn');
        button.innerHTML = '🚀 Mulai Script';
        button.style.background = 'linear-gradient(135deg, #0078d4, #005a9e)';
        const countdownElement = document.getElementById('countdown-display');
        if (countdownElement) countdownElement.innerHTML = '';
        updateMainPanelDisplay();
        console.log('Script dihentikan');
    }

    function performSearch() {
        if (!isRunning || isPaused || currentSearch >= maxSearches) {
            if (currentSearch >= maxSearches) {
                stopScript();
                setTimeout(() => {
                    const finalPoints = getRewardPoints();
                    const totalChange = finalPoints && initialRewardPoints ? finalPoints - initialRewardPoints : 0;
                    alert(`🎉 Script selesai!\n\n` +
                          `📊 Statistik:\n` +
                          `• Total pencarian: ${maxSearches}\n` +
                          `• Berhasil mengubah points: ${successfulSearches}\n` +
                          `• Tidak mengubah points: ${unsuccessfulSearches}\n` +
                          `• Total perubahan points: ${totalChange > 0 ? '+' : ''}${totalChange}`);
                }, 1000);
            }
            return;
        }

        console.log(`Memulai pencarian ${currentSearch + 1}/${maxSearches}`);
        const searchBox = document.querySelector('#sb_form_q') || document.querySelector('input[name="q"]') ||
                          document.querySelector('input[type="search"]') || document.querySelector('.b_searchbox');
        const searchButton = document.querySelector('#search_icon') || document.querySelector('input[type="submit"]') ||
                             document.querySelector('.b_searchboxSubmit') || document.querySelector('[aria-label*="Search"]');

        if (!searchBox) {
            console.error('Search box tidak ditemukan');
            unsuccessfulSearches++;
            scheduleNextSearch();
            return;
        }

        const pointsBefore = getRewardPoints();
        console.log('Points sebelum pencarian:', pointsBefore);
        const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
        console.log('Query:', randomQuery);
        searchBox.value = '';
        searchBox.focus();

        setTimeout(() => {
            searchBox.value = randomQuery;
            searchBox.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                if (searchButton && searchButton.style.display !== 'none') {
                    searchButton.click();
                    console.log('Klik tombol search');
                } else {
                    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true });
                    searchBox.dispatchEvent(enterEvent);
                    const form = searchBox.closest('form');
                    if (form) form.submit();
                    console.log('Submit dengan Enter key');
                }
                currentSearch++;
                updateMainPanelDisplay();
                setTimeout(() => {
                    const pointsAfter = getRewardPoints();
                    console.log('Points setelah pencarian:', pointsAfter);
                    if (pointsBefore !== null && pointsAfter !== null && pointsAfter > pointsBefore) {
                        successfulSearches++;
                        console.log('✓ Points bertambah:', pointsAfter - pointsBefore);
                    } else {
                        unsuccessfulSearches++;
                        console.log('✗ Points tidak berubah');
                    }
                    updateRewardDisplay();
                    scheduleNextSearch();
                }, 3000);
            }, 500);
        }, 300);
    }

    function scheduleNextSearch() {
        if (!isRunning || isPaused || currentSearch >= maxSearches) return;
        const minDelay = 5, maxDelay = 60;
        const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        console.log(`Jeda ${randomDelay} detik sebelum pencarian berikutnya`);
        const countdownTime = Math.floor(Math.random() * 6) + 10;
        searchInterval = setTimeout(() => {
            if (!isPaused && isRunning) startCountdown(countdownTime, performSearch);
        }, (randomDelay - countdownTime) * 1000);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
        setInterval(updateRewardDisplay, 5000);
        // Handle resize dan scroll untuk menjaga posisi UI
        window.addEventListener('resize', updateUIPosition);
        window.addEventListener('scroll', updateUIPosition);
    }

    init();
    console.log('Bing Search Automation Script (Layout by Gemini) loaded successfully!');

})();
