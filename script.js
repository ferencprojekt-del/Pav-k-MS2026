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

const groupsDiv = document.getElementById('groups');

function createGroupUI() {
  Object.entries(groups).forEach(([name, teams]) => {
    const div = document.createElement('div');
    div.className = 'group';
    div.innerHTML = `<h2>Skupina ${name}</h2>`;
    teams.forEach(team => {
      const row = document.createElement('div');
      row.className = 'team-row';
      const label = document.createElement('span');
      label.textContent = team;
      const select = document.createElement('select');
      select.dataset.group = name;
      select.dataset.team = team;
      for (let i = 1; i <= 4; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${i}. miesto`;
        select.appendChild(opt);
      }
      row.appendChild(label);
      row.appendChild(select);
      div.appendChild(row);
    });
    groupsDiv.appendChild(div);
  });
}

createGroupUI();

document.getElementById('generate').addEventListener('click', () => {
  const selects = document.querySelectorAll('select');
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
    firsts.push(arr[0].team);
    seconds.push(arr[1].team);
    thirds.push(arr[2].team);
  });

  const bestThirds = thirds.slice(0, 8);

  const roundOf32 = [];
  function pair(a, b) { roundOf32.push(`${a} vs ${b}`); }

  for (let i = 0; i < firsts.length; i++) {
    const opp = bestThirds[i] || seconds[i];
    pair(firsts[i], opp);
  }

  const bracketEl = document.getElementById('bracket');
  bracketEl.textContent =
    '32-finále:\n' +
    roundOf32.map((m, i) => `${i + 1}. ${m}`).join('\n');
});
