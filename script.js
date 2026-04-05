'use strict';

const LEVELS      = ['level1', 'level2', 'level3'];
const MIN_ADVANCE = 15; // minimum cards before "advance" button appears

const state = {
  levelIdx:    0,
  deck:        [],
  cardIdx:     0,
  maxReached:  0,   // highest card index visited this level
  flipped:     new Set(),
};

// ─── Utilities ────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  $(id).classList.add('active');
}

// ─── Welcome ──────────────────────────────────────────────────

function startGame() {
  state.levelIdx = 0;
  showTransition();
}

// ─── Level Transition ─────────────────────────────────────────

function showTransition() {
  const key   = LEVELS[state.levelIdx];
  const level = questions[key];
  const n     = state.levelIdx + 1;
  const pad   = String(n).padStart(2, '0');

  $('tr-eyebrow').textContent     = `Level ${pad}`;
  $('tr-title').textContent       = level.label.split(': ')[1].toUpperCase();
  $('tr-desc').textContent        = level.description;
  $('tr-instruction').textContent = level.instruction;
  $('tr-begin-btn').textContent   = state.levelIdx === 0 ? 'Begin' : `Begin Level ${n}`;

  showScreen('screen-transition');
}

function beginLevel() {
  const key = LEVELS[state.levelIdx];

  state.deck       = getDeck(key);
  state.cardIdx    = 0;
  state.maxReached = 0;
  state.flipped    = new Set();

  renderCard(false);
  showScreen('screen-game');
}

// ─── Card Rendering ───────────────────────────────────────────

function renderCard(animate) {
  const { deck, cardIdx, levelIdx } = state;
  const card  = deck[cardIdx];
  const total = deck.length;

  // Track furthest card navigated to
  if (cardIdx > state.maxReached) state.maxReached = cardIdx;

  // Header
  $('progress-text').textContent = `Card ${cardIdx + 1} of ${total}`;
  $('level-chip').textContent    = `Level ${levelIdx + 1}`;

  // Card content
  $('card-body').textContent  = card.text;
  $('card-label').textContent =
    card.type === 'wildcard' ? 'Wildcard' :
    card.type === 'reminder' ? 'Reminder' : '';

  // Apply type class to face-up side
  $('card-up').className = `card-side card-up type-${card.type}`;

  // Flip state (instant swap when navigating, animated when user taps)
  applyFlip(state.flipped.has(cardIdx), animate);

  // Navigation buttons
  $('btn-back').disabled = cardIdx === 0;
  $('btn-next').disabled = cardIdx >= total - 1;

  // Advance / finish button
  refreshAdvanceBtn();
}

// Apply flip state — animate=true plays CSS transition, false snaps instantly
function applyFlip(isFlipped, animate) {
  const inner = $('card-inner');
  const hint  = $('tap-hint');

  if (!animate) {
    inner.style.transition = 'none';
    void inner.offsetWidth; // force reflow so the transition removal takes effect
    inner.classList.toggle('flipped', isFlipped);
    requestAnimationFrame(() => { inner.style.transition = ''; });
  } else {
    inner.classList.toggle('flipped', isFlipped);
  }

  hint.classList.toggle('hidden', isFlipped);
}

function refreshAdvanceBtn() {
  const btn         = $('btn-advance');
  const enoughSeen  = state.maxReached >= MIN_ADVANCE - 1; // index 14 = 15th card
  const isLastLevel = state.levelIdx === LEVELS.length - 1;

  if (enoughSeen) {
    btn.classList.remove('hidden');
    btn.textContent = isLastLevel
      ? 'Finish Game →'
      : `Advance to Level ${state.levelIdx + 2} →`;
  } else {
    btn.classList.add('hidden');
  }
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

function advanceLevel() {
  if (state.levelIdx >= LEVELS.length - 1) {
    $('final-body').textContent = questions.finalCard.text;
    showScreen('screen-final');
  } else {
    state.levelIdx++;
    showTransition();
  }
}

function restartGame() {
  Object.assign(state, {
    levelIdx:   0,
    deck:       [],
    cardIdx:    0,
    maxReached: 0,
    flipped:    new Set(),
  });
  showScreen('screen-welcome');
}
