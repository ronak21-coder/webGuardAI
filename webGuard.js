/* =========================================================
       WEBGUARD AI - FRONTEND LOGIC
    ========================================================= */

    const urlInput = document.getElementById("urlInput");
    const scanButton = document.getElementById("scanButton");
    const contentToggle = document.getElementById("contentToggle");

    const result = document.getElementById("result");
    const resultUrl = document.getElementById("resultUrl");
    const riskBadge = document.getElementById("riskBadge");
    const score = document.getElementById("score");
    const scoreFill = document.getElementById("scoreFill");
    const resultDetails = document.getElementById("resultDetails");

    const historyList = document.getElementById("historyList");

    const totalScans = document.getElementById("totalScans");
    const lowRisk = document.getElementById("lowRisk");
    const highRisk = document.getElementById("highRisk");

    const toast = document.getElementById("toast");

    const mobileMenu = document.getElementById("mobileMenu");
    const nav = document.getElementById("nav");


    /* =========================================================
       STORAGE
    ========================================================= */

    let scanHistory =
        JSON.parse(localStorage.getItem("webguardHistory")) || [];


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    mobileMenu.addEventListener("click", () => {

        nav.classList.toggle("open");

    });


    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

        });

    });


    /* =========================================================
       TOAST
    ========================================================= */

    function showToast(message) {

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(window.toastTimer);

        window.toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 3200);
    }


    /* =========================================================
       URL VALIDATION
    ========================================================= */

    function normalizeUrl(value) {

        let url = value.trim();

        if (!url) {
            return null;
        }

        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }

        try {

            const parsed = new URL(url);

            if (!parsed.hostname || !parsed.hostname.includes(".")) {
                return null;
            }

            return parsed;

        } catch {

            return null;

        }
    }


    /* =========================================================
       SIMULATED AI ANALYSIS
       
       IMPORTANT:
       This is frontend simulation only.
       Connect this function to your backend ML API for
       real Random Forest predictions.
    ========================================================= */

    function analyzeWebsite(url, analyzeContent) {

        let risk = 10;

        const hostname = url.hostname.toLowerCase();

        /* Suspicious keywords */

        const suspiciousWords = [
            "login",
            "verify",
            "account",
            "secure",
            "update",
            "confirm",
            "wallet",
            "bonus",
            "free",
            "gift",
            "crypto"
        ];

        suspiciousWords.forEach(word => {

            if (hostname.includes(word)) {
                risk += 7;
            }

        });


        /* IP based URL */

        if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {

            risk += 28;

        }


        /* URL length */

        if (url.href.length > 90) {

            risk += 10;

        }


        /* Query parameters */

        if (url.search.length > 45) {

            risk += 8;

        }


        /* Optional content analysis */

        if (analyzeContent) {

            risk += Math.floor(Math.random() * 15);

        }


        /* Randomized model noise */

        risk += Math.floor(Math.random() * 12) - 5;


        risk = Math.max(2, Math.min(97, risk));


        let level;

        if (risk < 30) {

            level = "low";

        } else if (risk < 65) {

            level = "medium";

        } else {

            level = "high";

        }


        return {
            risk,
            level,
            hostname,
            analyzedContent: analyzeContent
        };

    }


    /* =========================================================
       SCAN
    ========================================================= */

    scanButton.addEventListener("click", performScan);


    urlInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            performScan();

        }

    });


    function performScan() {

        const url = normalizeUrl(urlInput.value);

        if (!url) {

            showToast(
                "Please enter a valid website URL, such as https://example.com"
            );

            urlInput.focus();

            return;

        }


        /* Loading state */

        scanButton.classList.add("loading");

        scanButton.innerHTML = `
            <span class="spinner"></span>
            <span>Analyzing...</span>
        `;


        result.classList.remove("show");


        /* Simulate ML processing */

        setTimeout(() => {

            const analysis =
                analyzeWebsite(
                    url,
                    contentToggle.checked
                );


            displayResult(url, analysis);

            saveScan(url, analysis);

            updateDashboard();

            renderHistory();


            scanButton.classList.remove("loading");

            scanButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none">
                    <path
                        d="M4 8V5C4 4.4 4.4 4 5 4H8M16 4H19C19.6 4 20 4.4 20 5V8M20 16V19C20 19.6 19.6 20 19 20H16M8 20H5C4.4 20 4 19.6 4 19V16"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                    />
                    <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        stroke-width="1.7"
                    />
                </svg>
                <span>Scan Website</span>
            `;


            showToast(
                `Scan completed — ${analysis.level.toUpperCase()} risk`
            );

        }, 1400);

    }


    /* =========================================================
       DISPLAY RESULT
    ========================================================= */

    function displayResult(url, analysis) {

        resultUrl.textContent = url.hostname;

        score.textContent = analysis.risk;

        scoreFill.style.width = "0%";


        /* reset badge */

        riskBadge.className = "risk-badge";


        if (analysis.level === "low") {

            riskBadge.textContent = "Low Risk";
            riskBadge.classList.add("risk-low");

            resultDetails.textContent =
                "The website characteristics appear relatively low risk based on the simulated model assessment.";

        }

        else if (analysis.level === "medium") {

            riskBadge.textContent = "Medium Risk";
            riskBadge.classList.add("risk-medium");

            resultDetails.textContent =
                "Some website characteristics may warrant additional caution before interacting with this webpage.";

        }

        else {

            riskBadge.textContent = "High Risk";
            riskBadge.classList.add("risk-high");

            resultDetails.textContent =
                "Several characteristics triggered elevated risk indicators. Avoid sharing sensitive information until the website is verified.";

        }


        if (analysis.analyzedContent) {

            resultDetails.textContent +=
                " Optional page-content analysis was enabled.";

        }


        result.classList.add("show");


        /* animate score */

        requestAnimationFrame(() => {

            setTimeout(() => {

                scoreFill.style.width =
                    analysis.risk + "%";

            }, 80);

        });


        result.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    /* =========================================================
       SAVE SCAN
    ========================================================= */

    function saveScan(url, analysis) {

        const scan = {

            id: Date.now(),

            url: url.href,

            hostname: url.hostname,

            risk: analysis.risk,

            level: analysis.level,

            content: analysis.analyzedContent,

            timestamp: new Date().toISOString()

        };


        scanHistory.unshift(scan);


        /* Keep last 30 */

        scanHistory = scanHistory.slice(0, 30);


        localStorage.setItem(
            "webguardHistory",
            JSON.stringify(scanHistory)
        );

    }


    /* =========================================================
       RENDER HISTORY
    ========================================================= */

    function renderHistory() {

        if (!scanHistory.length) {

            historyList.innerHTML = `
                <div class="card">
                    <p>No websites have been scanned yet.</p>
                </div>
            `;

            return;

        }


        historyList.innerHTML = "";


        scanHistory.forEach(scan => {

            const item = document.createElement("div");

            item.className = "history-item";


            const date =
                new Date(scan.timestamp)
                    .toLocaleString();


            let badgeClass =
                scan.level === "low"
                    ? "risk-low"
                    : scan.level === "medium"
                        ? "risk-medium"
                        : "risk-high";


            let label =
                scan.level.charAt(0).toUpperCase() +
                scan.level.slice(1) +
                " Risk";


            item.innerHTML = `

                <div class="history-url">
                    ${escapeHtml(scan.url)}
                </div>

                <div class="history-meta">

                    <span>
                        ${date}
                    </span>

                    <span class="risk-badge ${badgeClass}">
                        ${label}
                    </span>

                    <strong>
                        ${scan.risk}%
                    </strong>

                </div>

            `;


            historyList.appendChild(item);

        });

    }


    /* =========================================================
       DASHBOARD
    ========================================================= */

    function updateDashboard() {

        const total =
            scanHistory.length;

        const low =
            scanHistory.filter(
                scan => scan.level === "low"
            ).length;

        const high =
            scanHistory.filter(
                scan => scan.level === "high"
            ).length;


        totalScans.textContent = total;

        lowRisk.textContent = low;

        highRisk.textContent = high;

    }


    /* =========================================================
       HTML ESCAPE
    ========================================================= */

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent = value;

        return div.innerHTML;

    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const navLinks =
        document.querySelectorAll(".nav-link");


    function setActiveNav() {

        const scrollPosition =
            window.scrollY + 150;


        document
            .querySelectorAll("main section[id]")
            .forEach(section => {

                const top = section.offsetTop;

                const bottom =
                    top + section.offsetHeight;


                if (
                    scrollPosition >= top &&
                    scrollPosition < bottom
                ) {

                    navLinks.forEach(link => {

                        link.classList.remove("active");

                        if (
                            link.dataset.section ===
                            section.id
                        ) {

                            link.classList.add("active");

                        }

                    });

                }

            });

    }


    window.addEventListener(
        "scroll",
        setActiveNav
    );


    /* =========================================================
       INITIALIZATION
    ========================================================= */

    renderHistory();

    updateDashboard();