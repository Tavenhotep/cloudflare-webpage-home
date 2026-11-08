/**
 * Cloudflare Senior Customer Engineer - Interview Preparation Portal
 * Core Interactive Application Logic with Full Click-Through Navigation
 * Public Edition
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderCandidateHero();
  renderAlignmentMatrix();
  renderTechDeepDive();
  renderCompetitiveBattlecards();
  renderTroubleshootingTree();
  renderQuestionsForTim();
  initFlashcardDeck();
  initGlobalSearch();
  initNavigationTabs();
  handleUrlHashRouting();
});

// State Store
const state = {
  currentFlashcardIndex: 0,
  activeFlashcards: [...PREP_DATA.flashcards],
  currentCategory: "All",
  masteredCards: JSON.parse(localStorage.getItem("cf_mastered_cards") || "[]"),
};

// Global Tab Switcher accessible from any click-through link or button
window.switchTab = function(tabId, targetElementId = null) {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(b => {
    if (b.getAttribute("data-tab") === tabId) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  tabContents.forEach(c => {
    if (c.id === tabId) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });

  // Update URL hash without jumping
  if (history.pushState) {
    history.pushState(null, null, `#${tabId}`);
  } else {
    location.hash = `#${tabId}`;
  }

  // If a specific element within the tab was targeted, scroll to it
  if (targetElementId) {
    setTimeout(() => {
      const el = document.getElementById(targetElementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Highlight element temporarily
        el.style.outline = "2px solid var(--cf-orange)";
        setTimeout(() => el.style.outline = "none", 2000);
      }
    }, 100);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// URL Hash Routing on page load or back/forward navigation
function handleUrlHashRouting() {
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const validTabs = [
      "dashboardTab", "techDeepDiveTab", "battlecardsTab", 
      "dashboardTab", "techDeepDiveTab", "battlecardsTab",
      "flashcardsTab", "troubleshootingTab", "blueprintsTab"
    ];
    if (validTabs.includes(hash)) {
      window.switchTab(hash);
    }
  }

  window.addEventListener("hashchange", () => {
    const newHash = window.location.hash.replace("#", "");
    if (newHash) {
      window.switchTab(newHash);
    }
  });
}

// Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem("cf_theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    updateThemeIcon(true);
  }

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light-theme");
      localStorage.setItem("cf_theme", isLight ? "light" : "dark");
      updateThemeIcon(isLight);
    });
  }
}

function updateThemeIcon(isLight) {
  const icon = document.querySelector("#themeToggleBtn span");
  if (icon) {
    icon.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
  }
}

// Navigation Tabs
function initNavigationTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-tab");
      window.switchTab(targetId);
    });
  });
}

// Render Candidate Hero Banner
function renderCandidateHero() {
  const c = PREP_DATA.candidate;
  const j = PREP_DATA.job;

  const candidateHeader = document.getElementById("candidateHeader");
  if (candidateHeader) {
    candidateHeader.innerHTML = `
      <h2>${c.archetype || "Candidate Strategy & Profile"}</h2>
      <div class="candidate-title">
        <span>${c.name}</span>
        <span class="candidate-pill">📍 ${c.location}</span>
        <a href="${j.greenhouseUrl}" target="_blank" rel="noopener noreferrer" class="target-job-link" title="Click to view live job posting on Greenhouse">
          🎯 Cloudflare Job #${j.id} (${j.title}) ↗
        </a>
      </div>
      <div class="contact-links-bar" style="margin-top: 6px;">
        <span style="color: var(--text-dim); font-size: 0.85rem;">Territory Focus: <strong>Western Canada / Enterprise SASE & Networking</strong></span>
        <span style="color: var(--text-dim);">|</span>
        <a href="${j.greenhouseUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--cf-orange); font-weight: 600; font-size: 0.85rem;">
          🔗 Greenhouse Requisition Details ↗
        </a>
      </div>
      <p class="pitch-quote">"${c.elevatorPitch}"</p>
    `;
  }

  const statsContainer = document.getElementById("heroStatsGrid");
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-item highlight-orange">
        <div class="stat-value">30+ Yrs</div>
        <div class="stat-label">Networking & Pre-Sales Leadership</div>
      </div>
      <div class="stat-item highlight-blue">
        <div class="stat-value">24 Yrs Cisco</div>
        <div class="stat-label">Hall of Fame & Chairman's Club</div>
      </div>
      <div class="stat-item highlight-green">
        <div class="stat-value">Arista Lead</div>
        <div class="stat-label">Western Canada & SASE Banking Win</div>
      </div>
      <div class="stat-item highlight-purple">
        <div class="stat-value">AI-Native</div>
        <div class="stat-label">Harnesses, MCP & Agentic Workflows</div>
      </div>
    `;
  }
}

// Render Candidate Alignment Matrix with Click-Throughs
function renderAlignmentMatrix() {
  const tbody = document.getElementById("alignmentMatrixBody");
  if (!tbody) return;

  tbody.innerHTML = PREP_DATA.alignmentMatrix.map((item, index) => `
    <tr>
      <td style="font-weight: 600; color: #fff; width: 26%;">
        <div>${item.cloudflareReq}</div>
        <a href="${item.externalUrl}" target="_blank" rel="noopener noreferrer" class="external-doc-link">
          📖 ${item.externalLabel} ↗
        </a>
      </td>
      <td style="width: 32%; color: var(--text-main);">
        <div>${item.candidateMatch || item.timMatch}</div>
        <button class="click-through-btn" onclick="window.switchTab('${item.clickThroughTab}')">
          ${item.clickThroughLabel}
        </button>
      </td>
      <td style="width: 10%; text-align: center;">
        <span class="rating-pill">Match ${item.rating}</span>
      </td>
      <td style="width: 32%;">
        <div class="talking-point-box">
          <strong>Key Interview Response:</strong> "${item.talkingPoint}"
        </div>
      </td>
    </tr>
  `).join("");
}

// Render Cloudflare Tech Deep Dive with Active Click-Throughs & Docs
function renderTechDeepDive() {
  const tech = PREP_DATA.cloudflareTechDeepDive;
  const container = document.getElementById("techDeepDiveContainer");
  if (!container) return;

  container.innerHTML = `
    <!-- Anycast & Global Network -->
    <div class="card" style="grid-column: span 2;" id="card-anycast">
      <div class="card-title">
        <span>🌐 ${tech.anycast.title}</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          <a href="${tech.anycast.officialDocUrl}" target="_blank" rel="noopener noreferrer" class="external-doc-link">
            📚 ${tech.anycast.officialDocTitle} ↗
          </a>
          <span class="card-badge badge-orange">Edge Infrastructure</span>
        </div>
      </div>
      <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 12px;">${tech.anycast.summary}</p>
      <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px;">
        ${tech.anycast.keyPoints.map(p => `<li>${p}</li>`).join("")}
      </ul>
      <div class="talking-point-box">
        💡 <strong>Interview Framing:</strong> ${tech.anycast.interviewTakeaway}
      </div>
      <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="click-through-btn" onclick="window.switchTab('blueprintsTab')">
          📐 View Anycast DDoS Scrubbing Blueprint ➔
        </button>
        <button class="click-through-btn" onclick="window.switchTab('flashcardsTab')">
          ⚡ Practice Anycast Flashcards ➔
        </button>
      </div>
    </div>

    <!-- Cloudflare One (SASE) -->
    <div class="card" style="grid-column: span 2;" id="card-sase">
      <div class="card-title">
        <span>🛡️ ${tech.cloudflareOne.title}</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          <a href="${tech.cloudflareOne.officialDocUrl}" target="_blank" rel="noopener noreferrer" class="external-doc-link">
            📚 ${tech.cloudflareOne.officialDocTitle} ↗
          </a>
          <span class="card-badge badge-blue">Zero Trust / SASE</span>
        </div>
      </div>
      <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 12px;">${tech.cloudflareOne.summary}</p>
      <div class="grid-2" style="gap: 10px; margin-bottom: 12px;">
        ${tech.cloudflareOne.components.map(comp => `
          <div style="background: var(--bg-tertiary); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-weight: 700; color: #fff; font-size: 0.85rem;">${comp.name}</span>
              <a href="${comp.url}" target="_blank" rel="noopener noreferrer" class="external-doc-link" style="font-size: 0.72rem; padding: 1px 6px;">
                Docs ↗
              </a>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${comp.desc}</div>
          </div>
        `).join("")}
      </div>
      <div class="talking-point-box">
        💡 <strong>Interview Framing:</strong> ${tech.cloudflareOne.interviewTakeaway}
      </div>
      <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="click-through-btn" onclick="window.switchTab('battlecardsTab')">
          ⚔️ Compare with Zscaler & Palo Alto ➔
        </button>
        <button class="click-through-btn" onclick="window.switchTab('blueprintsTab')">
          📐 Open Enterprise Migration Blueprint ➔
        </button>
      </div>
    </div>

    <!-- Application Security -->
    <div class="card" id="card-appsec">
      <div class="card-title">
        <span>🔒 ${tech.appSecurity.title}</span>
        <a href="${tech.appSecurity.officialDocUrl}" target="_blank" rel="noopener noreferrer" class="external-doc-link">
          📚 Keyless SSL Docs ↗
        </a>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 10px;">${tech.appSecurity.summary}</p>
      ${tech.appSecurity.components.map(c => `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.82rem;">${c.name}</strong>
            <a href="${c.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: var(--accent-blue);">
              Specs ↗
            </a>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${c.desc}</span>
        </div>
      `).join("")}
      <div class="talking-point-box" style="margin-top: 10px;">
        💡 <strong>Keyless SSL Edge:</strong> ${tech.appSecurity.interviewTakeaway}
      </div>
      <button class="click-through-btn" style="margin-top: 8px;" onclick="window.switchTab('troubleshootingTab')">
        🔧 View 525/526 SSL Troubleshooting ➔
      </button>
    </div>

    <!-- Developer Platform & Workers AI -->
    <div class="card" id="card-workers">
      <div class="card-title">
        <span>⚡ ${tech.developerPlatform.title}</span>
        <a href="${tech.developerPlatform.officialDocUrl}" target="_blank" rel="noopener noreferrer" class="external-doc-link">
          📚 Workers Docs ↗
        </a>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 10px;">${tech.developerPlatform.summary}</p>
      ${tech.developerPlatform.components.map(c => `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #fff; font-size: 0.82rem;">${c.name}</strong>
            <a href="${c.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: var(--accent-blue);">
              Guide ↗
            </a>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${c.desc}</span>
        </div>
      `).join("")}
      <div class="talking-point-box" style="margin-top: 10px;">
        💡 <strong>CE Advantage:</strong> ${tech.developerPlatform.interviewTakeaway}
      </div>
      <button class="click-through-btn" style="margin-top: 8px;" onclick="window.switchTab('flashcardsTab')">
        ⚡ Test Workers vs Lambda Flashcard ➔
      </button>
    </div>
  `;
}

// Render Competitive Battlecards with Links
function renderCompetitiveBattlecards() {
  const container = document.getElementById("battlecardsContainer");
  if (!container) return;

  container.innerHTML = PREP_DATA.competitiveBattlecards.map(b => `
    <div class="battlecard">
      <div class="vs-header">
        <span>⚔️ Cloudflare vs ${b.competitor}</span>
      </div>
      <div style="margin-bottom: 8px;">
        <a href="${b.officialCompareUrl}" target="_blank" rel="noopener noreferrer" class="external-doc-link">
          📑 ${b.officialCompareTitle} ↗
        </a>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
        <strong>Competitor Strengths:</strong> ${b.strengths}
      </div>

      <div class="battlecard-weakness">
        <h5>Architectural Flaws to Expose in Discovery:</h5>
        <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-main); line-height: 1.5;">
          ${b.weaknesses.map(w => `<li>${w}</li>`).join("")}
        </ul>
      </div>

      <div class="battlecard-pitch">
        <h5>Candidate Competitive Pitch & Real-World Framing:</h5>
        <p style="font-size: 0.84rem; color: #fff; line-height: 1.5;">"${b.positioning || b.timPositioning}"</p>
      </div>

      <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
        <button class="click-through-btn" onclick="window.switchTab('troubleshootingTab')">
          🎯 Practice Objection Handling (Q4) ➔
        </button>
        <button class="click-through-btn" onclick="window.switchTab('blueprintsTab')">
          📐 Migration Architecture ➔
        </button>
      </div>
    </div>
  `).join("");
}

// Interactive Flashcard System
function initFlashcardDeck() {
  const flashcard = document.getElementById("activeFlashcard");
  const frontText = document.getElementById("cardQuestionText");
  const backText = document.getElementById("cardAnswerText");
  const cardCategory = document.getElementById("cardCategoryText");
  const cardTakeaway = document.getElementById("cardTakeawayText");
  const cardCounter = document.getElementById("cardCounterIndicator");
  const prevBtn = document.getElementById("prevCardBtn");
  const nextBtn = document.getElementById("nextCardBtn");
  const masterBtn = document.getElementById("toggleMasteredBtn");
  const filterContainer = document.getElementById("cardCategoryFilters");

  if (!flashcard) return;

  // Extract unique categories
  const categories = ["All", ...new Set(PREP_DATA.flashcards.map(f => f.category))];
  if (filterContainer) {
    filterContainer.innerHTML = categories.map(cat => `
      <button class="filter-btn ${cat === state.currentCategory ? "active" : ""}" data-category="${cat}">
        ${cat}
      </button>
    `).join("");

    filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.currentCategory = btn.getAttribute("data-category");
        applyCategoryFilter();
      });
    });
  }

  function applyCategoryFilter() {
    if (state.currentCategory === "All") {
      state.activeFlashcards = [...PREP_DATA.flashcards];
    } else {
      state.activeFlashcards = PREP_DATA.flashcards.filter(f => f.category === state.currentCategory);
    }
    state.currentFlashcardIndex = 0;
    showCard(state.currentFlashcardIndex);
  }

  function showCard(index) {
    if (state.activeFlashcards.length === 0) {
      frontText.textContent = "No flashcards in this category.";
      backText.textContent = "";
      return;
    }

    flashcard.classList.remove("flipped");

    const item = state.activeFlashcards[index];
    frontText.textContent = item.question;
    backText.textContent = item.answer;
    cardCategory.textContent = item.category;
    cardTakeaway.innerHTML = `
      <div style="margin-bottom: 6px;">💡 <strong>Key Takeaway:</strong> ${item.takeaway}</div>
      ${item.docUrl ? `<a href="${item.docUrl}" target="_blank" rel="noopener noreferrer" class="external-doc-link" onclick="event.stopPropagation();">📚 Cloudflare Documentation ↗</a>` : ""}
    `;
    cardCounter.textContent = `Card ${index + 1} of ${state.activeFlashcards.length}`;

    // Mastered status
    const isMastered = state.masteredCards.includes(item.id);
    if (masterBtn) {
      masterBtn.textContent = isMastered ? "✅ Mastered" : "⭐ Mark as Mastered";
      masterBtn.style.color = isMastered ? "var(--accent-green)" : "var(--text-muted)";
    }

    updateMasteredCounter();
  }

  function updateMasteredCounter() {
    const counterEl = document.getElementById("masteredProgressText");
    if (counterEl) {
      counterEl.textContent = `${state.masteredCards.length} / ${PREP_DATA.flashcards.length} Mastered`;
    }
  }

  // Flip trigger
  flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("flipped");
  });

  // Next / Prev triggers
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.currentFlashcardIndex < state.activeFlashcards.length - 1) {
        state.currentFlashcardIndex++;
      } else {
        state.currentFlashcardIndex = 0; // wrap around
      }
      showCard(state.currentFlashcardIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.currentFlashcardIndex > 0) {
        state.currentFlashcardIndex--;
      } else {
        state.currentFlashcardIndex = state.activeFlashcards.length - 1; // wrap around
      }
      showCard(state.currentFlashcardIndex);
    });
  }

  // Toggle Mastered
  if (masterBtn) {
    masterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const currentCard = state.activeFlashcards[state.currentFlashcardIndex];
      if (!currentCard) return;

      const idx = state.masteredCards.indexOf(currentCard.id);
      if (idx > -1) {
        state.masteredCards.splice(idx, 1);
      } else {
        state.masteredCards.push(currentCard.id);
      }
      localStorage.setItem("cf_mastered_cards", JSON.stringify(state.masteredCards));
      showCard(state.currentFlashcardIndex);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    const activeTab = document.querySelector(".tab-content.active");
    if (!activeTab || activeTab.id !== "flashcardsTab") return;

    if (e.code === "Space") {
      e.preventDefault();
      flashcard.classList.toggle("flipped");
    } else if (e.code === "ArrowRight") {
      if (nextBtn) nextBtn.click();
    } else if (e.code === "ArrowLeft") {
      if (prevBtn) prevBtn.click();
    }
  });

  showCard(0);
}


// Render Troubleshooting Diagnostic Tree with Links
function renderTroubleshootingTree() {
  const tabsContainer = document.getElementById("errorTabsNav");
  const displayCard = document.getElementById("errorDetailCard");
  if (!tabsContainer || !displayCard) return;

  tabsContainer.innerHTML = PREP_DATA.troubleshootingTree.map((err, idx) => `
    <button class="error-tab-btn ${idx === 0 ? "active" : ""}" data-code="${err.code}">
      ${err.code} Error
    </button>
  `).join("");

  function showErrorCode(code) {
    const err = PREP_DATA.troubleshootingTree.find(e => e.code === code) || PREP_DATA.troubleshootingTree[0];
    
    displayCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
        <div>
          <div class="code-badge-large">Cloudflare Error ${err.code}</div>
          <h3 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${err.name}</h3>
        </div>
        <a href="${err.docUrl}" target="_blank" rel="noopener noreferrer" class="external-doc-link" style="padding: 6px 12px; font-size: 0.82rem;">
          📖 Official Cloudflare Error ${err.code} Docs ↗
        </a>
      </div>
      <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 16px;">${err.meaning}</p>

      <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid var(--accent-red); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 14px;">
        <h4 style="color: var(--accent-red); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 6px;">Root Causes</h4>
        <ul style="padding-left: 20px; font-size: 0.86rem; color: var(--text-main); line-height: 1.6;">
          ${err.commonCauses.map(c => `<li>${c}</li>`).join("")}
        </ul>
      </div>

      <div style="background: rgba(0, 192, 255, 0.08); border-left: 3px solid var(--accent-blue); padding: 12px 16px; border-radius: var(--radius-sm);">
        <h4 style="color: var(--accent-blue); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 6px;">Step-by-Step CE Diagnostic Playbook</h4>
        <div style="font-family: var(--font-mono); font-size: 0.84rem; color: #fff; line-height: 1.6;">
          ${err.diagnosticSteps.map(s => `<div style="margin-bottom: 4px;">${s}</div>`).join("")}
        </div>
      </div>

      <div style="margin-top: 14px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="click-through-btn" onclick="window.switchTab('troubleshootingTab')">
          Explore Troubleshooting Reference
        </button>
      </div>
    `;
  }

  tabsContainer.querySelectorAll(".error-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      tabsContainer.querySelectorAll(".error-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      showErrorCode(btn.getAttribute("data-code"));
    });
  });

  showErrorCode(PREP_DATA.troubleshootingTree[0].code);
}

// Render Reverse Interview Questions for Candidates
function renderQuestionsForTim() {
  const container = document.getElementById("questionsForTimContainer");
  if (!container) return;

  const questions = PREP_DATA.candidateQuestionsToAsk || PREP_DATA.questionsForTimToAsk || [];
  container.innerHTML = questions.map(q => `
    <div class="card" style="margin-bottom: 1rem; border-left: 3px solid var(--accent-blue);">
      <div style="font-size: 0.75rem; color: var(--accent-blue); font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
        ${q.category}
      </div>
      <div style="font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 8px;">
        "${q.question}"
      </div>
      <div style="font-size: 0.82rem; color: var(--text-muted); background: var(--bg-tertiary); padding: 8px 12px; border-radius: var(--radius-sm);">
        🎯 <strong>Why this establishes senior credibility:</strong> ${q.whyItWorks}
      </div>
    </div>
  `).join("");
}

// Global Search Filter
function initGlobalSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return;

    window.switchTab("flashcardsTab");

    // Search across visible tab content
    const cards = document.querySelectorAll(".card, .battlecard, .blueprint-card, .question-accordion");
    cards.forEach(acc => {
      const text = acc.textContent.toLowerCase();
      if (text.includes(query)) {
        acc.style.display = "block";
        const id = acc.id.replace("accordion-", "");
        const body = document.getElementById(`body-${id}`);
        if (body) body.classList.add("open");
      } else {
        acc.style.display = "none";
      }
    });
  });
}
