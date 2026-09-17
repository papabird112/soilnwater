/* ============================================================
   sidebar.js — สารบัญบท + แถบเมนูด้านซ้าย + ปุ่มก่อนหน้า/ถัดไป
   Chapter registry, sidebar rendering, scroll-spy and pager.
   โหลดไฟล์นี้ก่อน site.js
   ============================================================ */

/* ---------- 1. ทะเบียนบทเรียน: เพิ่ม/แก้ชื่อบทได้ที่นี่ที่เดียว ----------
   The ONLY place chapters are listed. Add a chapter here and the
   sidebar, the table of contents and the prev/next buttons all follow.
   ready:false = ยังไม่มีไฟล์ จะแสดงเป็นสีจางและกดไม่ได้                 */
const CHAPTERS = [
  { id: 'ch01', file: 'ch01.html', en: 'Introduction to Irrigation',        th: 'บทนำสู่การชลประทาน',                  ready: true  },
  { id: 'ch02', file: 'ch02.html', en: 'Soil Water',                        th: 'น้ำในดิน',                             ready: true  },
  { id: 'ch03', file: 'ch03.html', en: 'Plant Water Use & Crop Water Req.', th: 'การใช้น้ำของพืชและความต้องการน้ำ',    ready: true  },
  { id: 'ch04', file: 'ch04.html', en: 'Irrigation Methods',                th: 'วิธีการให้น้ำชลประทาน',               ready: true  },
  { id: 'ch05', file: 'ch05.html', en: 'Measuring Water Applications',      th: 'การวัดปริมาณน้ำ',                     ready: true  },
  { id: 'ch06', file: 'ch06.html', en: 'Irrigation Hardware & System Design', th: 'อุปกรณ์ในระบบให้น้ำพืชและการออกแบบระบบให้น้ำพืช', ready: true  },
  { id: 'ch07', file: 'ch07.html', en: 'Irrigation Water Management',       th: 'การจัดการน้ำชลประทาน',                ready: true  }
];

/* ---------- ผู้สอน: แก้ที่บรรทัดเดียวนี้ มีผลทุกหน้า ---------- */
const LECTURER = { en: 'Asst. Prof. Charatchai Yenphayap', th: 'ผศ.จรัสชัย เย็นพยับ' };

function addLecturer() {
  const title = document.querySelector('.sidebar-title');
  if (!title || title.querySelector('.sidebar-lecturer')) return;
  title.insertAdjacentHTML('beforeend',
    `<span class="sidebar-lecturer"><span class="en">${LECTURER.en}</span><span class="th">${LECTURER.th}</span></span>`);
}

/* ---------- 2. สร้างเมนูจากทะเบียนบท + หัวข้อย่อยของหน้านี้ ---------- */
function buildSidebar(currentId) {
  const nav = document.querySelector('#sidebar-nav');
  if (!nav) return;

  const chapterHtml = [
    '<div class="nav-group"><span class="en">Chapters</span><span class="th">สารบัญบท</span></div>',
    ...CHAPTERS.map((c, i) => {
      const cls = ['nav-item', c.id === currentId ? 'active' : '', c.ready ? '' : 'todo'].join(' ').trim();
      const href = c.ready ? c.file : '#';
      return `<a class="${cls}" href="${href}">
        <span class="nav-num">${i + 1}</span>
        <span><span class="en">${c.en}</span><span class="th">${c.th}</span></span>
      </a>`;
    })
  ].join('');

  // หัวข้อย่อย อ่านจาก section[id] ของหน้านั้นโดยตรง ไม่ต้องมาไล่พิมพ์ซ้ำ
  const sections = [...document.querySelectorAll('.chapter section[id]')];
  const subHtml = sections.length ? [
    '<div class="nav-group"><span class="en">In this chapter</span><span class="th">หัวข้อในบทนี้</span></div>',
    ...sections.map(s => {
      const h = s.querySelector('h2');
      if (!h) return '';
      const en = h.querySelector('.en'), th = h.querySelector('.th');
      const label = en && th
        ? `<span class="en">${en.textContent}</span><span class="th">${th.textContent}</span>`
        : h.textContent;
      return `<a class="nav-sub" href="#${s.id}">${label}</a>`;
    })
  ].join('') : '';

  nav.innerHTML = chapterHtml + subHtml;
}

/* ---------- 3. ปุ่มพับเมนู ---------- */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('#toggle-sidebar');
  if (!sidebar || !toggle) return;
  if (window.innerWidth <= 900) sidebar.classList.add('collapsed');   // จอแคบเริ่มแบบพับไว้
  const flip = () => sidebar.classList.toggle('collapsed');
  toggle.addEventListener('click', flip);
  document.querySelector('.scrim')?.addEventListener('click', flip);
  sidebar.addEventListener('click', e => {
    if (e.target.closest('a') && window.innerWidth <= 900) sidebar.classList.add('collapsed');
  });
}

/* ---------- 4. ไฮไลต์หัวข้อที่กำลังอ่านอยู่ ---------- */
function initScrollSpy() {
  const sections = [...document.querySelectorAll('.chapter section[id]')];
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      document.querySelectorAll('.nav-sub').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
      });
    });
  }, { rootMargin: '-60px 0px -70% 0px' });
  sections.forEach(s => obs.observe(s));
}

/* ---------- 5. ปุ่มบทก่อนหน้า / บทถัดไป + คีย์ลัด ---------- */
function initPager(currentId) {
  const i = CHAPTERS.findIndex(c => c.id === currentId);
  const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
  document.querySelectorAll('[data-nav="prev"]').forEach(a => wireNav(a, prev, '←'));
  document.querySelectorAll('[data-nav="next"]').forEach(a => wireNav(a, next, '→'));

  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowLeft' && prev?.ready) location.href = prev.file;
    if (e.key === 'ArrowRight' && next?.ready) location.href = next.file;
    if (e.key === 's' || e.key === 'S') document.querySelector('.sidebar')?.classList.toggle('collapsed');
  });
}

function wireNav(a, chap, arrow) {
  if (!chap || !chap.ready) { a.classList.add('disabled'); a.removeAttribute('href'); return; }
  a.href = chap.file;
  const label = arrow === '←'
    ? `${arrow} <span class="en">${chap.en}</span><span class="th">${chap.th}</span>`
    : `<span class="en">${chap.en}</span><span class="th">${chap.th}</span> ${arrow}`;
  if (a.dataset.short === undefined) a.innerHTML = label;   // ปุ่มบนแถบบนใช้แค่ลูกศร
}

document.addEventListener('DOMContentLoaded', () => {
  const id = document.body.dataset.chapter || '';
  addLecturer();
  buildSidebar(id);
  initSidebar();
  initScrollSpy();
  initPager(id);
});
