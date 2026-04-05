'use strict';

const LEVELS = ['level1', 'level2', 'level3'];

const state = {
  levelDecks: {},   // { level1: [...], level2: [...], level3: [...] } — refilled when empty
  currentCard: null,
  currentLevelKey: null,
  flipped: false,
  turnIdx: 0,
  players: ['Player 1', 'Player 2'],
};

// ─── Utilities ────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  $(id).classList.add('active');
}

// ─── Welcome ──────────────────────────────────────────────────

function startGame() {
  initNameRows();
  showScreen('screen-names');
}

// ─── Names ────────────────────────────────────────────────────

function initNameRows() {
  const list = $('names-list');
  list.innerHTML = '';
  [1, 2].forEach(n => appendNameRow(n, ''));
  list.querySelector('.name-input').focus();
}

function appendNameRow(num, value) {
  const list = $('names-list');
  const row  = document.createElement('div');
  row.className = 'name-row';
  row.innerHTML = `
    <input class="name-input" type="text" placeholder="Player ${num}" maxlength="20" autocomplete="off" value="${value}" />
    <button class="name-remove" onclick="removePlayer(this)" aria-label="Remove player">×</button>
  `;
  list.appendChild(row);
  syncRemoveButtons();
}

function addPlayer() {
  const count = $('names-list').querySelectorAll('.name-row').length;
  if (count >= 8) return;
  appendNameRow(count + 1, '');
  $('names-list').lastElementChild.querySelector('.name-input').focus();
}

function removePlayer(btn) {
  btn.closest('.name-row').remove();
  renumberPlaceholders();
  syncRemoveButtons();
}

function renumberPlaceholders() {
  $('names-list').querySelectorAll('.name-input').forEach((input, i) => {
    input.placeholder = `Player ${i + 1}`;
  });
}

function syncRemoveButtons() {
  const rows = $('names-list').querySelectorAll('.name-row');
  const show = rows.length > 2;
  rows.forEach(row => {
    row.querySelector('.name-remove').style.visibility = show ? 'visible' : 'hidden';
  });
}

function submitNames() {
  const inputs = $('names-list').querySelectorAll('.name-input');
  state.players = Array.from(inputs).map((inp, i) =>
    inp.value.trim() || `Player ${i + 1}`
  );
  beginGame();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && $('screen-names').classList.contains('active')) {
    submitNames();
  }
});

// ─── Game ─────────────────────────────────────────────────────

function beginGame() {
  // Build a shuffled deck for each level
  LEVELS.forEach(key => {
    state.levelDecks[key] = getDeck(key);
  });
  state.turnIdx = 0;
  showScreen('screen-game');
  startTurn();
}

// Draw from a level's deck; reshuffle when empty
function drawCard(levelKey) {
  if (state.levelDecks[levelKey].length === 0) {
    state.levelDecks[levelKey] = getDeck(levelKey);
  }
  return state.levelDecks[levelKey].pop();
}

// ─── Turn Flow ────────────────────────────────────────────────

function startTurn() {
  const player = state.players[state.turnIdx % state.players.length];

  // Build level picker
  const grid = $('pick-grid');
  grid.innerHTML = '';
  LEVELS.forEach((key, i) => {
    const level = questions[key];
    const name  = level.label.split(': ')[1];
    const btn   = document.createElement('button');
    btn.className = 'pick-card';
    btn.onclick   = () => pickLevel(key);
    btn.innerHTML = `
      <span class="cat-num">Level ${String(i + 1).padStart(2, '0')}</span>
      <span class="cat-name">${name}</span>
    `;
    grid.appendChild(btn);
  });

  $('pick-turn').textContent = `${player}'s Turn`;

  $('pick-view').classList.remove('hidden');
  $('card-view').classList.add('hidden');
}

function pickLevel(key) {
  const player = state.players[state.turnIdx % state.players.length];
  const card   = drawCard(key);
  const n      = LEVELS.indexOf(key) + 1;

  state.currentCard     = card;
  state.currentLevelKey = key;
  state.flipped         = false;

  // Populate card
  $('turn-label').textContent = player;
  $('level-chip').textContent = `Level ${n}`;
  $('card-body').textContent  = card.text;
  $('card-label').textContent =
    card.type === 'wildcard' ? 'Wildcard' :
    card.type === 'reminder' ? 'Reminder' : '';
  $('card-up').className = `card-side card-up type-${card.type}`;

  // Reset flip state (snap, no animation)
  const inner = $('card-inner');
  inner.style.transition = 'none';
  void inner.offsetWidth;
  inner.classList.remove('flipped');
  requestAnimationFrame(() => { inner.style.transition = ''; });

  $('tap-hint').classList.remove('hidden');

  $('pick-view').classList.add('hidden');
  $('card-view').classList.remove('hidden');
}

function flipCard() {
  state.flipped = !state.flipped;
  $('card-inner').classList.toggle('flipped', state.flipped);
  $('tap-hint').classList.toggle('hidden', state.flipped);
}

function nextTurn() {
  state.turnIdx++;
  startTurn();
}

// ─── Final Card / Restart ─────────────────────────────────────

function showFinalCard() {
  $('final-body').textContent = questions.finalCard.text;
  showScreen('screen-final');
}

function restartGame() {
  Object.assign(state, {
    levelDecks:      {},
    currentCard:     null,
    currentLevelKey: null,
    flipped:         false,
    turnIdx:         0,
    players:         ['Player 1', 'Player 2'],
  });
  showScreen('screen-welcome');
}
