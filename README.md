# SAAIS V2

Static HTML prototype สำหรับระบบสารสนเทศงานกิจการนักเรียน/ระบบโรงเรียน ใช้เป็นต้นแบบหน้าจอสำหรับ login, เมนูหลัก, หน้า content module, รายงาน, ตารางข้อมูล, ตารางเรียนตารางสอน และฟอร์มที่เกี่ยวข้อง

โปรเจกต์นี้ยังไม่มี build tool หรือ backend ในตัว สามารถเปิดผ่าน MAMP/Apache หรือเปิดไฟล์ HTML โดยตรงเพื่อดู layout และ interaction เบื้องต้นได้

## หน้าหลักในโปรเจกต์

- `index.html` หน้า entry สำหรับรวมลิงก์ไปยังตัวอย่างหน้าต่าง ๆ
- `login.html` หน้าเข้าสู่ระบบ ใช้ theme ก่อน login
- `forgot-password.html` หน้าลืมรหัสผ่าน ใช้ theme ก่อน login
- `change-password.html` หน้าเปลี่ยนรหัสผ่านหลัง login
- `main.html` หน้าเมนูหลักหลัง login
- `content.html` หน้า content module หลัก รวมตัวอย่างฟอร์ม ตาราง รายงาน chart date picker และตารางเรียนตารางสอน

## โครงสร้างไฟล์

```text
.
├── css/
│   ├── header-before-login.css
│   ├── header-after-login.css
│   ├── index.css
│   ├── login.css
│   ├── forgot-password.css
│   ├── change-password.css
│   └── content.css
├── images/
│   ├── school_logo.gif
│   └── module-*.png
├── scripts/
│   ├── calendar.js
│   ├── change-password.js
│   └── content.js
├── *.html
└── README.md
```

## แนวทางจัด CSS

- Theme ก่อน login ใช้ `header-before-login.css` ร่วมกับ `login.css` หรือ `forgot-password.css`
- Theme หลัง login ใช้ `header-after-login.css` ร่วมกับ `content.css`
- `change-password.html` ใช้โครงสร้างหลัง login และเสริม style เฉพาะหน้าด้วย `change-password.css`
- `index.css` ใช้เฉพาะหน้า `index.html`

## JavaScript

- `scripts/content.js` จัดการ dropdown, Buddhist date label, PDF export และ chart
- `scripts/calendar.js` จัดการ date picker สำหรับ textbox date และตรวจรูปแบบวันที่
- `scripts/change-password.js` จัดการ show/hide password และ label ตรวจ password/confirm password

## External libraries

โปรเจกต์อ้างอิง CDN บางส่วนจาก HTML โดยตรง:

- Google Fonts
- Font Awesome
- Chart.js
- jsPDF
- html2canvas

หากใช้งานในสภาพแวดล้อมที่ไม่มี internet ควรดาวน์โหลด library เหล่านี้มาเก็บในโปรเจกต์และปรับ path ให้เป็น local

## วิธีเปิดดู

วางโฟลเดอร์ไว้ใน web root ของ MAMP เช่น:

```text
/Applications/MAMP/htdocs/saais-v2
```

จากนั้นเปิดผ่าน browser:

```text
http://localhost/saais-v2/
```

หรือเปิดไฟล์ `index.html` โดยตรงเพื่อเลือกดูแต่ละหน้าตัวอย่าง

## Cleanup ล่าสุด

- ลบ `scripts/script.js` เพราะไม่ถูกเรียกใช้ และ logic dropdown ถูกย้ายไปดูแลใน `scripts/content.js` แล้ว
- ลบ `prompt.text` เพราะเป็นบันทึก prompt เก่า ไม่ใช่ไฟล์ runtime ของโปรเจกต์
- เพิ่ม `.gitignore` เพื่อกัน `.DS_Store`
- ลบ `.DS_Store` ใน root และ `images/`

## หมายเหตุเรื่อง asset

รูปใน `images/` ส่วนใหญ่เป็นไอคอน module ที่ใช้ใน `main.html` และ `content.html` บางไฟล์ยังเป็น asset สำรองที่ยังไม่ถูกเรียกใช้ใน HTML ปัจจุบัน เช่น `module-blackboard.png`, `module-lawyer.png`, `module-yyyy.png`, `no-profile-image.png` จึงยังเก็บไว้ก่อนเผื่อใช้ต่อใน module อื่น
