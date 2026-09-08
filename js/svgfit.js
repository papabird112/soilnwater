/* ============================================================
   svgfit.js — กันตัวหนังสือในรูป SVG ล้นกรอบ
   Keep SVG labels inside their frame.

   ทำไมต้องมี: <text> ใน SVG ไม่ตัดบรรทัดเองเหมือน HTML เขียนยาวไป
   ก็ล้นออกนอก viewBox แล้วโดนตัดหาย สคริปต์นี้วัดความกว้างจริง
   หลังหน้าโหลด ถ้าเกินกรอบจะตัดขึ้นบรรทัดใหม่ให้อัตโนมัติ
   (ตัดคำไทยด้วย Intl.Segmenter) แล้วขยายความสูง viewBox ตามบรรทัด
   ที่เพิ่มขึ้น ทำงานซ้ำทุกครั้งที่สลับภาษา

   ตรวจด้วยตาเอง: เติม ?fitcheck ท้าย URL — จะขึ้นกรอบรอบข้อความ
   ทุกชิ้น (เขียว = อยู่ในกรอบ, แดง = ล้น) และรายงานใน console
   เรียกเองได้ทุกเมื่อ: checkSvgFit()
   ============================================================ */

const SVG_NS = 'http://www.w3.org/2000/svg';
const FIT_PAD = 6;        // ระยะเผื่อจากขอบ viewBox (user units)

/* ---------- ตัดคำ: ไทยใช้ Intl.Segmenter, ที่เหลือใช้ช่องว่าง ---------- */
function fitSegments(str) {
  const isThai = /[฀-๿]/.test(str);
  if (window.Intl && Intl.Segmenter) {
    try {
      const seg = new Intl.Segmenter(isThai ? 'th' : undefined, { granularity: 'word' });
      return [...seg.segment(str)].map(s => s.segment);
    } catch (e) { /* fall through */ }
  }
  return str.split(/(\s+)/).filter(Boolean);
}

/* ---------- ความกว้างที่ใช้ได้ของข้อความชิ้นหนึ่ง ---------- */
function availableWidth(t, vb) {
  const anchor = getComputedStyle(t).textAnchor || 'start';
  const x = parseFloat(t.getAttribute('x'));
  const left = vb.x + FIT_PAD, right = vb.x + vb.width - FIT_PAD;
  if (!isFinite(x)) return right - left;
  if (anchor === 'middle') return 2 * Math.min(x - left, right - x);
  if (anchor === 'end')    return x - left;
  return right - x;
}

/* ---------- ตัดข้อความหนึ่งชิ้นเป็นหลายบรรทัด ---------- */
function wrapText(t, maxWidth) {
  const full = t.dataset.full !== undefined ? t.dataset.full : (t.dataset.full = t.textContent);
  const x = t.getAttribute('x');
  const lineHeight = parseFloat(getComputedStyle(t).fontSize) * 1.35;

  t.textContent = '';
  const newLine = first => {
    const s = document.createElementNS(SVG_NS, 'tspan');
    if (x !== null) s.setAttribute('x', x);
    s.setAttribute('dy', first ? 0 : lineHeight);
    t.appendChild(s);
    return s;
  };

  let span = newLine(true), line = [], lines = 1;
  for (const word of fitSegments(full)) {
    span.textContent = line.join('') + word;
    if (line.length && span.getComputedTextLength() > maxWidth) {
      span.textContent = line.join('');          // ปิดบรรทัดเดิม
      line = [word.replace(/^\s+/, '')];         // ขึ้นบรรทัดใหม่
      span = newLine(false);
      span.textContent = line.join('');
      lines++;
    } else {
      line.push(word);
    }
  }
  return { lines, lineHeight };
}

/* ---------- ตรวจทั้งหน้า ---------- */
function checkSvgFit(verbose) {
  const debug = verbose || new URLSearchParams(location.search).has('fitcheck');
  const report = [];

  document.querySelectorAll('figure svg').forEach(svg => {
    const vb = svg.viewBox.baseVal;
    if (!vb || !vb.width) return;

    // ความสูงเดิมของ viewBox เก็บไว้ครั้งแรก เพื่อไม่ให้ยืดสะสมทุกรอบ
    if (svg.dataset.vbh === undefined) svg.dataset.vbh = vb.height;
    vb.height = parseFloat(svg.dataset.vbh);

    svg.querySelector('.fitcheck-overlay')?.remove();
    const overlay = debug ? document.createElementNS(SVG_NS, 'g') : null;
    if (overlay) overlay.setAttribute('class', 'fitcheck-overlay');

    let neededBottom = vb.y + vb.height;

    svg.querySelectorAll('text').forEach(t => {
      if (!t.textContent.trim()) return;
      if (getComputedStyle(t).display === 'none') return;   // ภาษาที่ซ่อนอยู่ ข้ามไป

      // คืนค่าเดิมก่อนวัดใหม่ (เผื่อเคยตัดบรรทัดไว้แล้ว)
      if (t.dataset.full !== undefined) t.textContent = t.dataset.full;

      const avail = availableWidth(t, vb);
      let width = t.getComputedTextLength();
      let wrapped = 0;

      if (width > avail && avail > 20) {
        const r = wrapText(t, avail);
        wrapped = r.lines - 1;
        width = Math.max(...[...t.children].map(s => s.getComputedTextLength()), 0);
        if (wrapped) neededBottom = Math.max(neededBottom, t.getBBox().y + t.getBBox().height + 4);
      }

      const over = width - avail;
      if (debug) {
        const b = t.getBBox();
        const box = document.createElementNS(SVG_NS, 'rect');
        box.setAttribute('x', b.x); box.setAttribute('y', b.y);
        box.setAttribute('width', b.width); box.setAttribute('height', b.height);
        box.setAttribute('fill', 'none');
        box.setAttribute('stroke', over > 0.5 ? '#e00' : '#0a0');
        box.setAttribute('stroke-width', '1');
        box.setAttribute('stroke-dasharray', '3 2');
        overlay.appendChild(box);
      }
      if (over > 0.5 || wrapped) {
        report.push({
          figure: svg.getAttribute('aria-label') || '(svg)',
          text: t.dataset.full || t.textContent,
          status: over > 0.5 ? 'STILL OVERFLOWS' : 'wrapped to ' + (wrapped + 1) + ' lines',
          overflowPx: Math.max(0, Math.round(over))
        });
      }
    });

    // ขยายกรอบล่างถ้าบรรทัดที่เพิ่มมาล้นออกไป
    // ponytail: ยืดเฉพาะด้านล่าง พอสำหรับข้อความอธิบายที่วางไว้ท้ายรูป
    // ถ้าอนาคตมีข้อความยาวกลางรูป ให้ย้ายไปไว้ใน <figcaption> แทน
    if (neededBottom > vb.y + vb.height) vb.height = neededBottom - vb.y;
    if (overlay) svg.appendChild(overlay);
  });

  const bad = report.filter(r => r.overflowPx > 0);
  if (bad.length) console.warn('[svgfit] ข้อความยังล้นกรอบ / still overflowing:', bad);
  if (debug) {
    console.info('[svgfit] ตรวจแล้ว / checked ' + document.querySelectorAll('figure svg text').length + ' labels');
    if (report.length) console.table(report); else console.info('[svgfit] ทุกข้อความอยู่ในกรอบ / all labels fit');
  }
  return report;
}

document.addEventListener('DOMContentLoaded', () => checkSvgFit());
document.addEventListener('langchange', () => checkSvgFit());
