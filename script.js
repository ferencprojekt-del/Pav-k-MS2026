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
