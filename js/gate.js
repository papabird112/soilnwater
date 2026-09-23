/* ============================================================
   gate.js — ประตูยืนยันสิทธิ์เข้าเรียน / Course access gate

   ทำงานอย่างไร / How it works
   ---------------------------
   1. ไฟล์นี้ถูกโหลดแบบ synchronous ใน <head> ของทุกหน้า จึงทำงาน
      "ก่อน" เบราว์เซอร์วาดเนื้อหา ทำให้ไม่เห็นบทเรียนแวบหนึ่งก่อนถูกล็อก
      Loaded synchronously in <head> so it runs before paint — no flash
      of the lesson before the lock appears.
   2. ถ้าเคยปลดล็อกแล้ว (ค่าใน localStorage) ก็ไม่ทำอะไรเลย
      If already unlocked (localStorage), it does nothing at all.
   3. ถ้ายังไม่ปลดล็อก จะใส่ data-locked ไว้ที่ <html> ซึ่ง css/gate.css
      ใช้ซ่อนเนื้อหาทั้งหน้า แล้วแทรกโมดอลกรอกรหัสเข้ามาแทน
      If locked, it marks <html data-locked> — css/gate.css hides the page —
      and injects the passcode modal in its place.

   ข้อจำกัดที่ต้องเข้าใจ / What this is and is not
   ---------------------------------------------
   นี่คือ "ประตูฝั่งผู้ใช้" (client-side gate) เหมาะกับการกันคนทั่วไป
   ที่บังเอิญเปิดเจอ และเป็นการบอกว่าเนื้อหานี้สำหรับผู้เรียนในวิชา
   แต่ "ไม่ใช่ระบบความปลอดภัยจริง" เพราะไฟล์ HTML/JS ทั้งหมดถูกส่งไป
   ที่เบราว์เซอร์อยู่แล้ว ผู้ที่ตั้งใจจริงสามารถข้ามได้เสมอ
   ถ้าต้องการกันจริงจัง ต้องมีเซิร์ฟเวอร์ตรวจสิทธิ์ก่อนส่งไฟล์

   This is a client-side gate. It keeps casual visitors out and signals that
   the material is for enrolled students. It is NOT real access control —
   the HTML and JS are delivered to the browser either way, so anyone
   determined can bypass it. Real protection needs a server that checks
   authorisation before sending the files.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. ค่าที่ปรับได้ / Configuration ----------
     แก้สามค่านี้ได้โดยไม่ต้องแตะส่วนอื่น
     These three are the only things you normally need to change. */

  var CONFIG = {
    /* คีย์ที่ใช้จำสถานะปลดล็อกใน localStorage
       localStorage key that remembers the unlocked state. */
    storeKey: 'isCourseUnlocked',

    /* ลายนิ้วมือของรหัสผ่าน (ไม่ใช่ตัวรหัสเอง — ดู hash() ข้างล่าง)
       เปลี่ยนรหัสผ่าน: เปิดคอนโซลของเบราว์เซอร์แล้วพิมพ์
           courseGate.hash('รหัสใหม่')
       จากนั้นนำค่าที่ได้มาใส่แทนบรรทัดนี้
       Fingerprint of the passcode — not the passcode itself (see hash()).
       To change it, open the browser console and run
           courseGate.hash('your new passcode')
       then paste the result here. */
    codeHash: '06446aee',

    /* ลิงก์ "ติดต่อผู้สอน / ขอรับรหัสผ่าน"
       ใส่ได้ทั้ง mailto:, ลิงก์กลุ่ม LINE, MS Teams หรือหน้าเว็บภาควิชา
       ถ้าเว้นว่างไว้ ปุ่มจะแสดงข้อความแนะนำแบบในหน้าแทนการเปิดลิงก์
       Contact link for students who do not have the passcode yet.
       A mailto:, a LINE group, an MS Teams link or a department page all work.
       Left empty, the button shows an inline note instead of opening a link. */
    contactUrl: ''
  };

  /* คีย์ภาษา ใช้ร่วมกับ js/site.js เพื่อให้ประตูพูดภาษาเดียวกับเว็บ
     Shared with js/site.js so the gate speaks the same language as the site. */
  var LANG_KEY = 'irrig.lang';

  /* เกลือที่ใส่ลงไปตอนคำนวณลายนิ้วมือ
     Salt mixed in when computing the fingerprint. */
  var SALT = 'irrig.kmitl.2569.';

  /* ---------- 2. ลายนิ้วมือของรหัสผ่าน / Passcode fingerprint ----------
     ใช้ FNV-1a วนซ้ำหลายรอบ เพื่อไม่ให้รหัสผ่านปรากฏเป็นข้อความตรง ๆ
     ในซอร์สโค้ด ย้ำว่านี่คือการ "อำพราง" ไม่ใช่การเข้ารหัสเชิงความปลอดภัย
     FNV-1a, iterated. This keeps the passcode from sitting in the source in
     plain sight. It is obfuscation, not cryptography — see the note above. */

  function hash(text) {
    var s = SALT + String(text) + SALT;
    var h = 0x811c9dc5;                       // FNV-1a offset basis
    for (var r = 0; r < 512; r++) {
      for (var i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;   // FNV prime
      }
      h = Math.imul(h ^ r, 0x01000193) >>> 0; // ผูกรอบเข้าไปด้วย / fold the round in
    }
    /* ผสมท้ายแบบ fmix32 ของ MurmurHash3 — ดึงบิตสูงลงมาคลุกกับบิตต่ำ
       ถ้าไม่ทำขั้นนี้ ไบต์ท้ายของผลลัพธ์จะซ้ำกันทุกครั้งตามธรรมชาติของ FNV
       MurmurHash3's fmix32 avalanche step — folds the high bits down into the
       low ones. Without it, FNV leaves the last byte the same for every input. */
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0;
    h = (h ^ (h >>> 16)) >>> 0;

    var hex = h.toString(16);
    while (hex.length < 8) hex = '0' + hex;
    return hex;
  }

  /* ---------- 3. อ่าน/เขียนสถานะ / Reading and writing the state ----------
     localStorage ใช้ไม่ได้ในโหมดส่วนตัวของบางเบราว์เซอร์ จึงหุ้ม try ไว้ทุกจุด
     localStorage throws in some private-browsing modes — every call is wrapped. */

  function isUnlocked() {
    try { return localStorage.getItem(CONFIG.storeKey) === 'true'; }
    catch (e) { return false; }
  }

  function remember() {
    try { localStorage.setItem(CONFIG.storeKey, 'true'); } catch (e) { /* ไม่เป็นไร */ }
  }

  function forget() {
    try { localStorage.removeItem(CONFIG.storeKey); } catch (e) { /* ไม่เป็นไร */ }
  }

  function savedLang() {
    try { return localStorage.getItem(LANG_KEY) || 'th'; } catch (e) { return 'th'; }
  }

  /* ---------- 4. ซ่อนหน้าไว้ก่อน / Hide the page immediately ----------
     ทำทันทีตั้งแต่อยู่ใน <head> ก่อน <body> จะถูกสร้างด้วยซ้ำ
     Runs from <head>, before <body> even exists. */

  var locked = !isUnlocked();
  if (locked) document.documentElement.setAttribute('data-locked', '');

  /* ---------- 5. ข้อความสองภาษา / Bilingual strings ----------
     ใช้รูปแบบเดียวกับทั้งเว็บ คือ <span class="en"> คู่กับ <span class="th">
     แล้วให้ CSS ซ่อนฝั่งที่ไม่ตรงกับ <html lang>
     Same convention as the rest of the site: paired .en / .th spans, with CSS
     hiding whichever does not match <html lang>. */

  function pair(en, th) {
    return '<span class="en">' + en + '</span><span class="th">' + th + '</span>';
  }

  /* ---------- 6. สร้างโมดอล / Build the modal ---------- */

  function buildGate() {
    var gate = document.createElement('div');
    gate.className = 'gate';
    gate.id = 'gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'gate-title');

    gate.innerHTML =
      '<div class="gate-card">' +

        /* ปุ่มสลับภาษาในตัว เพราะ js/site.js ยังไม่ทำงานตอนนี้
           The gate carries its own language switch — site.js has not run yet. */
        '<div class="gate-lang" role="group" aria-label="Language">' +
          '<button type="button" class="gate-lang-btn" data-lang="th">TH</button>' +
          '<button type="button" class="gate-lang-btn" data-lang="en">EN</button>' +
        '</div>' +

        '<div class="gate-mark" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" ' +
               'stroke="currentColor" stroke-width="1.8" ' +
               'stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="10.5" width="16" height="10.5" rx="2"></rect>' +
            '<path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"></path>' +
          '</svg>' +
        '</div>' +

        '<p class="gate-eyebrow">' +
          pair('Irrigation Technology · course site',
               'เทคโนโลยีการชลประทาน · เว็บไซต์ประกอบการเรียน') +
        '</p>' +

        '<h1 class="gate-title" id="gate-title">' +
          pair('Verify your access', 'ยืนยันสิทธิ์เข้าเรียน') +
        '</h1>' +

        '<p class="gate-lede">' +
          pair('This material is for students enrolled in the course. ' +
               'Enter the passcode your lecturer gave you to open the lessons.',
               'เนื้อหาชุดนี้สำหรับผู้เรียนในรายวิชา ' +
               'กรุณากรอกรหัสผ่านที่ได้รับจากผู้สอนเพื่อเปิดเข้าบทเรียน') +
        '</p>' +

        '<form class="gate-form" novalidate>' +
          '<label class="gate-label" for="gate-input">' +
            pair('Passcode', 'รหัสผ่าน') +
          '</label>' +

          '<div class="gate-field">' +
            '<input id="gate-input" class="gate-input" type="password" ' +
                   'autocomplete="off" autocapitalize="off" autocorrect="off" ' +
                   'spellcheck="false" aria-describedby="gate-error" />' +
            /* ปุ่มรูปตา สำหรับสลับซ่อน/แสดงรหัส
               Eye toggle for showing and hiding the passcode. */
            '<button type="button" class="gate-eye" aria-pressed="false">' +
              '<span class="gate-sr">' +
                pair('Show passcode', 'แสดงรหัสผ่าน') +
              '</span>' +
              '<svg class="gate-eye-open" viewBox="0 0 24 24" width="19" height="19" ' +
                   'fill="none" stroke="currentColor" stroke-width="1.7" ' +
                   'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"></path>' +
                '<circle cx="12" cy="12" r="2.8"></circle>' +
              '</svg>' +
              '<svg class="gate-eye-shut" viewBox="0 0 24 24" width="19" height="19" ' +
                   'fill="none" stroke="currentColor" stroke-width="1.7" ' +
                   'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M2 12s3.6-6.5 10-6.5c1.9 0 3.5.6 4.9 1.4"></path>' +
                '<path d="M21.2 9.2C21.7 10.6 22 12 22 12s-3.6 6.5-10 6.5c-1.4 0-2.7-.3-3.8-.8"></path>' +
                '<line x1="3.5" y1="3.5" x2="20.5" y2="20.5"></line>' +
              '</svg>' +
            '</button>' +
          '</div>' +

          /* aria-live ทำให้โปรแกรมอ่านหน้าจออ่านข้อความผิดพลาดทันทีที่ปรากฏ
             aria-live makes a screen reader announce the error as it appears. */
          '<p class="gate-error" id="gate-error" role="alert" aria-live="polite"></p>' +

          '<button type="submit" class="btn solid gate-submit">' +
            pair('Verify and enter', 'ยืนยันสิทธิ์เข้าเรียน') +
          '</button>' +
        '</form>' +

        '<button type="button" class="gate-help">' +
          pair('No passcode yet? Contact your lecturer',
               'ยังไม่มีรหัสผ่าน? ติดต่อผู้สอนเพื่อขอรับรหัส') +
        '</button>' +

        '<p class="gate-note" hidden>' +
          pair('Ask Asst. Prof. Charatchai Yenphayap for the passcode — ' +
               'in class, or through the course group chat.',
               'กรุณาขอรหัสผ่านจาก ผศ.จรัสชัย เย็นพยับ ได้ที่ห้องเรียน ' +
               'หรือทางกลุ่มแชทของรายวิชา') +
        '</p>' +

      '</div>';

    return gate;
  }

  /* ---------- 7. แถบแจ้งผลสำเร็จ / Success toast ---------- */

  function showToast() {
    var toast = document.createElement('div');
    toast.className = 'gate-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" ' +
           'stroke="currentColor" stroke-width="2.2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 12.5 9.5 18 20 6.5"></path>' +
      '</svg>' +
      '<span>' + pair('Access verified — welcome', 'ยืนยันสิทธิ์สำเร็จ ยินดีต้อนรับ') + '</span>';
    document.body.appendChild(toast);

    /* ค้างไว้ราว 2.6 วินาที แล้วจางหายและถอดออกจาก DOM
       Hold for ~2.6 s, then fade and remove from the DOM. */
    setTimeout(function () {
      toast.classList.add('is-going');
      setTimeout(function () { toast.remove(); }, 400);
    }, 2600);
  }

  /* ---------- 8. ปลดล็อก / Unlock ---------- */

  function unlock(gate) {
    remember();
    document.documentElement.removeAttribute('data-locked');

    if (gate) {
      gate.classList.add('is-going');
      /* รอให้โมดอลจางหายก่อนจึงถอดออก ไม่งั้นจะกระตุก
         Let the modal finish fading before removing it. */
      setTimeout(function () { gate.remove(); }, 320);
    }
    showToast();
  }

  /* ---------- 9. ต่อสายการทำงานทั้งหมด / Wire it up ---------- */

  function mount() {
    if (!locked) return;

    /* ให้ประตูพูดภาษาที่ผู้ใช้เลือกไว้ครั้งก่อน
       Open the gate in whichever language the user last chose. */
    document.documentElement.lang = savedLang();

    var gate = buildGate();
    document.body.appendChild(gate);

    var form   = gate.querySelector('.gate-form');
    var input  = gate.querySelector('.gate-input');
    var eye    = gate.querySelector('.gate-eye');
    var error  = gate.querySelector('.gate-error');
    var help   = gate.querySelector('.gate-help');
    var note   = gate.querySelector('.gate-note');
    var card   = gate.querySelector('.gate-card');

    input.focus();

    /* --- ปุ่มภาษา / language buttons --- */
    gate.querySelectorAll('.gate-lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === document.documentElement.lang);
      b.addEventListener('click', function () {
        document.documentElement.lang = b.dataset.lang;
        try { localStorage.setItem(LANG_KEY, b.dataset.lang); } catch (e) { /* ไม่เป็นไร */ }
        gate.querySelectorAll('.gate-lang-btn').forEach(function (o) {
          o.classList.toggle('active', o === b);
        });
        input.focus();
      });
    });

    /* --- ปุ่มรูปตา / eye toggle --- */
    eye.addEventListener('click', function () {
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      eye.setAttribute('aria-pressed', String(!showing));
      eye.classList.toggle('is-showing', !showing);
      input.focus();
    });

    /* --- ปุ่มขอรหัส / contact the lecturer --- */
    help.addEventListener('click', function () {
      if (CONFIG.contactUrl) {
        window.open(CONFIG.contactUrl, '_blank', 'noopener');
      } else {
        /* ยังไม่ได้ตั้งลิงก์ไว้ จึงแสดงข้อความแนะนำในหน้าแทน
           No link configured — show the inline note instead. */
        note.hidden = false;
        help.hidden = true;
      }
    });

    /* --- พิมพ์ใหม่แล้วให้ข้อความผิดพลาดหายไป
           Typing again clears the error --- */
    input.addEventListener('input', function () {
      error.textContent = '';
      card.classList.remove('is-wrong');
    });

    /* --- ส่งฟอร์ม / submit --- */
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var typed = input.value.trim();

      if (hash(typed) === CONFIG.codeHash) {
        unlock(gate);
        return;
      }

      /* รหัสผิด: ข้อความสีแดง + เอฟเฟกต์สั่น
         Wrong passcode: red message plus a shake. */
      error.textContent = document.documentElement.lang === 'en'
        ? 'Incorrect passcode. Please check it and try again.'
        : 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง';

      card.classList.remove('is-wrong');
      void card.offsetWidth;            /* บังคับให้เบราว์เซอร์เริ่มอนิเมชันใหม่
                                           force a reflow so the animation replays */
      card.classList.add('is-wrong');

      input.select();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  /* ---------- 10. เครื่องมือสำหรับผู้สอน / Lecturer console helpers ----------
     เปิด DevTools Console แล้วเรียกใช้ได้ เช่น
         courseGate.lock()                 ล็อกกลับ (เช่น บนเครื่องที่ใช้ร่วมกัน)
         courseGate.hash('รหัสใหม่')       คำนวณลายนิ้วมือของรหัสใหม่
     Open DevTools Console and call, for example
         courseGate.lock()                 lock again, e.g. on a shared computer
         courseGate.hash('new passcode')   compute the fingerprint of a new code */

  window.courseGate = {
    hash: hash,
    isUnlocked: isUnlocked,
    lock: function () { forget(); location.reload(); },
    unlock: function () { remember(); location.reload(); }
  };
})();
