# แหล่งข้อมูลอ้างอิง / Source materials

ไฟล์ในโฟลเดอร์นี้คือแหล่งข้อมูลที่ใช้เขียนเนื้อหาของเว็บไซต์
Files in this folder are the sources the chapter content is written from.

> **หมายเหตุเรื่องไฟล์ `.txt`** — ไฟล์ `.txt` ที่อยู่คู่กับ PDF บางไฟล์เป็นเพียง
> ส่วนหน้าที่ถูกตัดทอน ใช้อ้างอิงไม่ได้ ต้องดึงข้อความใหม่จาก PDF ทุกครั้ง
> The `.txt` siblings of some PDFs are truncated front matter only — always
> re-extract from the PDF itself.

---

## 1. หลักการชลประทาน (Irrigation Principles)

| | |
|---|---|
| **ไฟล์ / File** | `irrigation-principles-th.pdf` |
| **ผู้แต่ง / Author** | รองศาสตราจารย์ ดร.วิบูลย์ บุญยธโรกุล (Assoc. Prof. Dr. Wiboon Bunyatharokul) |
| **สังกัด / Affiliation** | ภาควิชาวิศวกรรมชลประทาน คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ |
| **พิมพ์ / Printed** | มกราคม พ.ศ. 2526 (January 1983) |
| **จำนวนหน้า / Pages** | 277 หน้าในไฟล์ PDF (หน้าหนังสือ = หน้า PDF − 6 ถึง − 9 แล้วแต่ช่วง) |

หนังสือ 10 บท ครอบคลุมตั้งแต่ดินและน้ำในดิน ไปจนถึงการส่งน้ำและการวัดน้ำ
A ten-chapter textbook running from soil and soil water through to conveyance
and water measurement.

**ข้อควรรู้ทางเทคนิค / Technical note:** ไฟล์นี้เป็นเอกสารสแกน โดยมีชั้นข้อความ
OCR ที่ใช้ฟอนต์ไทยแบบไม่ใช่ Unicode ดังนั้น `pdftotext` จะให้ข้อความที่อ่านไม่ออก
ต้องเรนเดอร์หน้าเป็นภาพแล้วอ่านแทน (ใช้ PyMuPDF: `pip install pymupdf`)
This is a scanned document whose OCR text layer uses a non-Unicode Thai font,
so `pdftotext` returns mojibake. Render the pages to images and read those
instead (PyMuPDF works: `pip install pymupdf`).

**ใช้ในบทใดบ้าง / Used in:**

| บท / Chapter | หัวข้อในเว็บ / Section on the site | บทในหนังสือ / Book chapter |
|---|---|---|
| ch01 | §1.11 การชลประทานในประเทศไทย | บทที่ 1 |
| ch02 | §2.10 ตารางลักษณะสัมผัส + ตารางเทนซิโอมิเตอร์ | บทที่ 7 |
| ch02 | §2.11 การไหลซึมของน้ำผ่านผิวดิน | บทที่ 3 |
| ch03 | §3.3 กล่องเปรียบเทียบสมการ ETp ยุคก่อน FAO-56 | บทที่ 5 |
| ch03 | §3.11 ปริมาณน้ำสุทธิ ปริมาณน้ำทั้งหมด ความถี่ ฝนใช้การ | บทที่ 8 |
| ch04 | §4.11 แปดวิธีให้น้ำทางผิวดิน + ตารางประสิทธิภาพ | บทที่ 6, 8 |
| ch05 | §5.1–5.9 ฝายวัดน้ำ รางวัดน้ำ การวัดน้ำ | บทที่ 10 |

---

## 2. Irrigation Systems Management (ASABE)

| | |
|---|---|
| **ไฟล์ / File** | `IrrigationSystemsManagement_compressed.pdf` |
| **ที่มา / Publisher** | ASABE, 2021 |
| **หมายเหตุ / Note** | เลขหน้า PDF = เลขหน้าหนังสือ + 24 |

ใช้เป็นโครงหลักของบทที่ 2 ถึง 4 โดยเฉพาะเรื่องน้ำในดิน การใช้น้ำของพืช
และวิธีการให้น้ำสมัยใหม่
The structural backbone of Chapters 2 to 4 — soil water, crop water use, and
modern application methods.

---

## 3. SCS National Engineering Handbook, Section 15, Chapter 3

| | |
|---|---|
| **ไฟล์ / File** | `neh15-03.pdf` |
| **ที่มา / Publisher** | USDA Soil Conservation Service |
| **หมายเหตุ / Note** | หัวข้อ "Adapted methods" อยู่ที่หน้า PDF 34–52 |

ใช้กับบทที่ 4 เรื่องการเลือกวิธีให้น้ำให้เหมาะกับดิน พืช และความลาดเท
Used in Chapter 4 for matching method to soil, crop and slope.

---

## 4. เอกสารประกอบการสอน / Course slides

| | |
|---|---|
| **ไฟล์ / File** | `irrigation technology 43.pdf` |
| **หมายเหตุ / Note** | สไลด์ประกอบการสอนของรายวิชา |

---

## 5. องค์ประกอบ อุปกรณ์ และการออกแบบระบบให้น้ำ (สไลด์สอน)

| | |
|---|---|
| **ไฟล์ / File** | `friction-loss-tables.md` (ถอดข้อมูลไว้ / transcribed) |
| **ต้นฉบับ / Original** | สไลด์ 54 หน้า + ตารางสแกน 15 หน้า — ไม่ได้อยู่ในที่เก็บนี้ |
| **เหตุผล / Why not** | ไฟล์ `.pptx` ต้นฉบับมีขนาด 58 MB ใหญ่เกินกว่าที่เก็บทั้งที่เก็บรวมกัน จึงตัดสินใจไม่นำเข้า repo — the original `.pptx` is 58 MB, larger than the whole repository, so it is deliberately kept out |

เอกสารประกอบการสอนของรายวิชา ว่าด้วยองค์ประกอบของระบบให้น้ำแบบเดินท่อ ท่อ PVC และ PE การคำนวณขนาดท่อ และการเลือกเครื่องสูบน้ำ
Course lecture slides on the components of a piped irrigation system, PVC and PE pipe,
pipe sizing, and pump selection, issued with a set of scanned friction-loss tables.

ตัวไฟล์ต้นฉบับไม่ได้เก็บไว้ในที่เก็บนี้ จึงถอดตารางความเสียดทานทั้งชุดไว้เป็นไฟล์ `friction-loss-tables.md` เพราะบทที่ 6 อ้างอิงตารางเหล่านี้ตลอดทั้งบท
The original files are not stored here, so the full set of friction-loss tables was
transcribed into `friction-loss-tables.md`, which Chapter 6 references throughout.

**ใช้ในบทใด / Used in:** ch06 ทั้งบท (§6.1–§6.11)

---

## 6. การประเมินการสูญเสียดินในพื้นที่เกษตรกรรม (กรมพัฒนาที่ดิน)

| | |
|---|---|
| **ไฟล์ / File** | `ldd-soil-loss-assessment-th.pdf` (7.3 MB, 66 หน้า) |
| **ผู้จัดทำ / Author** | นางสาวถนอมขวัญ ทิพวงศ์ — กลุ่มวิจัยและพัฒนาการอนุรักษ์ดินและน้ำเพื่อการเกษตร, กวจ., กรมพัฒนาที่ดิน |

เอกสารหลักของบทที่ 8 คือชุดค่าปัจจัยทั้งหมดของ USLE ในระบบของกรมพัฒนาที่ดิน
The primary source for Chapter 8 — the complete LDD factor set for USLE:
the R regression `R = 0.4669X − 12.1415` of มนู ศรีขจร และคณะ (2527) with its
lookup table, K by texture × region × upland/lowland, the separate L and S
equations with five m bands, C by crop and by land use, P with strip widths
and maximum slope lengths, the tolerance T, and a fully worked kenaf example
at Khon Kaen with the two design formulas `P2 = A2·P1/A1` and `L2 = (A2/A1)·L1`.

**ใช้ในบทใด / Used in:** ch08 §8.4–§8.9 ทั้งหมด

---

## 7. การอนุรักษ์ดินและน้ำ (กรมพัฒนาที่ดิน, 2556)

| | |
|---|---|
| **ไฟล์ / File** | `ldd-soil-water-conservation-th.pdf` (8.7 MB, 38 หน้า) |

ที่มาของค่า T ของไทย ชั้นความรุนแรงห้าชั้น สถิติระดับประเทศ และคำแนะนำตามช่วงความลาดชัน
Source of the Thai soil-loss tolerance (T = 2 t/rai/yr), the five severity
classes, the national erosion statistics, the LDD taxonomy of erosion types
including internal erosion and the 5–8 cm rill-to-gully threshold, and the
slope-band advice to farmers.

**ใช้ในบทใด / Used in:** ch08 §8.1, §8.2, §8.9, §8.10

---

## 8. คู่มือวิธีการก่อสร้างระบบอนุรักษ์ดินและน้ำบนพื้นที่สูง

| | |
|---|---|
| **ไฟล์ / File** | `ldd-highland-construction-manual-th.pdf` (5.3 MB, 108 หน้า) |
| **ผู้จัดทำ / Author** | สนิท อินทะชัย — ศูนย์ปฏิบัติการโครงการหลวงภาคเหนือ, สำนักงานพัฒนาที่ดินเขต 6, กรมพัฒนาที่ดิน |

คู่มือก่อสร้างระบบอนุรักษ์ดินและน้ำในพื้นที่ศูนย์พัฒนาโครงการหลวง 37 ศูนย์
The construction manual for the 37 Royal Project development centres: the
seven structures LDD actually builds (diversion, broad-base terrace, bench
terrace, hillside ditch, orchard hillside terrace, waterway, drop structure),
each with its slope band, benefits and limits; the level-versus-graded rule;
the 10-year peak, 15 cm freeboard, 300 m and 3–5% grade constraints; the
bench-terrace design formulas of T. C. Sheng (FAO THA/76/001) with dimension
tables for 2.5, 3 and 4 m benches; and field construction standards and
labour rates.

**ใช้ในบทใด / Used in:** ch08 §8.10

---

## 9. การอนุรักษ์ดินและน้ำ — บัญชี 34 มาตรการ (กรมพัฒนาที่ดิน)

| | |
|---|---|
| **ไฟล์ / File** | `ldd-conservation-measures-th.pdf` (5.3 MB, 49 หน้า) |

เอกสารประกอบการสอนของกรมพัฒนาที่ดิน ว่าด้วยนิยาม สาเหตุ วัตถุประสงค์ และ
**หลักสี่ข้อ** ของการอนุรักษ์ดินและน้ำ ตามด้วยบัญชีมาตรการครบทั้ง **34 มาตรการ**
แบ่งเป็นวิธีกล 24 (1.1–1.24) และวิธีพืช 10 (2.1–2.10) โดยแต่ละมาตรการมีวัตถุประสงค์
และ **หลักเกณฑ์การนำไปใช้** กำกับไว้ ซึ่งเป็นส่วนที่ระบุช่วงความลาดชันและเงื่อนไข
ที่ทำให้มาตรการนั้นใช้ไม่ได้

The LDD teaching document on soil and water conservation: the definition, the
three causes, the six objectives, and the **four principles** — condition the
soil, cover the soil, slow the runoff and wind, drain the runoff properly —
followed by the complete catalogue of **34 measures**, twenty-four mechanical
(1.1–1.24) and ten vegetative (2.1–2.10). Each entry carries its objectives and
its *application criteria*, which is where the slope bands and the conditions
that void a measure are stated: contour cultivation 2–7% with λ ≤ 100 m,
terracing 2–12%, strip cropping ≤ 15%, cover crops above 20%, hillside ditches
below 40%, bench terraces inward-sloping above 650 mm/yr, grassed waterways
≤ 30 m, no-tillage only with a mulch, and windbreaks at 10–12 × their height.

**ใช้ในบทใด / Used in:** ch08 §8.10

---

## ยังไม่ได้เพิ่ม / Not yet in this folder

**หลักการชลประทาน (Irrigation Principle)** โดย อาจารย์บุญมา ป้านประดิษฐ์
ภาควิชาวิศวกรรมชลประทาน มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน, มกราคม 2546
— เป็นหนังสือคนละเล่มกับข้อ 1 แม้ชื่อจะใกล้เคียงกันมาก ถ้าบันทึกไฟล์ลงโฟลเดอร์นี้
แล้วจะเพิ่มรายละเอียดและนำเนื้อหามาใช้ต่อได้

A second, different book with a near-identical title, by Ajarn Boonma
Panpradit (Kasetsart University Kamphaeng Saen, B.E. 2546). Drop the PDF into
this folder and it can be catalogued and drawn on like the others.


**เอกสารของกรมพัฒนาที่ดินอีกหนึ่งฉบับ** ที่แนบมาพร้อมชุดของบทที่ 8 แต่ยังไม่ได้นำมาใช้
คือ *มาตรการอนุรักษ์ดินและน้ำบนพื้นที่ลาดชันสูงในเขตภาคเหนือของประเทศไทย*
โดย อุทิศ เตจ๊ะใจ ศูนย์ปฏิบัติการโครงการหลวงภาคเหนือ สำนักงานพัฒนาที่ดินเขต 6
(46 หน้า, มีนาคม 2548) ถ้าต้องการนำมาเพิ่มในบท ให้วางไฟล์ไว้ในโฟลเดอร์นี้ได้เลย

**One further LDD document** was supplied with the Chapter 8 material but has
not yet been drawn on: *มาตรการอนุรักษ์ดินและน้ำบนพื้นที่ลาดชันสูงในเขตภาคเหนือของประเทศไทย*
by อุทิศ เตจ๊ะใจ, Northern Royal Project Operations Centre, Land Development
Regional Office 6 (46 pp., March B.E. 2548). Drop it into this folder to bring
it in.
