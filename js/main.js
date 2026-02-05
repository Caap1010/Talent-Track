
// ---------- THEME HANDLING ----------
const THEME_KEY = "tt-theme";

function applyTheme(theme) {
    const body = document.body;
    const toggleBtn = document.getElementById("darkModeToggle");

    if (!theme) theme = "dark"; // default

    body.setAttribute("data-theme", theme);

    if (toggleBtn) {
        toggleBtn.textContent = theme === "light" ? "☀️" : "🌙";
    }
}

// Read stored preference or default
const storedTheme = localStorage.getItem(THEME_KEY) || "dark";
applyTheme(storedTheme);

// Global flash UI for nicer in-page messages; override alert to use it
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('ttFlashContainer')) {
        const container = document.createElement('div');
        container.id = 'ttFlashContainer';
        container.style.position = 'fixed';
        container.style.right = '16px';
        container.style.top = '16px';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '8px';
        document.body.appendChild(container);

        window.ttFlash = function (msg, type = 'info', timeout = 3500) {
            const el = document.createElement('div');
            el.className = 'tt-flash tt-flash-' + type;
            el.style.padding = '10px 14px';
            el.style.borderRadius = '8px';
            el.style.boxShadow = '0 6px 18px rgba(2,6,23,0.3)';
            el.style.color = '#fff';
            el.style.background = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#0b69d6';
            el.textContent = msg;
            container.appendChild(el);
            setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, timeout);
        };

        // Replace default alert with ttFlash to avoid modal dialogs
        window.alert = function (m) { window.ttFlash(String(m)); };
    }
});

// Handle toggle click
const toggleBtn = document.getElementById("darkModeToggle");
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        const current = document.body.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    });
}

// ---------- FOOTER YEAR ----------
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ---------- QUOTES SLIDER ----------
const quotes = [
    "“The absence of evidence is not the evidence of absence.”",
    "“Success is the sum of small efforts, repeated day in and day out.”",
    "“Opportunities don't happen, you create them.”",
    "“Your network is your net worth.”",
    "“Every interview is a rehearsal for the one that changes your life.”"
];

let quoteIndex = 0;
const quoteElement = document.getElementById("currentQuote");

if (quoteElement) {
    setInterval(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteElement.textContent = quotes[quoteIndex];
    }, 5000);
}

// ---------- FEATURED JOB SLIDER ----------
const featuredJobs = [
    {
        title: "Junior Software Developer",
        company: "NovaTech Labs",
        location: "Johannesburg · Hybrid",
        salary: "R25 000 – R35 000",
        type: "Full-time"
    },
    {
        title: "Data Analyst Intern",
        company: "InsightWorks",
        location: "Cape Town · On-site",
        salary: "R12 000 – R15 000",
        type: "Internship"
    },
    {
        title: "Freelance UI/UX Designer",
        company: "PixelForge Studio",
        location: "Remote",
        salary: "Per project",
        type: "Freelance"
    },
    {
        title: "Graduate Engineer",
        company: "FutureEnergy",
        location: "Secunda · On-site",
        salary: "Market related",
        type: "Graduate Programme"
    }
];

const sliderContainer = document.getElementById("jobSlider");
if (sliderContainer) {
    featuredJobs.forEach(job => {
        const card = document.createElement("article");
        card.className = "tt-job-card";
        card.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>${job.company}</strong></p>
            <p>${job.location}</p>
            <p><span class="tt-badge">${job.type}</span> · ${job.salary}</p>
            <button class="tt-btn tt-btn-primary tt-btn-sm">Apply</button>
        `;
        card.querySelector("button").addEventListener("click", () => {
            window.location.href = "auth.html";
        });
        sliderContainer.appendChild(card);
    });
}

/* ============================================
   STATS PAGE CHARTS (Chart.js)
   ============================================ */

// Only run this section on stats page (and only if Chart.js loaded)
if (document.getElementById("successRateChart") && typeof Chart !== "undefined") {

    // 1) APPLICATION SUCCESS RATE - PIE CHART
    const successCtx = document.getElementById("successRateChart").getContext("2d");
    new Chart(successCtx, {
        type: "pie",
        data: {
            labels: ["Rejected", "In Review", "Accepted"],
            datasets: [
                {
                    // 🔢 change these values to update your stats
                    data: [55, 30, 15],   // [Rejected, In Review, Accepted]
                    backgroundColor: [
                        "rgba(239, 68, 68, 0.8)",   // red
                        "rgba(234, 179, 8, 0.8)",   // yellow
                        "rgba(34, 197, 94, 0.8)"    // green
                    ],
                    borderWidth: 0
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue("--text") || "#e5e7eb"
                    }
                }
            }
        }
    });

    // 2) INTERVIEW PERFORMANCE - BAR CHART
    const interviewCtx = document.getElementById("interviewScoreChart").getContext("2d");
    new Chart(interviewCtx, {
        type: "bar",
        data: {
            labels: ["Tech Fit", "Communication", "Problem Solving", "Confidence"],
            datasets: [
                {
                    // 🔢 0–100 scores for each category
                    data: [75, 82, 68, 79],
                    backgroundColor: "rgba(56, 189, 248, 0.7)",
                    borderRadius: 10,
                    borderSkipped: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--text") || "#e5e7eb"
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--text") || "#e5e7eb"
                    },
                    grid: {
                        color: "rgba(148, 163, 184, 0.25)"
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 3) PROFILE VIEWS OVER TIME - LINE CHART
    const viewsCtx = document.getElementById("viewsChart").getContext("2d");
    new Chart(viewsCtx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Profile Views",
                    // 🔢 Change this array to update weekly views
                    data: [32, 45, 51, 40, 62, 70, 85],
                    borderColor: "rgba(56, 189, 248, 1)",
                    backgroundColor: "rgba(56, 189, 248, 0.2)",
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(56, 189, 248, 1)"
                }
            ]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--text") || "#e5e7eb"
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--text") || "#e5e7eb"
                    },
                    grid: {
                        color: "rgba(148, 163, 184, 0.25)"
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue("--text") || "#e5e7eb"
                    }
                }
            }
        }
    });
}


/* ============================================
   INTERVIEW ROOM LOGIC
   ============================================ */

(function () {
    const tableBody = document.getElementById("interviewTableBody");
    if (!tableBody) return; // only run on interview-room.html

    const filterRole = document.getElementById("filterRole");
    const filterStatus = document.getElementById("filterStatus");
    const filterDate = document.getElementById("filterDate");
    const interviewCountLabel = document.getElementById("interviewCountLabel");
    const nextInterviewLabel = document.getElementById("nextInterviewLabel");

    const sessionSection = document.getElementById("interviewSession");
    const leaveInterviewBtn = document.getElementById("leaveInterviewBtn");
    const sessionMeta = document.getElementById("sessionMeta");
    const sessionRole = document.getElementById("sessionRole");
    const sessionCompany = document.getElementById("sessionCompany");
    const sessionTime = document.getElementById("sessionTime");
    const sessionStatus = document.getElementById("sessionStatus");
    const sessionLiveTimer = document.getElementById("sessionLiveTimer");
    const sessionIdentity = document.getElementById("sessionIdentity");
    const viewPill = document.getElementById("viewPill");

    // ---- ROLE / VIEW DETECTION ----
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view") || "candidate"; // candidate / company / freelancer

    const viewLabelMap = {
        candidate: "Candidate View",
        company: "Company View",
        freelancer: "Freelancer View"
    };

    if (viewPill) {
        viewPill.textContent = viewLabelMap[view] || "Candidate View";
    }

    // Identity mapping (simulating what would come from JS vars / auth)
    function getViewerIdentity(viewRole) {
        switch (viewRole) {
            case "company":
                return "You are joining as: Company — TalentTrack Labs";
            case "freelancer":
                return "You are joining as: Freelancer — Sfiso Tshotwane";
            case "candidate":
            default:
                return "You are joining as: Candidate — Sfiso Tshotwane";
        }
    }

    // ---- INTERVIEWS DATA (ONE SOURCE, FILTERED BY ROLE) ----
    const allInterviews = [
        // Candidate-focused interviews
        {
            id: 1,
            company: "TalentTrack Labs",
            roleTitle: "Junior Business Analyst",
            datetime: futureMinutes(45),
            status: "confirmed",
            forRole: "candidate"
        },
        {
            id: 2,
            company: "Global FinTech SA",
            roleTitle: "Junior Admin Assistant",
            datetime: futureMinutes(180),
            status: "pending",
            forRole: "candidate"
        },
        {
            id: 3,
            company: "Remote Talent Africa",
            roleTitle: "Virtual Assistant",
            datetime: futureMinutes(1440),
            status: "confirmed",
            forRole: "candidate"
        },

        // Freelancer-focused interviews
        {
            id: 4,
            company: "TalentTrack Labs",
            roleTitle: "UX Audit Project Kickoff",
            datetime: futureMinutes(90),
            status: "confirmed",
            forRole: "freelancer"
        },
        {
            id: 5,
            company: "PixelForge Studio",
            roleTitle: "Landing Page Redesign Brief",
            datetime: futureMinutes(240),
            status: "pending",
            forRole: "freelancer"
        },

        // Mixed - company hosting both types
        {
            id: 6,
            company: "TalentTrack Labs",
            roleTitle: "Graduate Talent Screening",
            datetime: futureMinutes(-60), // 1 hour ago
            status: "completed",
            forRole: "candidate"
        }
    ];

    // Apply simple role-based filter (Option 1)
    function getInterviewsForView(viewRole) {
        switch (viewRole) {
            case "company":
                // Company sees everything they host
                return allInterviews.filter(iv => iv.company === "TalentTrack Labs");
            case "freelancer":
                return allInterviews.filter(iv => iv.forRole === "freelancer");
            case "candidate":
            default:
                return allInterviews.filter(iv => iv.forRole === "candidate");
        }
    }

    const interviews = getInterviewsForView(view);

    let countdownIntervals = [];
    let liveTimerInterval = null;

    function futureMinutes(offset) {
        const d = new Date();
        d.setMinutes(d.getMinutes() + offset);
        return d;
    }

    function statusClass(status) {
        switch (status) {
            case "confirmed": return "tt-status-confirmed";
            case "pending": return "tt-status-pending";
            case "completed": return "tt-status-completed";
            case "cancelled": return "tt-status-cancelled";
            default: return "";
        }
    }

    function cap(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function updateCountdown(el, target) {
        const now = new Date();
        const diff = target - now;
        el.classList.remove("tt-countdown-soon", "tt-countdown-late");

        if (diff <= -30 * 60 * 1000) {
            el.textContent = "Finished";
            el.classList.add("tt-countdown-late");
        } else if (diff < 0) {
            el.textContent = "In progress";
            el.classList.add("tt-countdown-soon");
        } else {
            const mins = Math.floor(diff / 60000);
            const hrs = Math.floor(mins / 60);
            const rem = mins % 60;

            if (hrs > 0) el.textContent = `${hrs}h ${rem}m`;
            else el.textContent = `${rem} min`;

            if (mins <= 15) el.classList.add("tt-countdown-soon");
        }
    }

    function renderTable() {
        // Clear old intervals
        countdownIntervals.forEach(clearInterval);
        countdownIntervals = [];

        const roleTerm = (filterRole.value || "").toLowerCase();
        const statusFilter = filterStatus.value;
        const dateFilter = filterDate.value ? new Date(filterDate.value) : null;

        const filtered = interviews.filter(iv => {
            const matchesRole =
                !roleTerm ||
                iv.roleTitle.toLowerCase().includes(roleTerm) ||
                iv.company.toLowerCase().includes(roleTerm);

            const matchesStatus =
                statusFilter === "all" || iv.status === statusFilter;

            let matchesDate = true;
            if (dateFilter) {
                const d1 = dateFilter.toISOString().slice(0, 10);
                const d2 = iv.datetime.toISOString().slice(0, 10);
                matchesDate = d1 === d2;
            }

            return matchesRole && matchesStatus && matchesDate;
        });

        tableBody.innerHTML = "";

        filtered.forEach(iv => {
            const tr = document.createElement("tr");
            const formattedDate = iv.datetime.toLocaleString([], {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });

            tr.innerHTML = `
                <td>${iv.company}</td>
                <td>${iv.roleTitle}</td>
                <td>${formattedDate}</td>
                <td>
                    <span class="tt-status-chip ${statusClass(iv.status)}">
                        ${cap(iv.status)}
                    </span>
                </td>
                <td>
                    <span class="tt-countdown" id="tt-countdown-${iv.id}">...</span>
                </td>
                <td>
                    <button class="tt-btn tt-btn-primary tt-btn-sm" data-join-id="${iv.id}">
                        Join
                    </button>
                </td>
            `;

            tableBody.appendChild(tr);

            const countdownEl = document.getElementById(`tt-countdown-${iv.id}`);
            updateCountdown(countdownEl, iv.datetime);

            const id = setInterval(() => updateCountdown(countdownEl, iv.datetime), 1000);
            countdownIntervals.push(id);
        });

        interviewCountLabel.textContent =
            `${filtered.length} interview${filtered.length === 1 ? "" : "s"}`;

        updateNextInterview();

        document.querySelectorAll("[data-join-id]").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-join-id"), 10);
                const interview = interviews.find(i => i.id === id);
                if (interview) openSession(interview);
            });
        });
    }

    function updateNextInterview() {
        const now = new Date();
        const upcoming = interviews
            .filter(i => i.datetime > now && (i.status === "confirmed" || i.status === "pending"))
            .sort((a, b) => a.datetime - b.datetime);

        if (!upcoming.length) {
            nextInterviewLabel.textContent = "No upcoming interviews found.";
            return;
        }

        const next = upcoming[0];
        nextInterviewLabel.textContent =
            `${next.roleTitle} at ${next.company} — ` +
            next.datetime.toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
    }

    function openSession(interview) {
        // Fill interview info
        sessionMeta.textContent = `Live session for ${interview.roleTitle} at ${interview.company}`;
        sessionRole.textContent = `Role: ${interview.roleTitle}`;
        sessionCompany.textContent = `Company: ${interview.company}`;
        sessionTime.textContent = `Scheduled: ${interview.datetime.toLocaleString()}`;
        sessionStatus.textContent = `Status: ${cap(interview.status)}`;

        // Identity line in header
        if (sessionIdentity) {
            sessionIdentity.textContent = getViewerIdentity(view);
        }

        // Show overlay
        sessionSection.classList.remove("tt-hidden");
        sessionSection.setAttribute("aria-hidden", "false");

        // Start live timer
        if (liveTimerInterval) clearInterval(liveTimerInterval);
        let seconds = 0;
        sessionLiveTimer.textContent = "00:00";

        liveTimerInterval = setInterval(() => {
            seconds++;
            const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
            const ss = String(seconds % 60).padStart(2, "0");
            sessionLiveTimer.textContent = `${mm}:${ss}`;
        }, 1000);
    }

    function closeSession() {
        sessionSection.classList.add("tt-hidden");
        sessionSection.setAttribute("aria-hidden", "true");
        if (liveTimerInterval) clearInterval(liveTimerInterval);
        liveTimerInterval = null;
    }

    if (leaveInterviewBtn) {
        leaveInterviewBtn.addEventListener("click", closeSession);
    }

    // Hook up filters
    [filterRole, filterStatus, filterDate].forEach(el => {
        if (!el) return;
        el.addEventListener("input", renderTable);
        el.addEventListener("change", renderTable);
    });

    // Initial render
    renderTable();
})();

/* --------------------------------------------
   Gamification / Wallet helpers
-------------------------------------------- */
function awardXP(amount) {
    const current = parseInt(localStorage.getItem('TT_XP') || '0', 10);
    localStorage.setItem('TT_XP', String(current + Number(amount)));
}

function awardCompanyCredits(amount) {
    const current = parseInt(localStorage.getItem('TT_COMPANY_CREDITS') || '0', 10);
    localStorage.setItem('TT_COMPANY_CREDITS', String(current + Number(amount)));
}

function getXP() { return parseInt(localStorage.getItem('TT_XP') || '0', 10); }
function getCompanyCredits() { return parseInt(localStorage.getItem('TT_COMPANY_CREDITS') || '0', 10); }

/* Render dynamic company posts into jobs listing on public jobs page */
document.addEventListener('DOMContentLoaded', () => {
    try {
        const jobsList = document.querySelector('.tt-jobs-list');
        const posts = JSON.parse(localStorage.getItem('TT_POSTS') || '[]');
        if (jobsList && posts.length) {
            posts.slice().reverse().forEach((p, idx) => {
                const art = document.createElement('article');
                art.className = 'tt-job-result';
                art.innerHTML = `
                    <div>
                        <h3>${p.title}</h3>
                        <p class="tt-job-meta">${p.location || ''}</p>
                        <p class="tt-job-tags"><span class="tt-chip">${p.type || 'Job'}</span></p>
                    </div>
                    <div class="tt-job-actions">
                        <p class="tt-job-posted">Posted ${new Date(p.date).toLocaleDateString()}</p>
                        <a class="tt-btn tt-btn-primary tt-btn-sm tt-apply-post" href="#" data-post-idx="${idx}">Apply</a>
                    </div>
                `;
                jobsList.appendChild(art);
            });
        }

        // attach handler for dynamic post apply links
        document.querySelectorAll('.tt-apply-post').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const role = localStorage.getItem('TT_USER_ROLE');
                if (!role) return window.location.href = 'auth.html';
                const idx = parseInt(a.getAttribute('data-post-idx'), 10);
                const posts = JSON.parse(localStorage.getItem('TT_POSTS') || '[]');
                const p = posts[posts.length - 1 - idx] || posts[0];
                const apps = JSON.parse(localStorage.getItem('TT_APPLICATIONS') || '[]');
                apps.push({ title: p.title, date: new Date().toISOString(), user: localStorage.getItem('TT_USER_NAME') || '' });
                localStorage.setItem('TT_APPLICATIONS', JSON.stringify(apps));
                awardXP(10);
                alert('Application submitted for: ' + p.title + '\nYou earned 10 XP!');
            });
        });
    } catch (err) { /* ignore */ }
});

/* ============================================
   SIMPLE APPLY / POST-JOB HANDLERS
   - Intercept 'Apply' links that currently point to auth.html and
     submit a localStorage application when user is logged in.
   - Route 'Post a Job' clicks for company users to their dashboard.
============================================ */
(function () {
    // 'Apply' buttons that currently link to auth.html in jobs listing
    document.querySelectorAll('a[href="auth.html"]').forEach(a => {
        try {
            if (a.textContent && a.textContent.trim().toLowerCase() === 'apply') {
                a.addEventListener('click', function (e) {
                    const role = localStorage.getItem('TT_USER_ROLE');
                    if (!role) {
                        // not logged in — allow default navigation to auth.html
                        return;
                    }
                    e.preventDefault();
                    const jobCard = a.closest('.tt-job-result');
                    const title = jobCard ? (jobCard.querySelector('h3')?.textContent || 'Job') : 'Job';
                    const apps = JSON.parse(localStorage.getItem('TT_APPLICATIONS') || '[]');
                    apps.push({ title, date: new Date().toISOString(), user: localStorage.getItem('TT_USER_NAME') || '' });
                    localStorage.setItem('TT_APPLICATIONS', JSON.stringify(apps));
                    alert('Application submitted for: ' + title);
                });
            }
        } catch (err) {
            /* ignore */
        }
    });

    // 'Post a Job' text links: if company/recruiter, route to company dashboard
    document.querySelectorAll('a').forEach(a => {
        try {
            if (a.textContent && a.textContent.trim().toLowerCase() === 'post a job') {
                a.addEventListener('click', function (e) {
                    const role = localStorage.getItem('TT_USER_ROLE');
                    if (role === 'company' || role === 'recruiter') {
                        e.preventDefault();
                        const path = location.pathname.replace(/\\/g, '/');
                        let P = '';
                        if (path.includes('/dashboard/company/') || path.includes('/dashboard/candidate/') || path.includes('/dashboard/freelancer/')) {
                            P = '../../';
                        } else if (path.includes('/dashboard/')) {
                            P = '../';
                        } else {
                            P = '';
                        }
                        window.location.href = P + 'dashboard/company/company.html';
                    }
                });
            }
        } catch (err) { }
    });
})();

// Also handle plain buttons that say "Apply" (candidate dashboard uses buttons)
(function () {
    document.querySelectorAll('button').forEach(btn => {
        try {
            if ((btn.textContent || '').trim().toLowerCase() === 'apply') {
                btn.addEventListener('click', function (e) {
                    const role = localStorage.getItem('TT_USER_ROLE');
                    if (!role) {
                        // Not logged in — redirect to auth
                        window.location.href = 'auth.html';
                        return;
                    }
                    // Collect job title (nearby h3 or strong)
                    const jobCard = btn.closest('.tt-job-result') || btn.closest('li');
                    const titleEl = jobCard ? (jobCard.querySelector('h3') || jobCard.querySelector('strong')) : null;
                    const title = titleEl ? titleEl.textContent.trim() : 'Job';
                    const apps = JSON.parse(localStorage.getItem('TT_APPLICATIONS') || '[]');
                    apps.push({ title, date: new Date().toISOString(), user: localStorage.getItem('TT_USER_NAME') || '' });
                    localStorage.setItem('TT_APPLICATIONS', JSON.stringify(apps));
                    alert('Application submitted for: ' + title);
                    // If on candidate dashboard, trigger render
                    const list = document.getElementById('ttApplicationsList');
                    if (list) renderApplications(list);
                });
            }
        } catch (err) { }
    });

    function renderApplications(listEl) {
        const apps = JSON.parse(localStorage.getItem('TT_APPLICATIONS') || '[]');
        if (!apps.length) {
            listEl.innerHTML = '<li class="tt-muted">No applications yet.</li>';
            return;
        }
        listEl.innerHTML = '';
        apps.slice().reverse().forEach(a => {
            const li = document.createElement('li');
            li.innerHTML = `<div><strong>${a.title}</strong><p class="tt-job-meta">Applied: ${new Date(a.date).toLocaleString()}</p></div>`;
            listEl.appendChild(li);
        });
    }

    // Auto-render on candidate dashboard
    document.addEventListener('DOMContentLoaded', () => {
        const list = document.getElementById('ttApplicationsList');
        if (list) renderApplications(list);
    });
})();

/* ============================================
   MESSAGING UI LOGIC
   ============================================ */

(function () {
    const root = document.getElementById("ttMessagesRoot");
    if (!root) return; // only run on messaging.html

    const params = new URLSearchParams(window.location.search);
    const view = params.get("view") || "candidate"; // candidate | company | freelancer

    const messagesViewPill = document.getElementById("messagesViewPill");
    const conversationListEl = document.getElementById("conversationList");
    const conversationSearch = document.getElementById("conversationSearch");
    const conversationCountLabel = document.getElementById("conversationCountLabel");

    const chatTitle = document.getElementById("chatTitle");
    const chatSubtitle = document.getElementById("chatSubtitle");
    const chatIdentity = document.getElementById("chatIdentity");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const chatSendBtn = document.getElementById("chatSendBtn");
    const typingIndicator = document.getElementById("typingIndicator");

    const infoName = document.getElementById("infoName");
    const infoRole = document.getElementById("infoRole");
    const infoCompany = document.getElementById("infoCompany");
    const infoNextSteps = document.getElementById("infoNextSteps");

    // View pill label
    const viewLabelMap = {
        candidate: "Candidate Messaging",
        company: "Company Messaging",
        freelancer: "Freelancer Messaging"
    };
    if (messagesViewPill) {
        messagesViewPill.textContent = viewLabelMap[view] || "Messaging";
    }

    // Identity line
    function getChatIdentity(viewRole) {
        switch (viewRole) {
            case "company":
                return "You are chatting as: Company — TalentTrack Labs";
            case "freelancer":
                return "You are chatting as: Freelancer — Sfiso Tshotwane";
            case "candidate":
            default:
                return "You are chatting as: Candidate — Sfiso Tshotwane";
        }
    }

    // Demo conversations per role
    const conversationsData = {
        candidate: [
            {
                id: "c1",
                name: "TalentTrack Labs",
                roleLabel: "Recruiter · Junior Business Analyst",
                company: "TalentTrack Labs",
                lastMessagePreview: "We’d like to invite you to a first-round interview.",
                lastTime: "10:12",
                unread: 2,
                messages: [
                    { from: "them", text: "Hi Sfiso, thanks for applying! 👋", time: "09:45" },
                    { from: "me", text: "Hi! Thank you for the update 🙏", time: "09:50" },
                    { from: "them", text: "We’d like to invite you to a first-round interview.", time: "10:12" }
                ],
                nextSteps: [
                    "Confirm interview time in the Interview Room.",
                    "Prepare 2–3 examples of your admin/tech experience."
                ]
            },
            {
                id: "c2",
                name: "Global FinTech SA",
                roleLabel: "HR · Junior Admin Assistant",
                company: "Global FinTech SA",
                lastMessagePreview: "Please upload your latest CV before Friday.",
                lastTime: "Yesterday",
                unread: 0,
                messages: [
                    { from: "them", text: "Hi, we received your application 🙌", time: "Yesterday" },
                    { from: "them", text: "Please upload your latest CV before Friday.", time: "Yesterday" }
                ],
                nextSteps: [
                    "Update your CV on TalentTrack.",
                    "Double-check your contact details and availability."
                ]
            }
        ],
        company: [
            {
                id: "co1",
                name: "Sfiso Tshotwane",
                roleLabel: "Candidate · Learner: Administration",
                company: "TalentTrack Labs",
                lastMessagePreview: "Thank you for the opportunity!",
                lastTime: "14:03",
                unread: 1,
                messages: [
                    { from: "me", text: "Hi Sfiso, are you available tomorrow at 10:00?", time: "13:40" },
                    { from: "them", text: "Yes, that works for me. Thank you for the opportunity!", time: "14:03" }
                ],
                nextSteps: [
                    "Confirm interview slot in Interview Room.",
                    "Send pre-interview document link."
                ]
            },
            {
                id: "co2",
                name: "Ayanda Nkosi",
                roleLabel: "Candidate · Junior Developer",
                company: "TalentTrack Labs",
                lastMessagePreview: "I’ve attached my updated portfolio.",
                lastTime: "09:18",
                unread: 0,
                messages: [
                    { from: "them", text: "Good morning, I’ve attached my updated portfolio.", time: "09:18" }
                ],
                nextSteps: [
                    "Review candidate portfolio.",
                    "Share shortlist decision with your hiring manager."
                ]
            }
        ],
        freelancer: [
            {
                id: "f1",
                name: "PixelForge Studio",
                roleLabel: "Client · Design Team Lead",
                company: "PixelForge Studio",
                lastMessagePreview: "Can you share the updated landing page by Friday?",
                lastTime: "11:27",
                unread: 3,
                messages: [
                    { from: "them", text: "Hey Sfiso, thanks for the first draft 👏", time: "10:10" },
                    { from: "me", text: "Awesome, I’ll refine the hero section.", time: "10:35" },
                    { from: "them", text: "Can you share the updated landing page by Friday?", time: "11:27" }
                ],
                nextSteps: [
                    "Update the hero section and pricing layout.",
                    "Confirm delivery date and time in this chat."
                ]
            },
            {
                id: "f2",
                name: "TalentTrack Labs",
                roleLabel: "Client · Dashboard Revamp",
                company: "TalentTrack Labs",
                lastMessagePreview: "We’re happy with the previous sprint result.",
                lastTime: "Mon",
                unread: 0,
                messages: [
                    { from: "them", text: "We’re happy with the previous sprint result.", time: "Mon" }
                ],
                nextSteps: [
                    "Scope the next sprint tasks.",
                    "Share updated estimate for new components."
                ]
            }
        ]
    };

    const conversations = conversationsData[view] || [];
    let activeConversation = null;
    let typingTimeout = null;

    function renderConversationList(filterTerm = "") {
        conversationListEl.innerHTML = "";

        const lower = filterTerm.toLowerCase();
        const filtered = conversations.filter(c =>
            !lower ||
            c.name.toLowerCase().includes(lower) ||
            c.company.toLowerCase().includes(lower) ||
            c.roleLabel.toLowerCase().includes(lower)
        );

        filtered.forEach(conv => {
            const item = document.createElement("div");
            item.className =
                "tt-conversation-item" +
                (activeConversation && activeConversation.id === conv.id
                    ? " tt-conversation-active"
                    : "");

            const initials = conv.name
                .split(" ")
                .map(p => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            item.innerHTML = `
                <div class="tt-conversation-avatar">${initials}</div>
                <div class="tt-conversation-body">
                    <div class="tt-conversation-top">
                        <span class="tt-conversation-name">${conv.name}</span>
                        <span class="tt-conversation-time">${conv.lastTime}</span>
                    </div>
                    <div class="tt-conversation-bottom">
                        <span>${conv.lastMessagePreview}</span>
                        ${conv.unread > 0 ? `<span class="tt-conversation-unread">${conv.unread}</span>` : ""}
                    </div>
                </div>
            `;

            item.addEventListener("click", () => {
                activeConversation = conv;
                // reset unread
                conv.unread = 0;
                renderConversationList(conversationSearch.value || "");
                renderActiveConversation();
            });

            conversationListEl.appendChild(item);
        });

        conversationCountLabel.textContent = `${filtered.length} chat${filtered.length === 1 ? "" : "s"}`;
    }

    function renderActiveConversation() {
        if (!activeConversation) {
            chatTitle.textContent = "Select a conversation";
            chatSubtitle.textContent = "";
            chatIdentity.textContent = getChatIdentity(view);
            chatMessages.innerHTML =
                '<p class="tt-chat-empty">No conversation selected yet. Choose a chat on the left to start.</p>';
            infoName.textContent = "No conversation selected";
            infoRole.textContent = "";
            infoCompany.textContent = "";
            infoNextSteps.innerHTML = "<li>Select a conversation to view suggestions.</li>";
            return;
        }

        chatTitle.textContent = activeConversation.name;
        chatSubtitle.textContent = activeConversation.roleLabel;
        chatIdentity.textContent = getChatIdentity(view);

        infoName.textContent = activeConversation.name;
        infoRole.textContent = activeConversation.roleLabel;
        infoCompany.textContent = activeConversation.company;

        // Render next steps
        infoNextSteps.innerHTML = "";
        activeConversation.nextSteps.forEach(step => {
            const li = document.createElement("li");
            li.textContent = step;
            infoNextSteps.appendChild(li);
        });

        // Render messages
        chatMessages.innerHTML = "";
        activeConversation.messages.forEach(msg => {
            const row = document.createElement("div");
            row.className = "tt-message-row " + (msg.from === "me" ? "me" : "them");

            const bubble = document.createElement("div");
            bubble.className = "tt-message-bubble";
            bubble.innerHTML = `
                <div>${msg.text}</div>
                <div class="tt-message-meta">${msg.time}</div>
            `;

            row.appendChild(bubble);
            chatMessages.appendChild(row);
        });

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        if (!activeConversation) return;
        const text = (chatInput.value || "").trim();
        if (!text) return;

        const now = new Date();
        const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const newMsg = { from: "me", text, time: timeLabel };
        activeConversation.messages.push(newMsg);
        activeConversation.lastMessagePreview = text;
        activeConversation.lastTime = timeLabel;

        chatInput.value = "";
        renderActiveConversation();
        renderConversationList(conversationSearch.value || "");

        showTypingSimulation();
    }

    function showTypingSimulation() {
        if (typingTimeout) clearTimeout(typingTimeout);
        typingIndicator.classList.remove("tt-hidden");

        typingTimeout = setTimeout(() => {
            typingIndicator.classList.add("tt-hidden");
        }, 2000);
    }

    // Events
    if (conversationSearch) {
        conversationSearch.addEventListener("input", () => {
            renderConversationList(conversationSearch.value || "");
        });
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener("click", sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Init
    renderConversationList();
    if (conversations.length > 0) {
        activeConversation = conversations[0];
        renderActiveConversation();
    } else {
        renderActiveConversation();
    }
})();
/* ============================================
   GLOBAL HEADER LOGIN / SIGNOUT (all pages)
============================================ */
(function () {
    const nav = document.querySelector(".tt-nav");
    if (!nav) return;

    const role = localStorage.getItem("TT_USER_ROLE");
    const name = localStorage.getItem("TT_USER_NAME");

    // Decide correct relative prefix
    const path = location.pathname.replace(/\\/g, "/");
    let P = "";
    if (
        path.includes("/dashboard/company/") ||
        path.includes("/dashboard/candidate/") ||
        path.includes("/dashboard/freelancer/")
    ) {
        P = "../../";
    } else if (path.includes("/dashboard/")) {
        P = "../";
    } else {
        P = "";
    }

    const dashboardFor = (r) =>
        r === "company" || r === "recruiter" ? `${P}dashboard/company/company.html` :
            r === "freelancer" ? `${P}dashboard/freelancer/freelancer.html`
                : `${P}dashboard/candidate/candidate.html`;

    // Not logged in → show Login + Sign Up
    if (!role || !name) {
        nav.innerHTML = `
            <a href="${P}index.html">Home</a>
            <a href="${P}jobs.html">Jobs</a>
            <a href="${P}freelance.html">Freelance</a>
            <a href="${P}auth.html">Login</a>
            <a href="${P}register.html" class="tt-btn tt-btn-primary tt-btn-sm">Sign Up</a>
        `;
        return;
    }

    // Logged in → show Dashboard + Sign Out + user name
    const displayName = name.length > 20 ? name.slice(0, 17) + '...' : name;
    nav.innerHTML = `
        <a href="${P}index.html">Home</a>
        <a href="${P}jobs.html">Jobs</a>
        <a href="${P}freelance.html">Freelance</a>
        <a href="${dashboardFor(role)}">Dashboard</a>
        <span class="tt-nav-user">Hello, ${displayName}</span>
        <a id="ttSignOut" class="tt-btn tt-btn-sm tt-btn-danger" role="button">Sign Out</a>
    `;

    const btn = document.getElementById("ttSignOut");
    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.removeItem("TT_USER_ROLE");
            localStorage.removeItem("TT_USER_NAME");
            localStorage.removeItem("TT_COMPANY_NAME");
            window.location.href = P + "auth.html";
        });
    }
})();
