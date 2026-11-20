/* ============================================================
 * SHL AMCAT Portal clone — application logic
 * ============================================================ */

'use strict';

const $  = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const STORE_KEY = 'shl-amcat-clone-v1';

const state = {
  sectionsDone: {},        // sectionId -> true when completed
  answers: {},             // sectionId -> { questionIndex -> value }
  remaining: {},           // sectionId -> seconds left (persisted)
  editorLang: {},          // sectionId -> { qIndex -> languageId }
  langId: 'cpp20',
  qPanePct: null,          // coding screen splitter position (percent)
  currentSection: null,    // transient
  currentIndex: 0,         // transient
  selectedId: null,        // transient - section chosen on the assessments page
  editMode: false,         // transient - personal-details form opened from the menu
};

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.sectionsDone = data.sectionsDone || {};
    state.answers      = data.answers || {};
    state.remaining    = data.remaining || {};
    state.editorLang   = data.editorLang || {};
    state.langId       = data.langId || 'cpp20';
    state.qPanePct     = data.qPanePct || null;
  } catch (e) { /* corrupted store - start fresh */ }
}
function persist() {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    sectionsDone: state.sectionsDone,
    answers:      state.answers,
    remaining:    state.remaining,
    editorLang:   state.editorLang,
    langId:       state.langId,
    qPanePct:     state.qPanePct
  }));
}

/* ------------------------------------------------------------
 * Candidate details (separate localStorage key, stored as JSON
 * { regNo, name, email, contact, secq, seca, agreedTC })
 * ------------------------------------------------------------ */
const CANDIDATE_KEY = 'shl-amcat-candidate-v1';
let candidate = null;

function loadCandidate() {
  candidate = null;
  try {
    const raw = localStorage.getItem(CANDIDATE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data && typeof data === 'object') {
      candidate = {
        regNo:    String(data.regNo || ''),
        name:     String(data.name || ''),
        email:    String(data.email || ''),
        contact:  String(data.contact || ''),
        secq:     String(data.secq || ''),
        seca:     String(data.seca || ''),
        agreedTC: !!data.agreedTC
      };
    }
  } catch (e) { candidate = null; }
}

function saveCandidate(c) {
  try {
    localStorage.setItem(CANDIDATE_KEY, JSON.stringify(c));
  } catch (e) { /* storage unavailable */ }
  candidate = c;
}

function candidateComplete() {
  return !!(candidate && candidate.regNo && candidate.name);
}

function renderMenuProfile() {
  $('#profile-val-name').textContent  = (candidate && candidate.name) || '\u2014';
  $('#profile-val-pid').textContent   = (candidate && candidate.regNo) ? candidate.regNo : '\u2014';
  $('#profile-val-alang').textContent = 'English (US)';
  $('#profile-val-nlang').textContent = 'English (US)';
}

const SECTION_MAP = {};
window.SECTIONS.forEach(s => { SECTION_MAP[s.id] = s; });

const CODING_SECTIONS = { automata: true, autofix: true };

function sectionQuestions(id) { return window.BANK[id]; }

function isAnswered(secId, idx) {
  const a = state.answers[secId];
  return a ? (a[idx] !== undefined && a[idx] !== null) : false;
}

function answeredCount(secId) {
  const q = sectionQuestions(secId);
  let n = 0;
  for (let i = 0; i < q.length; i++) if (isAnswered(secId, i)) n++;
  return n;
}

function nextIncomplete() {
  const ordered = window.SECTIONS.slice().sort((a, b) => a.order - b.order);
  return ordered.find(s => !state.sectionsDone[s.id]) || null;
}

/* ------------------------------------------------------------
 * Toast
 * ------------------------------------------------------------ */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ------------------------------------------------------------
 * Modal helpers
 * ------------------------------------------------------------ */
function openModal(id)  { $('#' + id).classList.add('open'); }
function closeModal(id) { $('#' + id).classList.remove('open'); }

/* ------------------------------------------------------------
 * Header configuration per view
 * ------------------------------------------------------------ */
function configureHeader(view, coding) {
  $('#timer-pill').style.display = (view === 'test') ? '' : 'none';
  $('#btn-show-tips').style.display = (view === 'test' && coding) ? '' : 'none';
  $('#btn-help').style.display     = (view === 'complete' || view === 'intro') ? 'none' : '';
  $('#btn-exit').style.display     = (view === 'complete' || view === 'intro') ? 'none' : '';
  $('#nav-rail').style.display     = (view === 'test') ? 'flex' : 'none';
  closeMenu();
}

function setView(name) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $('#view-' + name).classList.add('active');
}

/* ------------------------------------------------------------
 * Intro flow: data protection notice + personal details
 * ------------------------------------------------------------ */
let tcAgreed = false; /* state of the Terms & Conditions switch on #view-personal */

function showNotice() {
  configureHeader('intro', false);
  setView('notice');
}

function showPersonal(editMode) {
  configureHeader('intro', false);
  setView('personal');
  state.editMode = editMode;

  /* switch reflects what the candidate agreed to last time */
  tcAgreed = !!(candidate && candidate.agreedTC);
  applyTcSwitch();

  const c = candidate || {};
  $('#pf-regno').value   = c.regNo   || '';
  $('#pf-name').value    = c.name    || '';
  $('#pf-email').value   = c.email   || '';
  $('#pf-contact').value = c.contact || '';
  $('#pf-secq').value    = c.secq    || '';
  $('#pf-seca').value    = c.seca    || '';

  $('#pi-cancel').style.display = 'inline-block';
  $('#pi-error').textContent = '';
  $('#pi-error').hidden = true;
}

function applyTcSwitch() {
  /* scoped to #view-personal: the coding screen's test-case panel also
     contains an element with the id tc-toggle */
  const btn = $('#view-personal #tc-toggle');
  btn.classList.toggle('on', tcAgreed);
  btn.setAttribute('aria-pressed', tcAgreed ? 'true' : 'false');
  const label = btn.querySelector('.switch-label');
  if (label) label.textContent = tcAgreed ? 'Yes' : 'No';

  /* CONTINUE turns green once the Terms & Conditions switch is on */
  const cont = $('#pi-continue');
  if (cont) cont.classList.toggle('ready', tcAgreed);
}

function toggleTcAgreed() {
  tcAgreed = !tcAgreed;
  applyTcSwitch();
}

function savePersonalForm() {
  const regNo   = $('#pf-regno').value.trim();
  const name    = $('#pf-name').value.trim();
  const email   = $('#pf-email').value.trim();
  const contact = $('#pf-contact').value.trim();
  const secq    = $('#pf-secq').value.trim();
  const seca    = $('#pf-seca').value.trim();

  const fail = msg => {
    $('#pi-error').textContent = msg;
    $('#pi-error').hidden = false;
  };

  if (!regNo || !name || !email || !contact || !secq || !seca) {
    fail('Please fill in all mandatory fields with valid details and agree to the Terms and Conditions.');
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    fail('Please enter a valid email address.');
    return;
  }
  if (!/^\d{10}$/.test(contact)) {
    fail('Contact number must contain exactly 10 digits.');
    return;
  }
  if (!tcAgreed) {
    fail('Please agree to the Terms and Conditions to continue.');
    return;
  }

  saveCandidate({ regNo: regNo, name: name, email: email, contact: contact, secq: secq, seca: seca, agreedTC: true });
  toast('Candidate details saved.');
  renderMenuProfile();
  renderAssessments();
}

/* ------------------------------------------------------------
 * Timer
 * ------------------------------------------------------------ */
let timerInterval = null;

function pad2(n) { return String(n).padStart(2, '0'); }

function fmtTime(totalSec) {
  const s = Math.max(0, totalSec);
  return pad2(Math.floor(s / 60)) + ' : ' + pad2(s % 60);
}

function updateTimerPill() {
  const pill = $('#timer-pill');
  if (!state.currentSection) return;
  const left = state.remaining[state.currentSection] || 0;
  pill.textContent = fmtTime(left);
  pill.classList.toggle('warn', left <= 60);
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    if (!state.currentSection) return;
    const id = state.currentSection;
    const sec = SECTION_MAP[id];
    if (state.remaining[id] == null) state.remaining[id] = sec.minutes * 60;
    state.remaining[id]--;
    if (state.remaining[id] < 0) state.remaining[id] = 0;
    updateTimerPill();
    if (state.remaining[id] === 0) {
      stopTimer();
      toast('Time is up for this section.');
      finishSection(id, true);
    }
    persist();
  }, 1000);
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

/* ------------------------------------------------------------
 * Assessments view
 * ------------------------------------------------------------ */
function statusOf(sec) {
  if (state.sectionsDone[sec.id]) return 'Complete';
  const next = nextIncomplete();
  if (next && next.id === sec.id) return 'Upcoming';
  return 'Later';
}

function renderAssessments() {
  configureHeader('assessments', false);
  stopTimer();
  setView('assessments');

  const wrap = $('#assess-rows');
  wrap.innerHTML = '';

  window.SECTIONS.slice().sort((a, b) => a.order - b.order).forEach(sec => {
    const st = statusOf(sec);
    const isSelected = state.selectedId === sec.id && !state.sectionsDone[sec.id];
    /* every section shows its description only when its row is clicked */
    const expanded = !!sec.description && isSelected;
    const cls = (st === 'Complete' ? 'complete ' : (st === 'Upcoming' ? 'upcoming ' : '')) +
                (isSelected ? 'selected' : '');
    const row = document.createElement('button');
    row.className = 'assess-row ' + cls.trim();
    row.innerHTML =
      '<span class="assess-info">' +
        '<span class="assess-name">' + sec.name + '</span>' +
        (expanded ? '<span class="assess-desc">' + sec.description + '</span>' : '') +
        '<span class="assess-meta">' + sec.questions + ' question(s) in ' + sec.minutes + ' Minutes</span>' +
      '</span>' +
      '<span class="assess-status">' + st + '</span>';
    row.addEventListener('click', () => {
      if (state.sectionsDone[sec.id]) { toast('"' + sec.name + '" is already complete.'); return; }
      state.selectedId = (state.selectedId === sec.id) ? null : sec.id;
      renderAssessments();
    });
    wrap.appendChild(row);
  });

  $('#btn-next').disabled = false;
  $('#btn-next').textContent = '';
  $('#btn-next').innerHTML = 'NEXT <span style="letter-spacing:0">&#8250;</span>';
}

/* ------------------------------------------------------------
 * Section lifecycle
 * ------------------------------------------------------------ */
function startSection(id) {
  state.currentSection = id;
  state.currentIndex = 0;
  navOffset = 0;
  if (state.remaining[id] == null) state.remaining[id] = SECTION_MAP[id].minutes * 60;

  // land on first unanswered question
  const q = sectionQuestions(id);
  for (let i = 0; i < q.length; i++) {
    if (!isAnswered(id, i)) { state.currentIndex = i; break; }
  }

  configureHeader('test', !!CODING_SECTIONS[id]);
  setView('test');
  updateTimerPill();
  startTimer();
  renderTest();
}

function finishSection(id, timedOut) {
  stopTimer();
  state.sectionsDone[id] = true;
  state.currentSection = null;
  state.selectedId = null;
  persist();

  if (nextIncomplete()) {
    renderAssessments();
    if (timedOut) toast('Time is up - this section was auto-submitted.');
    /* take the candidate straight to the next subject on the list */
    const up = nextIncomplete();
    const row = Array.from(document.querySelectorAll('.assess-row'))
      .find(r => r.textContent.indexOf(up.name) !== -1);
    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    showComplete();
  }
}

/* ------------------------------------------------------------
 * Test rendering (MCQ / Likert / Coding)
 * ------------------------------------------------------------ */
function renderTest() {
  const id = state.currentSection;
  if (CODING_SECTIONS[id]) renderCodingScreen();
  else renderMcqScreen();
  renderNavigator();
}

/* ---------------- MCQ ---------------- */

function buildLikertToggle(savedValue) {
  /* Toggle-style horizontal slider: statement sits above, the switch-shaped
     track with a draggable round knob sits just below it. The track fills
     blue from the left edge up behind the knob while it is dragged (filler
     behaviour) and snaps to the nearest position on release.
     Left = Strongly Disagree ... right = Strongly Agree.
     Stored value uses the LIKERT_OPTIONS order, so value = 4 - sliderPos.
     Knob travel: knob is 32px wide, track inset 2px -> centers at 18px .. w-18px. */
  const slider = $('#likert-slider');
  const track  = $('#likert-track');
  const knob   = $('#likert-knob');
  const fill   = $('#likert-fill');
  const ticks  = Array.from(slider.querySelectorAll('.toggle-tick'));
  let current = 0;
  let committed = false;

  function metrics() {
    const w = track.getBoundingClientRect().width;
    return { travel: Math.max(0, w - 36) };
  }

  /* paint knob + fill for a continuous position 0..4 (may be fractional) */
  function paint(pos, filled) {
    const { travel } = metrics();
    const knobLeft = 2 + (pos / 4) * travel;
    knob.style.left = knobLeft + 'px';
    /* fill runs past the knob's right edge so the ball sits under the fill
       colour instead of pulling out of it (anchor look) */
    fill.style.width = filled ? (knobLeft + 34) + 'px' : '0px';
  }

  function apply(pos, commit = true) {
    current = pos;
    committed = commit;
    paint(pos, commit);
    if (commit) {
      slider.dataset.value = String(pos);
      ticks.forEach((t, i) => t.classList.toggle('active', i === pos));
    } else {
      /* parked knob, nothing chosen yet */
      slider.dataset.value = '';
      ticks.forEach(t => t.classList.remove('active'));
    }
  }

  function ratioFromEvent(e) {
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.width - 36);
    const x = Math.min(Math.max(e.clientX - r.left - 18, 0), travel); /* knob centre */
    return x / travel;
  }

  const posFromEvent = e => Math.round(ratioFromEvent(e) * 4);

  let dragging = false;
  let pendingPos = 0;
  track.addEventListener('pointerdown', e => {
    dragging = true;
    slider.classList.add('dragging');
    track.setPointerCapture(e.pointerId);
    pendingPos = posFromEvent(e);
    apply(pendingPos);
  });
  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    pendingPos = posFromEvent(e);
    paint(ratioFromEvent(e) * 4, true);  /* knob + fill follow the pointer continuously */
    ticks.forEach((t, i) => t.classList.toggle('active', i === pendingPos));
    slider.dataset.value = String(pendingPos);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    slider.classList.remove('dragging');
    apply(pendingPos); /* snap knob + fill to the chosen position */
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  window.addEventListener('resize', () => apply(current, committed));

  if (savedValue != null && savedValue >= 0) apply(4 - savedValue);
  else apply(0, false); /* knob parked at the left, question unanswered */
}

function renderMcqScreen() {
  const id = state.currentSection;
  const q = sectionQuestions(id)[state.currentIndex];
  const saved = state.answers[id] ? state.answers[id][state.currentIndex] : undefined;

  $('#test-code').style.display = 'none';
  $('#mcq-footer').style.display = 'block';

  if (q.likert) {
    /* personality: statement on top, toggle slider just below it */
    $('#test-mcq').style.display = 'none';
    $('#test-likert').style.display = 'flex';
    $('#likert-instruction').textContent = q.instruction || 'Choose the option that best describes you.';
    $('#likert-statement').textContent = q.text;
    buildLikertToggle((saved === undefined || saved === null) ? null : saved);
  } else {
    $('#test-likert').style.display = 'none';
    $('#test-mcq').style.display = 'flex';

    const instr = q.instruction || 'Choose the correct option.';
    $('#mcq-instruction').textContent = instr;
    $('#mcq-passage').style.display = q.passage ? 'block' : 'none';
    if (q.passage) $('#mcq-passage').textContent = q.passage;
    $('#mcq-text').textContent = q.text;

    const list = $('#opt-list');
    list.innerHTML = '';
    q.options.forEach((optText, i) => {
      const b = document.createElement('button');
      b.className = 'opt' + (saved === i ? ' selected' : '');
      b.textContent = optText;
      b.addEventListener('click', () => {
        $$('#opt-list .opt').forEach(o => o.classList.remove('selected'));
        b.classList.add('selected');
      });
      list.appendChild(b);
    });
  }

  updateSectionButtons();
}

function currentSelection() {
  if ($('#test-likert').style.display !== 'none') {
    const v = $('#likert-slider').dataset.value;
    return (v === '' || v === undefined) ? -1 : 4 - Number(v);
  }
  const sel = $('#opt-list .opt.selected');
  return sel ? Array.from($('#opt-list').children).indexOf(sel) : -1;
}

/* free navigation - no forced selection, move between questions at will */
function goToQuestion(idx) {
  const total = sectionQuestions(state.currentSection).length;
  if (idx < 0 || idx >= total) return;
  state.currentIndex = idx;
  renderTest();
}

function prevQuestion() {
  goToQuestion(state.currentIndex - 1);
}

function nextQuestion() {
  goToQuestion(state.currentIndex + 1);
}

/* When every question in the section is answered the SUBMIT ANSWER button is
   replaced by NEXT SECTION (visibility only - never touch the submit button's
   innerHTML, it contains a chevron span). */
function updateSectionButtons() {
  const id = state.currentSection;
  if (!id) return;
  const done = answeredCount(id) === sectionQuestions(id).length;
  $('#btn-submit-answer').style.display = done ? 'none' : 'inline-block';
  $('#btn-next-section').style.display  = done ? 'inline-block' : 'none';
}

function submitMcqAnswer() {
  const id = state.currentSection;
  const val = currentSelection();
  const total = sectionQuestions(id).length;

  /* no forced selection - submitting without picking an option simply
     moves ahead without recording an answer */
  if (val >= 0) {
    if (!state.answers[id]) state.answers[id] = {};
    state.answers[id][state.currentIndex] = val;
    persist();
    updateSectionButtons();

    // jump to the next unanswered question; when none remain the footer has
    // already switched to NEXT SECTION - the user leaves the section explicitly
    for (let i = 1; i <= total; i++) {
      const idx = (state.currentIndex + i) % total;
      if (!isAnswered(id, idx)) {
        state.currentIndex = idx;
        renderTest();
        return;
      }
    }
    return;
  }

  // nothing selected: plain skip to the next question
  if (state.currentIndex < total - 1) nextQuestion();
}

/* ---------------- Navigator rail ---------------- */
let navOffset = 0;

function renderNavigator() {
  const id = state.currentSection;
  if (!id) return;
  const total = sectionQuestions(id).length;
  const track = $('#nav-track');
  track.innerHTML = '';

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (isAnswered(id, i) ? ' answered' : '') + (i === state.currentIndex ? ' current' : '');
    dot.textContent = i + 1;
    dot.addEventListener('click', () => {
      state.currentIndex = i;
      renderTest();
    });
    track.appendChild(dot);
  }
  ensureCurrentVisible();
}

function applyNavOffset() {
  const scroll = $('#nav-scroll');
  const track = $('#nav-track');
  const max = Math.max(0, track.offsetHeight - scroll.clientHeight);
  navOffset = Math.min(Math.max(navOffset, 0), max);
  track.style.transform = 'translateX(-50%) translateY(' + (-navOffset) + 'px)';
  $('#nav-up').disabled = navOffset <= 0;
  $('#nav-down').disabled = navOffset >= max - 1;
}

const NAV_ITEM_H = 40; /* dot 34px + 2x3px margin */

function ensureCurrentVisible() {
  const scroll = $('#nav-scroll');
  if (!state.currentSection) return;
  const top = state.currentIndex * NAV_ITEM_H;
  const bottom = top + NAV_ITEM_H;
  if (top < navOffset) navOffset = top - 6;
  else if (bottom > navOffset + scroll.clientHeight) navOffset = bottom - scroll.clientHeight + 6;
  applyNavOffset();
}

/* ------------------------------------------------------------
 * Coding screens (Automata Pro / Automata Fix)
 * ------------------------------------------------------------ */
function langTemplate(langId) {
  const l = window.LANGUAGES.find(x => x.id === langId) || window.LANGUAGES[0];
  return l;
}

/* ----- draggable splitter between the question pane and the code editor -----
   drag the vertical line left -> bigger editor; right -> bigger question pane.
   double-click resets to the default 36/64 split. */
function applyQPaneWidth(pct) {
  state.qPanePct = pct;
  $('#code-q-pane').style.flex = '0 0 ' + pct + '%';
  persist();
}

function initPaneSplitter() {
  const divider = $('#pane-divider');
  const wrap = $('.code-wrap');
  const MIN = 20, MAX = 62;
  let dragging = false;

  function setFromEvent(e) {
    const r = wrap.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - r.left) / r.width * 100, MIN), MAX);
    applyQPaneWidth(Math.round(pct * 10) / 10);
  }

  divider.addEventListener('pointerdown', e => {
    dragging = true;
    divider.classList.add('dragging');
    document.body.classList.add('col-resizing');
    divider.setPointerCapture(e.pointerId);
    setFromEvent(e);
  });
  divider.addEventListener('pointermove', e => { if (dragging) setFromEvent(e); });
  const endDrag = () => {
    dragging = false;
    divider.classList.remove('dragging');
    document.body.classList.remove('col-resizing');
    persist();
  };
  divider.addEventListener('pointerup', endDrag);
  divider.addEventListener('pointercancel', endDrag);
  divider.addEventListener('dblclick', () => applyQPaneWidth(36));
}

function renderCodingScreen() {
  const id = state.currentSection;
  const q = sectionQuestions(id)[state.currentIndex];

  $('#test-mcq').style.display = 'none';
  $('#test-likert').style.display = 'none';
  $('#mcq-footer').style.display = 'none';
  $('#test-code').style.display = 'flex';
  if (state.qPanePct) applyQPaneWidth(state.qPanePct);

  /* ----- question pane ----- */
  const pane = $('#code-q-content');
  pane.innerHTML = '';
  const h = document.createElement('h2');
  h.textContent = 'Question';
  pane.appendChild(h);

  const addP = (html, cls) => {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    p.innerHTML = html;
    pane.appendChild(p);
  };

  if (q.intro) addP(q.intro);
  if (q.text)  addP(escapeHtml(q.text).replace(/\n/g, '<br>'));
  (q.body || []).forEach(par => addP(escapeHtml(par).replace(/\n/g, '<br>')));

  if (q.input)  addP('<b>Input</b>\n' + escapeHtml(q.input).replace(/\n/g, '<br>'));
  if (q.output) addP('<b>Output</b>\n' + escapeHtml(q.output).replace(/\n/g, '<br>'));
  if (q.note)   addP('<b>Note</b>\n' + escapeHtml(q.note).replace(/\n/g, '<br>'));
  if (q.constraints) addP('<b>Constraints</b>\n' + escapeHtml(q.constraints).replace(/\n/g, '<br>'));
  if (q.example) {
    addP('<b>Example</b>\nInput:\n' + escapeHtml(q.example.input).replace(/\n/g, '<br>'));
    addP('Output:\n' + escapeHtml(q.example.output).replace(/\n/g, '<br>'));
  }
  if (q.explanation) addP('<b>Explanation</b>\n' + escapeHtml(q.explanation).replace(/\n/g, '<br>'));

  /* ----- editor ----- */
  const langId = (state.editorLang[id] && state.editorLang[id][state.currentIndex]) || state.langId;
  $('#lang-select').value = langId;

  const saved = state.answers[id] && state.answers[id][state.currentIndex];
  let initial;
  if (saved && saved.code != null) initial = saved.code;
  else if (id === 'autofix') initial = q.code;
  else initial = langTemplate(langId).template;

  setEditorContent(initial);
  $('#tc-panel').classList.remove('open');

  updateCodeButtons();
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function updateCodeButtons() {
  /* free re-submission: the button is never locked */
  $('#btn-submit-assessment').disabled = false;
  $('#btn-submit-assessment').textContent = 'SUBMIT ASSESSMENT';
}

/* ---------------- syntax highlighting ---------------- */
const KW = new Set(['int','char','void','return','if','else','for','while','do','using','namespace',
  'public','static','class','def','import','pass','new','struct','const','float','double','long',
  'unsigned','bool','true','false','elif','not','in','is','from','print']);

function highlightCode(raw, langId) {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|'''[\s\S]*?'''|"""[\s\S]*?"""|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b)/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(raw)) !== null) {
    out += escapeHtml(raw.slice(last, m.index));
    const tok = m[0];
    let cls = null;
    if (tok.startsWith('//') || tok.startsWith('/*') || tok.startsWith("'") && tok.startsWith("'''") || tok.startsWith('"') && tok.startsWith('"""')) cls = 'tk-cmt';
    else if (tok.startsWith('#')) cls = (langId === 'py3') ? 'tk-cmt' : 'tk-pre';
    else if (tok.startsWith('"') || tok.startsWith("'")) cls = 'tk-str';
    else if (/^\d/.test(tok)) cls = 'tk-num';
    else if (KW.has(tok)) cls = 'tk-kw';
    out += cls ? '<span class="' + cls + '">' + escapeHtml(tok) + '</span>' : escapeHtml(tok);
    last = m.index + tok.length;
  }
  out += escapeHtml(raw.slice(last));
  return out;
}

function setEditorContent(text) {
  const ta = $('#code-input');
  ta.value = text;
  syncEditor();
}

function syncEditor() {
  const ta = $('#code-input');
  const pre = $('#code-hl');
  const gut = $('#code-gutter');
  const langId = $('#lang-select').value;
  pre.innerHTML = highlightCode(ta.value + '\n', langId) ;
  const lines = ta.value.split('\n').length;
  let nums = '';
  for (let i = 1; i <= Math.max(lines, 1); i++) nums += i + '\n';
  gut.textContent = nums;
  pre.scrollTop = ta.scrollTop;
  pre.scrollLeft = ta.scrollLeft;
  gut.scrollTop = ta.scrollTop;
}

/* ---------------- run / submit ---------------- */
let runBusy = false;

function runSolution() {
  if (runBusy) return;
  runBusy = true;
  const btn = $('#btn-run-solution');
  btn.disabled = true;
  btn.innerHTML = '<span class="play"></span> COMPILING...';

  setTimeout(() => {
    btn.innerHTML = '<span class="play"></span> RUNNING...';
    setTimeout(() => {
      btn.innerHTML = '<span class="play"></span> RUN SOLUTION';
      btn.disabled = false;
      runBusy = false;
      showTestCases(true);
    }, 800);
  }, 900);
}

function showTestCases(fromRun) {
  const id = state.currentSection;
  const q = sectionQuestions(id)[state.currentIndex];
  const body = $('#tc-body');
  body.innerHTML = '';

  /* Automata Fix: the test cases genuinely evaluate the code in the editor —
     each question carries a `sim` model of the bug, so a case passes only when
     the bug is actually fixed. Automata Pro stays simulated (no real judge). */
  const isFix = (id === 'autofix' && q.sim && typeof q.sim.run === 'function');
  const code = isFix ? $('#code-input').value : '';

  const head = document.createElement('div');
  head.className = 'tc-case-head';
  head.innerHTML = '<span>Test cases</span><span class="hint">' +
    (isFix ? 'Your code is executed against these test cases' : 'Results are simulated in this clone') +
    '</span>';
  body.appendChild(head);

  let customNo = 0;
  (q.testCases || []).forEach((tc) => {
    let actual = tc.expected;
    let pass = true;
    if (isFix) {
      const fixed = q.sim.isFixed(code);
      actual = q.sim.run(tc.input, fixed);
      pass = String(actual).trim() === String(tc.expected).trim();
    }
    const statusCls = pass ? 'tc-pass' : 'tc-fail';
    const statusTxt = pass ? 'Passed' : 'Failed';
    const label = tc.sample ? 'Sample test case' : 'Custom test case ' + (++customNo);
    const div = document.createElement('div');
    div.className = 'tc-case';
    div.innerHTML =
      '<div class="tc-case-head"><span>' + label + '</span><span class="' + statusCls + '">' + statusTxt + '</span></div>' +
      '<pre><b>Input:</b>\n' + escapeHtml(tc.input) + '\n\n<b>Expected output:</b>\n' + escapeHtml(tc.expected) +
      '\n\n<b>Your output:</b>\n' + escapeHtml(String(actual)) + '</pre>';
    body.appendChild(div);
  });

  if (!fromRun && !isFix) {
    const p = document.createElement('p');
    p.style.cssText = 'color:#777;margin-top:6px';
    p.textContent = 'Run the solution to see live results.';
    body.appendChild(p);
  }

  $('#tc-panel').classList.add('open');
}

function submitCodeQuestion() {
  /* no confirmation gate, no review lock - submit saves the code and moves on;
     the question can be revisited and re-submitted freely */
  const id = state.currentSection;
  if (!state.answers[id]) state.answers[id] = {};
  state.answers[id][state.currentIndex] = {
    code: $('#code-input').value,
    lang: $('#lang-select').value,
    submitted: true
  };
  persist();

  const total = sectionQuestions(id).length;
  for (let i = 1; i <= total; i++) {
    const idx = (state.currentIndex + i) % total;
    if (!isAnswered(id, idx)) {
      state.currentIndex = idx;
      renderTest();
      return;
    }
  }
  finishSection(id, false);
}

/* ------------------------------------------------------------
 * Completion view
 * ------------------------------------------------------------ */
function showComplete() {
  stopTimer();
  configureHeader('complete', false);
  setView('complete');
}

/* ------------------------------------------------------------
 * Menu / header actions
 * ------------------------------------------------------------ */
function toggleMenu() {
  renderMenuProfile();
  $('#menu-pop').classList.toggle('open');
}
function closeMenu()  { $('#menu-pop').classList.remove('open'); }

/* ------------------------------------------------------------
 * Wiring
 * ------------------------------------------------------------ */
function wire() {
  // language dropdown
  const sel = $('#lang-select');
  window.LANGUAGES.forEach(l => {
    const o = document.createElement('option');
    o.value = l.id;
    o.textContent = l.label;
    sel.appendChild(o);
  });

  // header
  $('#btn-fullscreen').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  });
  $('#btn-hamburger').addEventListener('click', e => { e.stopPropagation(); toggleMenu(); });
  document.addEventListener('click', e => {
    if (!$('#menu-pop').contains(e.target)) closeMenu();
  });

  // candidate details (menu)
  $('#menu-edit-profile').addEventListener('click', () => { closeMenu(); showPersonal(true); });
  $('#menu-notice').addEventListener('click', () => { closeMenu(); openModal('modal-notice'); });
  $('#notice-close').addEventListener('click', () => closeModal('modal-notice'));

  // intro flow: data protection notice view
  $('#notice-check').addEventListener('change', () => {
    $('#notice-continue').disabled = !$('#notice-check').checked;
  });
  $('#notice-continue').addEventListener('click', () => {
    if ($('#notice-check').checked) showPersonal(false);
    else toast('Please confirm the notice first.');
  });
  $$('.acc-head').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('open')));

  // intro flow: personal details view
  $$('.pi-collapse').forEach(b => b.addEventListener('click', () => b.closest('.pi-section').classList.toggle('collapsed')));
  /* scoped to #view-personal / #modal-tc: the coding screen's test-case panel
     also contains elements with the ids tc-toggle and tc-close */
  $('#view-personal #tc-toggle').addEventListener('click', toggleTcAgreed);
  $('#tc-link').addEventListener('click', e => { e.preventDefault(); openModal('modal-tc'); });
  $('#modal-tc #tc-close').addEventListener('click', () => closeModal('modal-tc'));
  $('#pi-continue').addEventListener('click', savePersonalForm);
  $('#pi-cancel').addEventListener('click', () => {
    if (state.editMode) renderAssessments();
    else showPersonal(false); /* first run: just clear the form */
  });

  $('#btn-exit').addEventListener('click', () => {
    if (state.currentSection) openModal('modal-exit');
  });
  $('#exit-confirm').addEventListener('click', () => {
    closeModal('modal-exit');
    stopTimer();
    const id = state.currentSection;
    state.currentSection = null;
    renderAssessments();
    toast('You can resume "' + SECTION_MAP[id].name + '" any time.');
  });
  $('#exit-cancel').addEventListener('click', () => closeModal('modal-exit'));

  $('#btn-help').addEventListener('click', () => openModal('modal-help'));
  $('#btn-show-tips').addEventListener('click', () => openModal('modal-tips'));
  $('#help-close').addEventListener('click', () => closeModal('modal-help'));
  $('#tips-close').addEventListener('click', () => closeModal('modal-tips'));

  // assessments
  /* the chevron below the list scrolls down through the sections and back up */
  $('#assess-expand').addEventListener('click', () => {
    const wrap = $('.assess-wrap');
    const atBottom = wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - 8;
    if (!atBottom) {
      wrap.scrollTo({ top: wrap.scrollHeight, behavior: 'smooth' });
      $('#assess-expand').classList.add('up');
    } else {
      wrap.scrollTo({ top: 0, behavior: 'smooth' });
      $('#assess-expand').classList.remove('up');
    }
  });

  $('#btn-next').addEventListener('click', () => {
    const selected = state.selectedId && !state.sectionsDone[state.selectedId]
      ? SECTION_MAP[state.selectedId] : null;
    const target = selected || nextIncomplete();
    if (target) startSection(target.id);
    else showComplete();
  });

  // MCQ
  $('#btn-submit-answer').addEventListener('click', submitMcqAnswer);
  $('#btn-next-section').addEventListener('click', () => {
    const id = state.currentSection;
    if (!id) return;
    $('#please-wait').classList.add('open');
    setTimeout(() => { $('#please-wait').classList.remove('open'); finishSection(id, false); }, 900);
  });

  // navigator
  $('#nav-up').addEventListener('click', () => { navOffset -= 160; applyNavOffset(); });
  $('#nav-down').addEventListener('click', () => { navOffset += 160; applyNavOffset(); });

  // coding
  $('#lang-select').addEventListener('change', () => {
    const id = state.currentSection;
    if (!id) return;
    const langId = $('#lang-select').value;
    state.langId = langId;
    if (!state.editorLang[id]) state.editorLang[id] = {};
    state.editorLang[id][state.currentIndex] = langId;
    const saved = state.answers[id] && state.answers[id][state.currentIndex];
    if (!saved || saved.code == null) {
      setEditorContent(langTemplate(langId).template);
    }
    persist();
  });

  $('#code-input').addEventListener('input', syncEditor);
  $('#code-input').addEventListener('scroll', () => {
    const ta = $('#code-input');
    $('#code-hl').scrollTop = ta.scrollTop;
    $('#code-hl').scrollLeft = ta.scrollLeft;
    $('#code-gutter').scrollTop = ta.scrollTop;
  });
  $('#code-input').addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = $('#code-input');
      const s = ta.selectionStart, en = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 4;
      syncEditor();
    }
  });

  $('#btn-run-solution').addEventListener('click', runSolution);
  initPaneSplitter();
  $('#btn-submit-assessment').addEventListener('click', submitCodeQuestion);

  /* coding test-cases panel - the coding view uses tc-panel-toggle / tc-panel-close
     (tc-toggle / tc-close now belong to the personal-info switch and the TC modal) */
  const codeTcToggle = $('#tc-panel-toggle');
  if (codeTcToggle) codeTcToggle.addEventListener('click', () => {
    const p = $('#tc-panel');
    if (p.classList.contains('open')) p.classList.remove('open');
    else showTestCases(false);
  });
  const codeTcClose = $('#tc-panel-close');
  if (codeTcClose) codeTcClose.addEventListener('click', () => $('#tc-panel').classList.remove('open'));
  $('#tc-chev').addEventListener('click', () => {
    const p = $('#tc-panel');
    p.classList.toggle('open');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadPersisted();
  loadCandidate();
  wire();
  renderMenuProfile();
  if (candidateComplete()) {
    renderAssessments();
  } else {
    showNotice();
  }
});
