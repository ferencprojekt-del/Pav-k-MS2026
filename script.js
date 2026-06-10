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
const errorEl = document.getElementById("error");

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

      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = "-";
      select.appendChild(emptyOpt);

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

  // zabezpeč unikátne poradie v rámci skupiny
  document.querySelectorAll(".team-select").forEach(sel => {
    sel.addEventListener("change", () => {
      enforceUniquePositions(sel.dataset.group);
    });
  });
}

createGroupUI();

// --- Unikátne poradie v skupine (1–4 len raz) ---
function enforceUniquePositions(groupName) {
  const selects = Array.from(document.querySelectorAll(`select[data-group="${groupName}"]`));
  const used = new Map();

  selects.forEach(sel => {
    const val = sel.value;
    if (val === "") return;
    if (used.has(val) && used.get(val) !== sel) {
      // kolízia – zrušíme aktuálny výber
      sel.value = "";
    } else {
      used.set(val, sel);
    }
  });
}

// --- Generovanie pavúka po kliknutí na tlačidlo ---
document.getElementById("generate").addEventListener("click", () => {
  errorEl.textContent = "";

  const selects = document.querySelectorAll(".team-select");
  const standings = {};

  selects.forEach(sel => {
    const g = sel.dataset.group;
    const t = sel.dataset.team;
    const val = sel.value === "" ? null : parseInt(sel.value, 10);
    if (!standings[g]) standings[g] = [];
    standings[g].push({ team: t, pos: val });
  });

  // kontrola: každá skupina musí mať presne 1,2,3,4
  for (const [g, arr] of Object.entries(standings)) {
    const positions = arr.map(x => x.pos).sort((a, b) => (a ?? 0) - (b ?? 0));
    const expected = [1, 2, 3, 4];
    if (positions.some(p => p === null) || positions.length !== 4) {
      errorEl.textContent = `Skupina ${g}: musíš nastaviť poradie 1.–4. bez prázdnych miest.`;
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (positions[i] !== expected[i]) {
        errorEl.textContent = `Skupina ${g}: každé miesto 1.–4. môže byť použité len raz.`;
        return;
      }
    }
  }

  // zoradenie v skupinách
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

  const fTeams = firsts.map(x => x.team);   // 12
  const sTeams = seconds.map(x => x.team);  // 12
  const tTeams = bestThirds.map(x => x.team); // 8

  const matches32 = [];
  let id = 1;

  // 1. miesta vs tretie (alebo druhé, ak tretie chýba)
  const thirdPool = [...tTeams];
  const secondPool = [...sTeams];

  for (let i = 0; i < fTeams.length; i++) {
    let opp = null;
    if (thirdPool.length > 0) {
      opp = thirdPool.shift();
    } else if (secondPool.length > 0) {
      opp = secondPool.shift();
    }
    matches32.push({ id: id++, home: fTeams[i], away: opp });
  }

  // zvyšné druhé medzi sebou
  const restSeconds = [...secondPool];
  for (let i = 0; i < restSeconds.length; i += 2) {
    if (restSeconds[i + 1]) {
      matches32.push({ id: id++, home: restSeconds[i], away: restSeconds[i + 1] });
    }
  }

  // očakávame 16 zápasov
  if (matches32.length !== 16) {
    errorEl.textContent = `Chyba v generovaní 32-finále (zápasov je ${matches32.length}, malo by byť 16).`;
    return;
  }

  // vyčisti staré kolá
  r32Div.innerHTML = "";
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
