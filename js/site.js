/* ============================================================
   site.js — สลับภาษา TH/EN, เฉลยแบบฝึกหัด, ข้อสอบเก็บคะแนน
   Language switch, exercise reveal, graded quiz.
   สารบัญบทและแถบเมนูอยู่ใน js/sidebar.js (โหลดก่อนไฟล์นี้)
   ============================================================ */

/* ---------- 1. ภาษา ----------
   สลับด้วย CSS ล้วน: theme/style.css ซ่อน .en หรือ .th ตาม <html lang>  */
const LANG_KEY = 'irrig.lang';

function setLang(lang) {
  document.documentElement.lang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode */ }
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
    b.setAttribute('aria-pressed', b.dataset.lang === lang);
  });
  // แจ้งสคริปต์อื่น (svgfit.js) ให้วัดข้อความในรูปใหม่ตามภาษาที่เปลี่ยน
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

function initLang() {
  let saved = 'th';
  try { saved = localStorage.getItem(LANG_KEY) || 'th'; } catch (e) { /* ignore */ }
  setLang(saved);
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
}

/* ---------- 2. แบบฝึกหัด: เปิด/ปิดเฉลย ---------- */
const REVEAL_LABEL = {
  open:  '<span class="en">Hide answer</span><span class="th">ซ่อนเฉลย</span>',
  shut:  '<span class="en">Show answer</span><span class="th">ดูเฉลย</span>'
};

function toggleExercise(ex, open) {
  ex.classList.toggle('open', open);
  const b = ex.querySelector('.reveal-btn');
  if (b) b.innerHTML = open ? REVEAL_LABEL.open : REVEAL_LABEL.shut;
}

function initExercises() {
  document.querySelectorAll('.exercise').forEach(ex => {
    ex.querySelector('.reveal-btn')
      ?.addEventListener('click', () => toggleExercise(ex, !ex.classList.contains('open')));
  });

  document.querySelector('#reveal-all')?.addEventListener('click', () => {
    const all = [...document.querySelectorAll('.exercise')];
    const everyOpen = all.every(e => e.classList.contains('open'));
    all.forEach(ex => toggleExercise(ex, !everyOpen));
  });
}

/* ---------- 3. ข้อสอบเก็บคะแนน ----------
   หน้าบทกำหนดข้อสอบไว้ที่ window.QUIZ =
   [{ q:{en,th}, choices:[{en,th}...], answer:0, why:{en,th} }]           */
function initQuiz(chapterId) {
  const host = document.querySelector('#quiz');
  const quiz = window.QUIZ;
  if (!host || !quiz) return;

  host.innerHTML = quiz.map((item, qi) => `
    <div class="quiz-item" data-q="${qi}">
      <div class="quiz-q"><span class="qnum">${qi + 1}.</span>
        <span class="en">${item.q.en}</span><span class="th">${item.q.th}</span></div>
      ${item.choices.map((c, ci) => `
        <label class="quiz-choice" data-c="${ci}">
          <input type="radio" name="q${qi}" value="${ci}" />
          <span><span class="mono"><span class="en">${'abcd'[ci] || ci + 1}.</span><span class="th">${'กขคง'[ci] || ci + 1}.</span></span>
            <span class="en">${c.en}</span><span class="th">${c.th}</span></span>
        </label>`).join('')}
      <div class="quiz-feedback"></div>
    </div>`).join('') + `
    <div class="quiz-bar">
      <button class="btn solid" id="quiz-submit"><span class="en">Submit &amp; grade</span><span class="th">ส่งคำตอบ &amp; ตรวจ</span></button>
      <button class="btn" id="quiz-reset"><span class="en">Reset</span><span class="th">ทำใหม่</span></button>
      <span class="quiz-score" id="quiz-score">— / ${quiz.length}</span>
      <span class="quiz-note" id="quiz-best"></span>
    </div>`;

  const scoreEl = host.querySelector('#quiz-score');
  const bestEl = host.querySelector('#quiz-best');
  const key = 'irrig.score.' + chapterId;

  const showBest = () => {
    let best = null;
    try { best = localStorage.getItem(key); } catch (e) { /* ignore */ }
    bestEl.innerHTML = best
      ? `<span class="en">Best score: ${best} / ${quiz.length}</span><span class="th">คะแนนสูงสุด: ${best} / ${quiz.length}</span>`
      : '';
  };
  showBest();

  host.querySelector('#quiz-submit').addEventListener('click', () => {
    let score = 0, unanswered = 0;
    quiz.forEach((item, qi) => {
      const el = host.querySelector(`.quiz-item[data-q="${qi}"]`);
      const picked = el.querySelector('input:checked');
      el.classList.remove('correct', 'wrong');
      el.classList.add('graded');
      el.querySelectorAll('.quiz-choice').forEach(c => c.classList.remove('picked', 'is-key'));
      el.querySelector(`.quiz-choice[data-c="${item.answer}"]`).classList.add('is-key');

      if (!picked) unanswered++;
      const ok = picked && +picked.value === item.answer;
      if (picked) picked.closest('.quiz-choice').classList.add('picked');
      el.classList.add(ok ? 'correct' : 'wrong');
      if (ok) score++;
      el.querySelector('.quiz-feedback').innerHTML =
        (ok ? '✓ ' : '✕ ') + `<span class="en">${item.why.en}</span><span class="th">${item.why.th}</span>`;
    });

    scoreEl.textContent = `${score} / ${quiz.length}`;
    scoreEl.title = unanswered ? `${unanswered} unanswered` : '';
    try {
      const prev = +(localStorage.getItem(key) || -1);
      if (score > prev) localStorage.setItem(key, score);
    } catch (e) { /* ignore */ }
    showBest();
    host.querySelector('.quiz-bar').scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  host.querySelector('#quiz-reset').addEventListener('click', () => {
    host.querySelectorAll('input[type=radio]').forEach(i => { i.checked = false; });
    host.querySelectorAll('.quiz-item').forEach(el => el.classList.remove('graded', 'correct', 'wrong'));
    host.querySelectorAll('.quiz-choice').forEach(c => c.classList.remove('picked', 'is-key'));
    scoreEl.textContent = `— / ${quiz.length}`;
    host.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- 4. ลิขสิทธิ์ท้ายทุกหน้า ----------
   แก้ข้อความลิขสิทธิ์ได้ที่บรรทัดเดียวนี้ แล้วมีผลทุกหน้า
   Edit this one line to change the copyright on every page.        */
const COPYRIGHT = '© 2026 K. Woranidtha';

function initCopyright() {
  document.querySelectorAll('footer').forEach(f => {
    if (f.querySelector('.copyright')) return;
    f.insertAdjacentHTML('beforeend',
      '<span class="copyright">Copyright ' + COPYRIGHT + '</span>');
  });
}

/* ---------- 5. อนิเมชันแบบเล่นครั้งเดียว ----------
   ติดคลาส in-view ให้ <figure> เมื่อเลื่อนเข้ามาในจอ
   CSS จะเริ่มอนิเมชัน .fig-grow / .fig-fade ตอนนั้น
   (ถ้าไม่รองรับ IntersectionObserver ก็ติดให้เลยทุกรูป)          */
function initFigureReveal() {
  const figures = document.querySelectorAll('figure');
  if (!('IntersectionObserver' in window)) {
    figures.forEach(f => f.classList.add('in-view'));
    return;
  }
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in-view');
      o.unobserve(e.target);          // เล่นครั้งเดียวพอ
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  figures.forEach(f => obs.observe(f));
}

document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initCopyright();
  initFigureReveal();
  initExercises();
  initQuiz(document.body.dataset.chapter || '');
});
