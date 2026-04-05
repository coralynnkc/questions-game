'use strict';

const LEVELS      = ['level1', 'level2', 'level3'];
const MIN_ADVANCE = 15; // minimum cards before "leave level" button appears

const state = {
  levelKey:     null,
  deck:         [],
  turnOrder:    [], // pre-shuffled player index per card (balanced random)
  cardIdx:      0,
  maxReached:   0,
  flipped:      new Set(),
  playedLevels: new Set(),
  players:      ['Player 1', 'Player 2'],
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
  ['Player 1', 'Player 2'].forEach((placeholder, i) => {
    appendNameRow(i + 1, '');
  });
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
  showCategories();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && $('screen-names').classList.contains('active')) {
    submitNames();
  }
});

// ─── Categories ───────────────────────────────────────────────

function showCategories() {
  const grid = $('cat-grid');
  grid.innerHTML = '';

  LEVELS.forEach((key, i) => {
    const level  = questions[key];
    const name   = level.label.split(': ')[1];
    const played = state.playedLevels.has(key);

    const card = document.createElement('button');
    card.className = `cat-card${played ? ' played' : ''}`;
    card.onclick = () => selectCategory(key);
    card.innerHTML = `
      <div class="cat-card-left">
        <span class="cat-num">Level ${String(i + 1).padStart(2, '0')}</span>
        <span class="cat-name">${name}</span>
      </div>
      <span class="cat-check" aria-hidden="true">✓</span>
    `;
    grid.appendChild(card);
  });

  showScreen('screen-categories');
}

function selectCategory(key) {
  state.levelKey = key;
  showTransition();
}

// ─── Level Transition ─────────────────────────────────────────

function showTransition() {
  const key   = state.levelKey;
  const level = questions[key];
  const n     = LEVELS.indexOf(key) + 1;

  $('tr-eyebrow').textContent     = `Level ${String(n).padStart(2, '0')}`;
  $('tr-title').textContent       = level.label.split(': ')[1].toUpperCase();
  $('tr-desc').textContent        = level.description;
  $('tr-instruction').textContent = level.instruction;
  $('tr-begin-btn').textContent   = 'Begin';

  showScreen('screen-transition');
}

// Build a balanced-random turn order: each player appears once per "round",
// rounds are shuffled independently so no fixed cycle is apparent.
function buildTurnOrder(deckLength, numPlayers) {
  const order = [];
  let pool = [];
  while (order.length < deckLength) {
    if (pool.length === 0) {
      pool = shuffle([...Array(numPlayers).keys()]);
    }
    order.push(pool.pop());
  }
  return order;
}

function beginLevel() {
  state.deck       = getDeck(state.levelKey);
  state.turnOrder  = buildTurnOrder(state.deck.length, state.players.length);
  state.cardIdx    = 0;
  state.maxReached = 0;
  state.flipped    = new Set();

  renderCard(false);
  showScreen('screen-game');
}

// ─── Card Rendering ───────────────────────────────────────────

function renderCard(animate) {
  const { deck, cardIdx, levelKey, players } = state;
  const card  = deck[cardIdx];
  const total = deck.length;
  const n     = LEVELS.indexOf(levelKey) + 1;

  if (cardIdx > state.maxReached) state.maxReached = cardIdx;

  // Header
  $('progress-text').textContent = `Card ${cardIdx + 1} of ${total}`;
  $('level-chip').textContent    = `Level ${n}`;

  // Turn indicator — balanced-random rotation, consistent per card index
  const askerIdx   = state.turnOrder[cardIdx];
  const answererIdx = state.turnOrder[(cardIdx + 1) % state.turnOrder.length];
  const asker      = players[askerIdx];
  const answerer   = players[answererIdx !== askerIdx ? answererIdx : (answererIdx + 1) % players.length];
  $('turn-indicator').textContent = `${asker} asks · ${answerer} answers`;

  // Card content
  $('card-body').textContent  = card.text;
  $('card-label').textContent =
    card.type === 'wildcard' ? 'Wildcard' :
    card.type === 'reminder' ? 'Reminder' : '';

  $('card-up').className = `card-side card-up type-${card.type}`;
  applyFlip(state.flipped.has(cardIdx), animate);

  $('btn-back').disabled = cardIdx === 0;
  $('btn-next').disabled = cardIdx >= total - 1;

  refreshLeaveBtn();
}

// Apply flip state — animate=true plays CSS transition, false snaps instantly
function applyFlip(isFlipped, animate) {
  const inner = $('card-inner');
  const hint  = $('tap-hint');

  if (!animate) {
    inner.style.transition = 'none';
    void inner.offsetWidth;
    inner.classList.toggle('flipped', isFlipped);
    requestAnimationFrame(() => { inner.style.transition = ''; });
  } else {
    inner.classList.toggle('flipped', isFlipped);
  }

  hint.classList.toggle('hidden', isFlipped);
}

function refreshLeaveBtn() {
  const btn        = $('btn-advance');
  const enoughSeen = state.maxReached >= MIN_ADVANCE - 1;
  btn.classList.toggle('hidden', !enoughSeen);
}

// ─── User Interactions ────────────────────────────────────────

function flipCard() {
  const { cardIdx, flipped } = state;
  const nowFlipped = !flipped.has(cardIdx);

  if (nowFlipped) flipped.add(cardIdx);
  else            flipped.delete(cardIdx);

  applyFlip(nowFlipped, true);
}

function nextCard() {
  if (state.cardIdx < state.deck.length - 1) {
    state.cardIdx++;
    renderCard(false);
  }
}

function prevCard() {
  if (state.cardIdx > 0) {
    state.cardIdx--;
    renderCard(false);
  }
}

function leaveLevel() {
  state.playedLevels.add(state.levelKey);
  showCategories();
}

function showFinalCard() {
  $('final-body').textContent = questions.finalCard.text;
  showScreen('screen-final');
}

function restartGame() {
  Object.assign(state, {
    levelKey:     null,
    deck:         [],
    turnOrder:    [],
    cardIdx:      0,
    maxReached:   0,
    flipped:      new Set(),
    playedLevels: new Set(),
    players:      ['Player 1', 'Player 2'],
  });
  showScreen('screen-welcome');
}
