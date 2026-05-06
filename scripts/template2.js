function showBuddhistYear(value) {
    const buddhistDate = document.getElementById('buddhistDate');
    if (!buddhistDate) {
        return;
    }

    if (!value) {
        buddhistDate.innerText = '';
        return;
    }

    const [year, month, day] = value.split('-');
    const buddhistYear = Number(year) + 543;
    buddhistDate.innerText = `(${day}/${month}/${buddhistYear})`;
}

function initializeCharts() {
    const barCanvas = document.getElementById('barChart');
    const pieCanvas = document.getElementById('pieChart');

    if (!barCanvas || !pieCanvas || typeof Chart === 'undefined') {
        return;
    }

    const barCtx = barCanvas.getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [
                'กิตติชัย', 'สุพัตรา', 'อรทัย', 'ศรัญญา', 'วรากร',
                'นพดล', 'ณัฐวุฒิ', 'อารยา', 'สมศักดิ์', 'ปิยะนุช'
            ],
            datasets: [{
                label: 'คะแนนความประพฤติ',
                data: [85, 90, 87, 93, 88, 92, 80, 89, 91, 94],
                backgroundColor: 'rgba(163,30,37,0.7)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });

    const pieCtx = pieCanvas.getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['บ้านกลาง', 'บ้านเหนือ', 'บ้านใหม่', 'บ้านใต้'],
            datasets: [{
                label: 'จำนวน',
                data: [3, 3, 2, 2],
                backgroundColor: [
                    'rgba(163,30,37,0.8)',
                    'rgba(0,123,255,0.8)',
                    'rgba(255,193,7,0.8)',
                    'rgba(40,167,69,0.8)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function initializeDropdown() {
    const toggles = document.querySelectorAll('.dropdown-toggle');
    toggles.forEach((toggle) => {
        const menu = toggle.nextElementSibling;
        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.dropdown-menu.show')
                .forEach((openMenu) => openMenu.classList.remove('show'));
            menu.classList.toggle('show');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu.show')
            .forEach((openMenu) => openMenu.classList.remove('show'));
    });
}

async function exportPDFWithCanvas(sectionId) {
    const element = document.getElementById(sectionId);
    if (!element || typeof html2canvas === 'undefined' || !window.jspdf) {
        return;
    }

    const images = element.querySelectorAll('img');
    await Promise.all(Array.from(images).map((img) => new Promise((resolve) => {
        if (img.complete) {
            resolve();
        } else {
            img.onload = img.onerror = resolve;
        }
    })));

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = {
        top: 15,
        bottom: 10,
        left: 15,
        right: 15
    };

    const usableWidth = pageWidth - margin.left - margin.right;
    const pdfImageHeight = (canvas.height * usableWidth) / canvas.width;
    const totalPages = Math.ceil((pdfImageHeight + margin.top + margin.bottom) / pageHeight);

    for (let i = 0; i < totalPages; i += 1) {
        const sourceY = (canvas.height / totalPages) * i;
        const sourceHeight = canvas.height / totalPages;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        const pageCtx = pageCanvas.getContext('2d');
        pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);

        const pageData = pageCanvas.toDataURL('image/png');
        const pageHeightAdjusted = (sourceHeight * usableWidth) / canvas.width;

        if (i > 0) {
            pdf.addPage();
        }

        pdf.addImage(pageData, 'PNG', margin.left, margin.top, usableWidth, pageHeightAdjusted);
    }

    pdf.save(generateFileName(sectionId));
}

function generateFileName(sectionId) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return `${sectionId}_${yyyy}${mm}${dd}_${hh}${min}${ss}.pdf`;
}

function initializePdfButtons() {
    document.querySelectorAll('[data-export-target]').forEach((button) => {
        button.addEventListener('click', () => {
            exportPDFWithCanvas(button.dataset.exportTarget);
        });
    });
}

function initializeBuddhistDate() {
    const input = document.getElementById('date2');
    if (!input) {
        return;
    }

    input.addEventListener('change', (event) => {
        showBuddhistYear(event.target.value);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDropdown();
    initializeBuddhistDate();
    initializePdfButtons();
    initializeCharts();
});
