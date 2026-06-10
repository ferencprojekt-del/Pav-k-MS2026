let tips = {};

async function loadMatches() {
  const res = await fetch('matches.json');
  const matches = await res.json();

  const container = document.getElementById('matches');

  const saved = localStorage.getItem('tips');
  if (saved) tips = JSON.parse(saved);

  let currentGroup = "";

  matches.forEach(match => {

    if (match.group !== currentGroup) {
      currentGroup = match.group;
      const title = document.createElement('div');
      title.className = 'group-title';
      title.textContent = `Skupina ${currentGroup}`;
      container.appendChild(title);
    }

    const row = document.createElement('div');
    row.className = 'match';

    const home = document.createElement('div');
    home.className = 'team';
    home.innerHTML = `<img src="${match.home.flag}"> ${match.home.team}`;

    const away = document.createElement('div');
    away.className = 'team';
    away.innerHTML = `<img src="${match.away.flag}"> ${match.away.team}`;

    const opts = document.createElement('div');
    opts.className = 'options';

    ['1', 'X', '2'].forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;

      if (tips[match.id] === opt) btn.classList.add('active');

      btn.addEventListener('click', () => {
        tips[match.id] = opt;
        localStorage.setItem('tips', JSON.stringify(tips));
        [...opts.children].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });

      opts.appendChild(btn);
    });

    row.appendChild(home);
    row.appendChild(document.createTextNode("vs."));
    row.appendChild(away);
    row.appendChild(opts);

    container.appendChild(row);
  });
}

loadMatches();
let tips = {};

async function loadMatches() {
  const res = await fetch('matches.json');
  const matches = await res.json();

  const container = document.getElementById('matches');

  // načítaj uložené tipy z localStorage
  const saved = localStorage.getItem('tips');
  if (saved) {
    tips = JSON.parse(saved);
  }

  matches.forEach(match => {
    const row = document.createElement('div');
    row.className = 'match';

    const label = document.createElement('span');
    label.textContent = `${match.stage}: ${match.home} - ${match.away}`;
    row.appendChild(label);

    const homeInput = document.createElement('input');
    homeInput.type = 'number';
    homeInput.min = 0;
    homeInput.value = tips[match.id]?.home ?? '';
    row.appendChild(homeInput);

    const sep = document.createElement('span');
    sep.textContent = ':';
    row.appendChild(sep);

    const awayInput = document.createElement('input');
    awayInput.type = 'number';
    awayInput.min = 0;
    awayInput.value = tips[match.id]?.away ?? '';
    row.appendChild(awayInput);

    homeInput.addEventListener('input', () => {
      saveToMemory(match.id, homeInput.value, awayInput.value);
    });

    awayInput.addEventListener('input', () => {
      saveToMemory(match.id, homeInput.value, awayInput.value);
    });

    container.appendChild(row);
  });
}

function saveToMemory(id, home, away) {
  tips[id] = { home, away };
}

function saveToLocalStorage() {
  localStorage.setItem('tips', JSON.stringify(tips));
  alert('Tipy uložené v tomto prehliadači.');
}

document.getElementById('save').addEventListener('click', saveToLocalStorage);

loadMatches();
