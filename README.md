# SAAIS V2

HTML prototype สำหรับระบบสารสนเทศโรงเรียนเนินสง่าวิทยา ครอบคลุมหน้าก่อนเข้าสู่ระบบ หน้าหลังเข้าสู่ระบบ ข้อมูลบุคลากร ประวัตินักเรียน การบันทึกการเข้าเรียน และตัวอย่างองค์ประกอบที่ใช้ภายในระบบ

โปรเจกต์นี้เป็น Static HTML/CSS/JavaScript ยังไม่มี backend, database หรือ build tool สามารถใช้เป็นต้นแบบ UI/UX ก่อนนำไปเชื่อมต่อระบบจริง

## หน้าตัวอย่าง

| ไฟล์ | รายละเอียด |
| --- | --- |
| `index.html` | รวมลิงก์เข้าสู่หน้าตัวอย่างทั้งหมด |
| `login.html` | หน้าเข้าสู่ระบบ |
| `forgot-password.html` | หน้าลืมรหัสผ่าน |
| `about.html` | หน้าอธิบายความเป็นมาและข้อมูลระบบ |
| `main.html` | หน้าเมนูหลักหลังเข้าสู่ระบบ |
| `content.html` | ตัวอย่างองค์ประกอบหลัก ฟอร์ม ตาราง รายงาน Chart ปฏิทิน และตารางเรียน |
| `change-password.html` | หน้าเปลี่ยนรหัสผ่านหลังเข้าสู่ระบบ |
| `profile.html` | หน้าโปรไฟล์บุคลากร พร้อม Photo Gallery และ Lightbox |
| `learn.html` | หน้าบันทึกการเข้าเรียน รองรับการใช้งานบนมือถือ |
| `history.html` | หน้าประวัตินักเรียน พร้อมข้อมูลครอบครัว ทุนการศึกษา ประวัติพฤติกรรม และส่งออก PDF |

## โครงสร้างโปรเจกต์

```text
saais-v2/
├── css/
│   ├── header-before-login.css
│   ├── header-after-login.css
│   ├── content.css
│   ├── about.css
│   ├── change-password.css
│   ├── forgot-password.css
│   ├── history.css
│   ├── index.css
│   ├── learn.css
│   ├── login.css
│   └── profile.css
├── images/
│   ├── school_logo.gif
│   ├── no-profile-image.png
│   └── module-*.png
├── scripts/
│   ├── calendar.js
│   ├── change-password.js
│   ├── content.js
│   ├── history.js
│   ├── learn.js
│   └── profile.js
├── *.html
└── README.md
```

## แนวทางจัด Theme และ CSS

- หน้าก่อนเข้าสู่ระบบใช้ `header-before-login.css` ร่วมกับ CSS เฉพาะหน้า เช่น `login.css`, `forgot-password.css` และ `about.css`
- หน้าหลังเข้าสู่ระบบใช้ `header-after-login.css` และ `content.css` เป็นโครงหลัก
- หน้าที่มีองค์ประกอบเฉพาะจะแยก CSS เพิ่มเติม เช่น `learn.css`, `profile.css` และ `history.css`
- `index.css` ใช้เฉพาะหน้า `index.html`
- Theme หลักใช้พื้นหลังสีขาว สีแดงเข้มเป็นสีเน้น และสีน้ำเงินสำหรับข้อความหรือลิงก์ที่โต้ตอบได้
- ตารางใช้หัวตารางสีเทาอ่อน เส้นคั่นบาง แถวสลับสี และ hover เพื่อช่วยติดตามข้อมูล

## JavaScript

- `scripts/content.js` จัดการ Dropdown, Buddhist date label, Chart และฟังก์ชัน PDF พื้นฐาน
- `scripts/calendar.js` จัดการ Date Picker และตรวจสอบรูปแบบวันที่
- `scripts/change-password.js` จัดการแสดง/ซ่อนรหัสผ่าน และตรวจ Password Confirmation
- `scripts/learn.js` จัดการสถานะการเข้าเรียนและสีพื้นหลังแต่ละรายการ
- `scripts/profile.js` จัดการ Photo Gallery Lightbox
- `scripts/history.js` จัดหน้า A4 และสร้าง PDF ประวัตินักเรียน

## History PDF

หน้า `history.html` สามารถส่งออกข้อมูลเป็น PDF ผ่าน jsPDF และ html2canvas

- ส่งออกเป็นกระดาษ A4 แนวตั้ง
- ตรวจสอบตำแหน่ง `history-section` และดันกล่องไปหน้าใหม่เมื่อพื้นที่ไม่เพียงพอ
- ใช้ความละเอียด `2x` และ JPEG Quality `94%` เพื่อเน้นความคมชัด
- ใช้ JPEG และเปิด PDF compression เพื่อลดขนาดไฟล์
- หาก library จาก CDN โหลดไม่ได้ ระบบจะเปิด Browser Print เพื่อเลือก Save as PDF
- ชื่อไฟล์ถูกสร้างจาก `generateFileName('student-history-profile')`

## Responsive Design

- รองรับ Desktop, Tablet และ Mobile
- ตารางขนาดกว้างเลื่อนแนวนอนเฉพาะภายในกรอบตาราง
- หน้า `learn.html` ปรับขนาดและจำนวนคอลัมน์ให้เหมาะกับการบันทึกผ่านมือถือ
- หน้า `history.html` แสดงรูปนักเรียนเต็มพื้นที่เมื่อเป็นมือถือแนวตั้ง โดยไม่เปลี่ยนรูปแบบ Desktop

## External Libraries

HTML บางหน้าเรียก library ผ่าน CDN:

- Google Fonts
- Font Awesome
- Chart.js
- jsPDF
- html2canvas

หากใช้งานในระบบที่ไม่มีอินเทอร์เน็ต ควรดาวน์โหลด library เหล่านี้เก็บภายในโปรเจกต์และเปลี่ยน path เป็น local

## วิธีเปิดใช้งาน

วางโปรเจกต์ใน Web Root ของ MAMP:

```text
/Applications/MAMP/htdocs/saais-v2
```

เปิดผ่าน Browser:

```text
http://localhost:8888/saais-v2/
```

จากนั้นใช้ `index.html` เพื่อเลือกดูแต่ละหน้า Prototype

## หมายเหตุการพัฒนาต่อ

- ข้อมูลทั้งหมดเป็นข้อมูลตัวอย่าง ยังไม่มีการบันทึกหรือค้นหาจากฐานข้อมูล
- Form และลิงก์บางรายการใช้เพื่อสาธิต UI เท่านั้น
- Header/Footer ยังเป็น HTML ซ้ำในแต่ละหน้า หากพัฒนาเป็นระบบจริงควรแยกเป็น Template, Component หรือ Server-side Include
- ควรนำ External Libraries และรูปบุคลากรจาก URL ภายนอกมาเก็บภายในระบบก่อนใช้งาน Production
- เมื่อแก้ CSS/JavaScript ที่ Browser อาจ cache ควรอัปเดต query version ในไฟล์ HTML ที่เรียกใช้งาน
