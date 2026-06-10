// --- Dáta skupín ---
const groups = {
  A: ["USA", "Brazília", "Kolumbia", "Nový Zéland"],
  B: ["Mexiko", "Holandsko", "Ekvádor", "Japonsko"],
  C: ["Kanada", "Francúzsko", "Nigéria", "Bolívia"],
  D: ["Argentína", "Chorvátsko", "Irán", "Kostarika"],
  E: ["Španielsko", "Švédsko", "Paraguaj", "Južná Kórea"],
  F: ["Anglicko", "Uruguaj", "Tunisko", "Honduras"],
  G: ["Nemecko", "Švajčiarsko", "Kamerun", "Katar"],
  H: ["Portugalsko", "Turecko", "Ghana", "Panama"],
  I: ["Taliansko", "Čile", "Kanada B", "Saudská Arábia"],
  J: ["Belgicko", "USA B", "Egypt", "Venezuela"],
  K: ["Dánsko", "Srbsko", "Mali", "Austrália"],
  L: ["Škótsko", "Ukrajina", "Maroko", "Čína"]
};

// --- Vlajky ---
const flags = {
  "USA": "https://flagcdn.com/us.svg",
  "USA B": "https://flagcdn.com/us.svg",
  "Brazília": "https://flagcdn.com/br.svg",
  "Kolumbia": "https://flagcdn.com/co.svg",
  "Nový Zéland": "https://flagcdn.com/nz.svg",
  "Mexiko": "https://flagcdn.com/mx.svg",
  "Holandsko": "https://flagcdn.com/nl.svg",
  "Ekvádor": "https://flagcdn.com/ec.svg",
  "Japonsko": "https://flagcdn.com/jp.svg",
  "Kanada": "https://flagcdn.com/ca.svg",
  "Kanada B": "https://flagcdn.com/ca.svg",
  "Francúzsko": "https://flagcdn.com/fr.svg",
  "Nigéria": "https://flagcdn.com/ng.svg",
  "Bolívia": "https://flagcdn.com/bo.svg",
  "Argentína": "https://flagcdn.com/ar.svg",
  "Chorvátsko": "https://flagcdn.com/hr.svg",
  "Irán": "https://flagcdn.com/ir.svg",
  "Kostarika": "https://flagcdn.com/cr.svg",
  "Španielsko": "https://flagcdn.com/es.svg",
  "Švédsko": "https://flagcdn.com/se.svg",
  "Paraguaj": "https://flagcdn.com/py.svg",
  "Južná Kórea": "https://flagcdn.com/kr.svg",
  "Anglicko": "https://flagcdn.com/gb-eng.svg",
  "Uruguaj": "https://flagcdn.com/uy.svg",
  "Tunisko": "https://flagcdn.com/tn.svg",
  "Honduras": "https://flagcdn.com/hn.svg",
  "Nemecko": "https://flagcdn.com/de.svg",
  "Švajčiarsko": "https://flagcdn.com/ch.svg",
  "Kamerun": "https://flagcdn.com/cm.svg",
  "Katar": "https://flagcdn.com/qa.svg",
  "Portugalsko": "https://flagcdn.com/pt.svg",
  "Turecko": "https://flagcdn.com/tr.svg",
  "Ghana": "https://flagcdn.com/gh.svg",
  "Panama": "https://flagcdn.com/pa.svg",
  "Taliansko": "https://flagcdn.com/it.svg",
  "Čile": "https://flagcdn.com/cl.svg",
  "Saudská Arábia": "https://flagcdn.com/sa.svg",
  "Belgicko": "https://flagcdn.com/be.svg",
  "Egypt": "https://flagcdn.com/eg.svg",
  "Venezuela": "https://flagcdn.com/ve.svg",
  "Dánsko": "https://flagcdn.com/dk.svg",
  "Srbsko": "https://flagcdn.com/rs.svg",
  "Mali": "https://flagcdn.com/ml.svg",
  "Austrália": "https://flagcdn.com/au.svg",
  "Škótsko": "https://flagcdn.com/gb-sct.svg",
  "Ukrajina": "https://flagcdn.com/ua.svg",
  "Maroko": "https://flagcdn.com/ma.svg",
  "Čína": "https://flagcdn.com/cn.svg"
};

const groupsDiv = document.getElementById("groups");
const errorEl = document.getElementById("error");

const r32Div = document.getElementById("r32");
const r16Div = document.getElementById("r16");
const r8Div = document.getElementById("r8");
const r4Div = document.getElementById("r4");
const r2Div = document.getElementById("r2");
const winnerDiv = document.getElementById("winner");

// --- Pomocné funkcie ---
function teamWithFlag(name) {
  const url = flags[name] || "";
  if (!url) return name;
  return `<span class="team-with-flag"><img class="flag" src="${url}" alt="">${name}</span>`;
}

// --- 1. Vygeneruj zápasy skupín ---
function createGroupMatches() {
  Object.entries(groups).forEach(([groupName, teams]) => {
    const card = document.createElement("div");
    card.className = "group-card";
    card.dataset.group = groupName;

    const header = document.createElement("div");
    header.className = "group-header";
    header.innerHTML = `<h3>Skupina ${groupName}</h3><span class="group-tag">4 tímy</span>`;
    card.appendChild(header);

    const matches = [
      [teams[0], teams[1]],
      [teams[0], teams[2]],
      [teams[0], teams[3]],
      [teams[1], teams[2]],
      [teams[1], teams[3]],
      [teams[2], teams[3]]
    ];

    matches.forEach(([teamA, teamB], idx) => {
      const row = document.createElement("div");
      row.className = "match-row";

      const keyA = `${groupName}_${idx}_A`;
      const keyB = `${groupName}_${idx}_B`;

      row.innerHTML = `
        <span class="team-name">${teamA}</span>
        <input type="number" min="0" class="score-input" data-group="${groupName}" data-team="${teamA}" data-key="${keyA}">
        <span>:</span>
        <input type="number" min="0" class="score-input" data-group="${groupName}" data-team="${teamB}" data-key="${keyB}">
        <span class="team-name">${teamB}</span>
      `;

      card.appendChild(row);
    });

    const tableContainer = document.createElement("div");
    tableContainer.className = "group-table-container";
    card.appendChild(tableContainer);

    groupsDiv.appendChild(card);
  });
}

createGroupMatches();

// --- LocalStorage: načítanie skóre ---
function loadScores() {
  const saved = JSON.parse(localStorage.getItem("scores_ms2026") || "{}");
  Object.entries(saved).forEach(([key, val]) => {
    const input = document.querySelector(`input[data-key="${key}"]`);
    if (input) input.value = val;
  });
}

function saveScores() {
  const allInputs = document.querySelectorAll(".score-input");
  const data = {};
  allInputs.forEach(inp => {
    if (inp.value !== "") data[inp.dataset.key] = inp.value;
  });
  localStorage.setItem("scores_ms2026", JSON.stringify(data));
}

// --- Tabuľka skupiny ---
function initTable(teams) {
  const table = {};
  teams.forEach(t => {
    table[t] = {
      team: t,
      points: 0,
      scored: 0,
      conceded: 0,
      diff: 0,
      h2h: {}
    };
  });
  return table;
}

function processMatch(table, teamA, teamB, goalsA, goalsB) {
  goalsA = parseInt(goalsA);
  goalsB = parseInt(goalsB);
  if (isNaN(goalsA) || isNaN(goalsB)) return;

  table[teamA].scored += goalsA;
  table[teamA].conceded += goalsB;
  table[teamB].scored += goalsB;
  table[teamB].conceded += goalsA;

  table[teamA].diff = table[teamA].scored - table[teamA].conceded;
  table[teamB].diff = table[teamB].scored - table[teamB].conceded;

  if (goalsA > goalsB) table[teamA].points += 3;
  else if (goalsB > goalsA) table[teamB].points += 3;
  else {
    table[teamA].points += 1;
    table[teamB].points += 1;
  }

  table[teamA].h2h[teamB] = goalsA - goalsB;
  table[teamB].h2h[teamA] = goalsB - goalsA;
}

function compareTeams(a, b, table) {
  const A = table[a];
  const B = table[b];

  if (A.points !== B.points) return B.points - A.points;
  if (A.diff !== B.diff) return B.diff - A.diff;
  if (A.scored !== B.scored) return B.scored - A.scored;

  if (A.h2h[b] !== undefined) {
    const h2hA = A.h2h[b];
    const h2hB = B.h2h[a];
    if (h2hA !== h2hB) return h2hB - h2hA;
  }

  return 0;
}

function calculateGroup(groupName, teams, requireComplete = false) {
  const table = initTable(teams);
  const inputs = document.querySelectorAll(`input[data-group="${groupName}"]`);

  for (let i = 0; i < inputs.length; i += 2) {
    const teamA = inputs[i].dataset.team;
    const teamB = inputs[i + 1].dataset.team;
    const goalsA = inputs[i].value;
    const goalsB = inputs[i + 1].value;

    if (goalsA === "" || goalsB === "") {
      if (requireComplete) return null;
      continue;
    }

    processMatch(table, teamA, teamB, goalsA, goalsB);
  }

  const order = [...teams].sort((a, b) => compareTeams(a, b, table));
  return { order, table };
}

function renderGroupTable(groupName, result) {
  const card = document.querySelector(`.group-card[data-group="${groupName}"]`);
  if (!card) return;

  let container = card.querySelector(".group-table-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "group-table-container";
    card.appendChild(container);
  }

  container.innerHTML = "";

  if (!result) return;

  const { order, table } = result;

  let html = `
    <table class="group-table">
      <tr>
        <th>Tím</th>
        <th>B</th>
        <th>G+</th>
        <th>G-</th>
        <th>+/-</th>
      </tr>
  `;

  order.forEach((t, i) => {
    const cls = ["first", "second", "third", "fourth"][i] || "";
    const row = table[t];
    html += `
      <tr class="${cls} row-animated">
        <td>${teamWithFlag(t)}</td>
        <td>${row.points}</td>
        <td>${row.scored}</td>
        <td>${row.conceded}</td>
        <td>${row.diff}</td>
      </tr>
    `;
  });

  html += `</table>`;
  container.innerHTML = html;
}

// --- Live prepočet skupín ---
function recalcAllGroups() {
  Object.entries(groups).forEach(([gName, teams]) => {
    const res = calculateGroup(gName, [...teams], false);
    renderGroupTable(gName, res);
  });
}

// --- Po načítaní: načítaj skóre a prepočítaj ---
loadScores();
recalcAllGroups();

// --- Reakcia na zmenu skóre ---
document.querySelectorAll(".score-input").forEach(input => {
  input.addEventListener("input", () => {
    saveScores();
    errorEl.textContent = "";
    recalcAllGroups();
  });
});

// --- 3. Generovanie play-off po kliknutí ---
document.getElementById("generate").addEventListener("click", () => {
  errorEl.textContent = "";

  const firsts = [];
  const seconds = [];
  const thirds = [];

  for (const [groupName, teams] of Object.entries(groups)) {
    const result = calculateGroup(groupName, [...teams], true);

    if (!result) {
      errorEl.textContent = `Skupina ${groupName}: musíš vyplniť všetky výsledky.`;
      return;
    }

    const order = result.order;
    firsts.push(order[0]);
    seconds.push(order[1]);
    thirds.push(order[2]);
  }

  // jednoduchý výber 8 najlepších tretích – prvých 8
  const bestThirds = thirds.slice(0, 8);

  generatePlayoff(firsts, seconds, bestThirds);
});

// --- 4. Play-off generátor ---
function generatePlayoff(firsts, seconds, thirds) {
  const matches32 = [];
  let id = 1;

  const thirdPool = [...thirds];
  const secondPool = [...seconds];

  firsts.forEach(f => {
    let opp = thirdPool.shift() || secondPool.shift();
    matches32.push({ id: id++, home: f, away: opp });
  });

  for (let i = 0; i < secondPool.length; i += 2) {
    if (secondPool[i + 1]) {
      matches32.push({
        id: id++,
        home: secondPool[i],
        away: secondPool[i + 1]
      });
    }
  }

  if (matches32.length !== 16) {
    errorEl.textContent = `Chyba: 32-finále nemá 16 zápasov (má ${matches32.length}).`;
    return;
  }

  r32Div.innerHTML = "";
  r16Div.innerHTML = "";
  r8Div.innerHTML = "";
  r4Div.innerHTML = "";
  r2Div.innerHTML = "";
  winnerDiv.innerHTML = "";

  renderRound(matches32, r32Div, "32-finále", winners => {
    renderNextRound(winners, r16Div, "Osemfinále", w16 => {
      renderNextRound(w16, r8Div, "Štvrťfinále", w8 => {
        renderNextRound(w8, r4Div, "Semifinále", w4 => {
          renderNextRound(w4, r2Div, "Finále", w2 => {
            if (w2.length === 1) {
              winnerDiv.textContent = `Tvoj majster sveta: ${w2[0]}`;
            }
          });
        });
      });
    });
  });
}

// --- 5. Klikateľné zápasy play-off ---
function renderRound(matches, container, label, onComplete) {
  container.innerHTML = "";
  const winners = new Array(matches.length).fill(null);

  matches.forEach((m, index) => {
    const card = document.createElement("div");
    card.className = "match-card";

    const header = document.createElement("div");
    header.className = "match-header";
    header.innerHTML = `<span>${label} #${m.id}</span><span>Vyber víťaza</span>`;
    card.appendChild(header);

    const btnA = document.createElement("button");
    btnA.className = "team-btn";
    btnA.innerHTML = teamWithFlag(m.home);

    const btnB = document.createElement("button");
    btnB.className = "team-btn";
    btnB.innerHTML = teamWithFlag(m.away);

    btnA.onclick = () => setWinner(btnA, btnB, m.home);
    btnB.onclick = () => setWinner(btnB, btnA, m.away);

    function setWinner(winBtn, loseBtn, team) {
      winBtn.classList.add("winner");
      loseBtn.classList.add("loser");
      winBtn.disabled = true;
      loseBtn.disabled = true;
      winners[index] = team;

      if (winners.every(w => w !== null)) onComplete(winners);
    }

    card.appendChild(btnA);
    card.appendChild(btnB);
    container.appendChild(card);
  });
}

function renderNextRound(winners, container, label, onComplete) {
  const matches = [];
  let id = 1;

  for (let i = 0; i < winners.length; i += 2) {
    if (winners[i + 1]) {
      matches.push({
        id: id++,
        home: winners[i],
        away: winners[i + 1]
      });
    }
  }

  if (matches.length === 0) return;
  renderRound(matches, container, label, onComplete);
}
