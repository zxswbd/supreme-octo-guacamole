
// ==UserScript==
// @name         Bing Search Automation - Panel Transparan
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Automate Bing searches with a UI panel that shows randomization details.
// @author       zxswbd
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

    // Variabel state (Termasuk variabel baru untuk transparansi)
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
    let currentQueryInfo = 'Menunggu...'; // Variabel baru
    let currentDelayInfo = 0; // Variabel baru

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

    // --- BAGIAN UI ---
    function createUI() {
        const existingUI = document.getElementById('bing-automation-container');
        if (existingUI) existingUI.remove();

        const container = document.createElement('div');
        container.id = 'bing-automation-container';
        container.style.cssText = `
            z-index: 9998;
            font-family: 'Segoe UI', Arial, sans-serif;
            transition: all 0.3s ease;
            background: #1E1E1E;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
        `;

        const settingsPanel = createSettingsPanel();
        const mainPanel = createMainPanel();
        mainPanel.style.flexGrow = '1';

        container.appendChild(settingsPanel);
        container.appendChild(mainPanel);
        document.body.appendChild(container);

        updateUIPosition();
        updateMainPanelDisplay();
        updateRewardDisplay();
        document.getElementById('start-pause-btn').addEventListener('click', toggleScript);
    }

    function updateUIPosition() {
        const container = document.getElementById('bing-automation-container');
        if (!container) return;
        const header = document.querySelector('#b_header') || document.querySelector('header');
        if (header) {
            const headerRect = header.getBoundingClientRect();
            container.style.position = 'fixed';
            container.style.top = `${headerRect.bottom}px`;
            container.style.left = '0px';
            container.style.right = '0px';
            container.style.bottom = '0px';
            container.style.opacity = '1';
        } else {
            container.style.position = 'fixed';
            container.style.top = '70px';
            container.style.left = '0px';
            container.style.right = '0px';
            container.style.bottom = '0px';
            container.style.opacity = '1';
        }
    }

    function createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel';
        settingsPanel.style.cssText = `
            background: linear-gradient(135deg, rgba(50,50,50,0.98), rgba(40,40,40,0.98));
            border: 1px solid #555;
            color: #EAEAEA;
            padding: 25px;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            width: 100%;
            max-width: 700px;
            margin: 0 auto 20px auto;
            box-sizing: border-box;
            flex-shrink: 0;
        `;
        settingsPanel.innerHTML = `
            <div style="margin-bottom: 20px; font-weight: bold; text-align: center; font-size: 24px;">
                ⚙️ Pengaturan
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px; font-size: 18px;">
                    Jumlah Pencarian:
                </label>
                <input type="number" id="max-searches" value="3" min="1" max="200"
                       style="width: 100%; padding: 15px; border: 1px solid #777; background-color: #333; color: white; border-radius: 10px; font-size: 22px; box-sizing: border-box; height: 60px; text-align: center;">
            </div>
            <button id="start-pause-btn" style="
                width: 100%; height: 75px; background: linear-gradient(135deg, #0078d4, #005a9e);
                color: white; border: none; border-radius: 12px; font-size: 26px; font-weight: bold;
                cursor: pointer; box-shadow: 0 4px 15px rgba(0,120,212,0.4); transition: all 0.3s ease;
                margin-top: 10px;">
                🚀 Mulai Script
            </button>
            <button onclick="window.open('https://zxswbd.blogspot.com/2025/07/pencarian-acak-bing-body-font-family.html?m=1', '_blank')" style="
                width: 100%; height: 65px; background: #6c757d;
                color: white; border: none; border-radius: 12px; font-size: 20px;
                cursor: pointer; transition: all 0.3s ease; margin-top: 15px; font-weight: bold;">
                📖 Kunjungi Blog
            </button>
        `;
        return settingsPanel;
    }

    function createMainPanel() {
        const mainPanel = document.createElement('div');
        mainPanel.id = 'main-panel';
        mainPanel.style.cssText = `
            background: rgba(0,0,0,0.3);
            color: white; padding: 20px; border-radius: 15px;
            border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
        `;
        return mainPanel;
    }

    // ### FUNGSI YANG DIUBAH ###
    function updateMainPanelDisplay() {
        const panel = document.getElementById('main-panel');
        if (!panel) return;

        let status = 'Siap Dimulai', statusColor = '#90EE90', statusIcon = '⏸️';
        if (isRunning && !isPaused) { status = 'Sedang Berjalan'; statusColor = '#FFD700'; statusIcon = '▶️'; }
        else if (isPaused) { status = 'Dijeda'; statusColor = '#FFA500'; statusIcon = '⏸️'; }
        else if (currentSearch >= maxSearches && currentSearch > 0) { status = 'Selesai'; statusColor = '#90EE90'; statusIcon = '✅'; }

        const percentage = maxSearches > 0 ? (currentSearch / maxSearches) * 100 : 0;
        const mobile = isMobile();

        // Menambahkan blok "Info Proses"
        panel.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="color: ${statusColor}; font-weight: bold; font-size: ${mobile ? '18px' : '20px'};">${statusIcon} ${status}</div>
                    <div style="font-size: ${mobile ? '16px' : '18px'}; color: #ccc;">${currentSearch}/${maxSearches}</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 10px; margin: 12px 0; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #0078d4, #40E0D0); height: 100%; border-radius: 10px; width: ${percentage}%; transition: width 0.5s ease;"></div>
                </div>
                <div id="countdown-display" style="font-size: ${mobile ? '16px' : '18px'}; color: #E0E0E0; margin: 15px 0; text-align: center; min-height: 24px;"></div>

                <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid #444;">
                    <div style="font-size: 15px; color: #ccc; margin-bottom: 10px; text-align: center; font-weight: bold;">ℹ️ Info Proses Acak</div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span>Kata Kunci:</span><span style="font-weight: bold; color: #40E0D0; max-width: 60%; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${currentQueryInfo}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                        <span>Total Jeda Berikutnya:</span><span style="font-weight: bold; color: #40E0D0;">${currentDelayInfo} detik</span>
                    </div>
                </div>
                <div style="display: ${mobile ? 'block' : 'flex'}; ${mobile ? '' : 'justify-content: space-between;'} margin-top: 20px; font-size: 16px;">
                    <div style="background: rgba(0,120,212,0.2); padding: 15px; border-radius: 8px; ${mobile ? 'margin-bottom: 10px;' : 'flex: 1; margin-right: 10px;'}">
                        <div style="font-size: ${mobile ? '14px' : '15px'}; color: #ccc; margin-bottom: 8px;">📊 Reward Points</div>
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
                    <div style="background: rgba(40,40,40,0.3); padding: 15px; border-radius: 8px; ${mobile ? '' : 'flex: 1;'}">
                        <div style="font-size: ${mobile ? '14px' : '15px'}; color: #ccc; margin-bottom: 8px;">📈 Statistik</div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="color: #90EE90;">✓ Berhasil:</span><span style="font-weight: bold; color: #90EE90;">${successfulSearches}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #FFB6C1;">✗ Gagal:</span><span style="font-weight: bold; color: #FFB6C1;">${unsuccessfulSearches}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- SISA LOGIKA SCRIPT (Dengan Sedikit Perubahan) ---
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
                countdownElement.innerHTML = `⏰ Hitung Mundur Visual: <strong>${minutes}:${secs.toString().padStart(2, '0')}</strong>`;
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
        currentQueryInfo = 'Menunggu...';
        currentDelayInfo = 0;
        updateMainPanelDisplay();
        console.log('Script dihentikan');
    }

    // ### FUNGSI YANG DIUBAH ###
    function performSearch() {
        if (!isRunning || isPaused || currentSearch >= maxSearches) {
            if (currentSearch >= maxSearches) stopScript();
            return;
        }

        const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
        currentQueryInfo = randomQuery; // Memperbarui info kata kunci
        updateMainPanelDisplay(); // Menampilkan kata kunci di panel
        console.log(`Memulai pencarian ${currentSearch + 1}/${maxSearches} dengan query: ${randomQuery}`);

        const searchBox = document.querySelector('#sb_form_q') || document.querySelector('input[name="q"]') || document.querySelector('input[type="search"]') || document.querySelector('.b_searchbox');
        const searchButton = document.querySelector('#search_icon') || document.querySelector('input[type="submit"]') || document.querySelector('.b_searchboxSubmit') || document.querySelector('[aria-label*="Search"]');

        if (!searchBox) {
            console.error('Search box tidak ditemukan');
            unsuccessfulSearches++;
            scheduleNextSearch();
            return;
        }

        const pointsBefore = getRewardPoints();
        searchBox.value = '';
        searchBox.focus();

        setTimeout(() => {
            searchBox.value = randomQuery;
            searchBox.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                if (searchButton && searchButton.style.display !== 'none') {
                    searchButton.click();
                } else {
                    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true });
                    searchBox.dispatchEvent(enterEvent);
                    const form = searchBox.closest('form');
                    if (form) form.submit();
                }
                currentSearch++;
                setTimeout(() => {
                    const pointsAfter = getRewardPoints();
                    if (pointsBefore !== null && pointsAfter !== null && pointsAfter > pointsBefore) {
                        successfulSearches++;
                    } else {
                        unsuccessfulSearches++;
                    }
                    updateRewardDisplay();
                    scheduleNextSearch();
                }, 3000);
            }, 500);
        }, 300);
    }

    // ### FUNGSI YANG DIUBAH ###
    function scheduleNextSearch() {
        if (!isRunning || isPaused || currentSearch >= maxSearches) return;
        const minDelay = 5, maxDelay = 60;
        const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        currentDelayInfo = randomDelay; // Memperbarui info jeda
        updateMainPanelDisplay(); // Menampilkan info jeda di panel
        console.log(`Jeda total ${randomDelay} detik sebelum pencarian berikutnya`);

        const countdownTime = Math.floor(Math.random() * 6) + 10;
        // Jeda 'diam' sebelum hitung mundur visual dimulai
        const silentDelay = (randomDelay - countdownTime) * 1000;

        if (silentDelay > 0) {
            searchInterval = setTimeout(() => {
                if (!isPaused && isRunning) startCountdown(countdownTime, performSearch);
            }, silentDelay);
        } else {
            // Jika jeda acak lebih kecil dari waktu hitung mundur, langsung mulai hitung mundur
            startCountdown(randomDelay, performSearch);
        }
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
        setInterval(updateRewardDisplay, 3000);
        window.addEventListener('resize', updateUIPosition);
        window.addEventListener('scroll', updateUIPosition);
    }

    init();
    console.log('Bing Search Automation Script (Transparency Layout by zxswbd) loaded successfully!');

})();
