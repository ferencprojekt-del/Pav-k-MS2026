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

  thirds.sort((a, b) => a.group.localeCompare(b.group));
  const bestThirds = thirds.slice(0, 8);

  const fTeams = firsts.map(x => x.team);
  const sTeams = seconds.map(x => x.team);
  const tTeams = bestThirds.map(x => x.team);

  const matches32 = [];
  function pair(a, b, idx) {
    matches32.push({ id: idx, home: a, away: b });
  }

  for (let i = 0; i < fTeams.length; i++) {
    const opp = tTeams[i] || sTeams[i];
    pair(fTeams[i], opp, i + 1);
  }

  const usedSeconds = fTeams.length;
  let matchIndex = fTeams.length + 1;
  for (let i = usedSeconds; i < sTeams.length; i += 2) {
    if (sTeams[i + 1]) {
      pair(sTeams[i], sTeams[i + 1], matchIndex++);
    }
  }

  renderRoundOf32(matches32);
});

function renderRoundOf32(matches) {
  r32Div.innerHTML = "";
  matches.forEach(m => {
    const card = document.createElement("div");
    card.className = "match-card";

    const header = document.createElement("div");
    header.className = "match-header";
    header.innerHTML = `<span>32-finále #${m.id}</span><span>Tipni víťaza v hlave 😉</span>`;
    card.appendChild(header);

    const line1 = document.createElement("div");
    line1.className = "team-line";
    line1.innerHTML = `<span class="team-label">${m.home}</span><span class="team-slot">?</span>`;

    const line2 = document.createElement("div");
    line2.className = "team-line";
    line2.innerHTML = `<span class="team-label">${m.away}</span><span class="team-slot">?</span>`;

    card.appendChild(line1);
    card.appendChild(line2);

    r32Div.appendChild(card);
  });
}
