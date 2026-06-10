// --- Dáta skupín (môžeš si ich upraviť) ---
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

const groupsDiv = document.getElementById("groups");
const r32Div = document.getElementById("r32");
const r16Div = document.getElementById("r16");
const r8Div = document.getElementById("r8");
const r4Div = document.getElementById("r4");
const r2Div = document.getElementById("r2");
const winnerDiv = document.getElementById("winner");

// --- Vykreslenie skupín ---
function createGroupUI() {
  Object.entries(groups).forEach(([name, teams]) => {
    const card = document.createElement("div");
    card.className = "group-card";

    const header = document.createElement("div");
    header.className = "group-header";
    header.innerHTML = `<h3>Skupina ${name}</h3><span class="group-tag">4 tímy</span>`;
    card.appendChild(header);

    teams.forEach(team => {
      const row = document.createElement("div");
      row.className = "team-row";

      const label = document.createElement("div");
      label.className = "team-name";
      label.textContent = team;

      const select = document.createElement("select");
      select.className = "team-select";
      select.dataset.group = name;
      select.dataset.team = team;

      for (let i = 1; i <= 4; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${i}. miesto`;
        select.appendChild(opt);
      }

      row.appendChild(label);
      row.appendChild(select);
      card.appendChild(row);
    });

    groupsDiv.appendChild(card);
  });
}

createGroupUI();

// --- Generovanie pavúka po kliknutí na tlačidlo ---
document.getElementById("generate").addEventListener("click", () => {
  const selects = document.querySelectorAll(".team-select");
  const standings = {};

  selects.forEach(sel => {
    const g = sel.dataset.group;
    const t = sel.dataset.team;
    const pos = parseInt(sel.value, 10);
    if (!standings[g]) standings[g] = [];
    standings[g].push({ team: t, pos });
  });

  Object.keys(standings).forEach(g => {
    standings[g].sort((a, b) => a.pos - b.pos);
  });

  const firsts = [];
  const seconds = [];
  const thirds = [];

  Object.entries(standings).forEach(([g, arr]) => {
    firsts.push({ group: g, team: arr[0].team });
    seconds.push({ group: g, team: arr[1].team });
    thirds.push({ group: g, team: arr[2].team });
  });

  // "Najlepšie" tretie – pre jednoduchosť prvých 8 podľa abecedy skupín
  thirds.sort((a, b) => a.group.localeCompare(b.group));
  const bestThirds = thirds.slice(0, 8);

  const fTeams = firsts.map(x => x.team);
  const sTeams = seconds.map(x => x.team);
  const tTeams = bestThirds.map(x => x.team);

  const matches32 = [];
  let id = 1;

  // 1. miesta vs tretie (alebo druhé, ak tretie chýba)
  for (let i = 0; i < fTeams.length; i++) {
    const opp = tTeams[i] || sTeams[i];
    matches32.push({ id: id++, home: fTeams[i], away: opp });
  }

  // zvyšné druhé medzi sebou
  const usedSeconds = fTeams.length;
  for (let i = usedSeconds; i < sTeams.length; i += 2) {
    if (sTeams[i + 1]) {
      matches32.push({ id: id++, home: sTeams[i], away: sTeams[i + 1] });
    }
  }

  // vyčisti staré kolá
  r16Div.innerHTML = "";
  r8Div.innerHTML = "";
  r4Div.innerHTML = "";
  r2Div.innerHTML = "";
  winnerDiv.innerHTML = "";

  renderRound(matches32, r32Div, "32-finále", (winners) => {
    renderNextRound(winners, r16Div, "Osemfinále", (w16) => {
      renderNextRound(w16, r8Div, "Štvrťfinále", (w8) => {
        renderNextRound(w8, r4Div, "Semifinále", (w4) => {
          renderNextRound(w4, r2Div, "Finále", (w2) => {
            if (w2.length === 1) {
              winnerDiv.textContent = `Tvoj majster sveta: ${w2[0]}`;
            }
          });
        });
      });
    });
  });
});

// --- Vykreslenie jedného kola s klikateľnými zápasmi ---
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

    const btnHome = document.createElement("button");
    btnHome.className = "team-btn";
    btnHome.textContent = m.home;

    const btnAway = document.createElement("button");
    btnAway.className = "team-btn";
    btnAway.textContent = m.away;

    btnHome.addEventListener("click", () => {
      setWinner(btnHome, btnAway, m.home);
    });

    btnAway.addEventListener("click", () => {
      setWinner(btnAway, btnHome, m.away);
    });

    function setWinner(wBtn, lBtn, team) {
      wBtn.classList.add("winner");
      lBtn.classList.add("loser");
      wBtn.disabled = true;
      lBtn.disabled = true;
      winners[index] = team;

      if (winners.every(w => w !== null)) {
        onComplete(winners);
      }
    }

    card.appendChild(btnHome);
    card.appendChild(btnAway);
    container.appendChild(card);
  });
}

// --- Z víťazov vygeneruje ďalšie kolo (párovanie po dvoch) ---
function renderNextRound(winners, container, label, onComplete) {
  const matches = [];
  let id = 1;
  for (let i = 0; i < winners.length; i += 2) {
    if (winners[i + 1]) {
      matches.push({ id: id++, home: winners[i], away: winners[i + 1] });
    }
  }
  if (matches.length === 0) return;
  renderRound(matches, container, label, onComplete);
}
