const historyPdfLayout = {
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    pageWidth: 210,
    pageHeight: 297,
    renderScale: 2,
    imageQuality: 0.94
};

function waitForHistoryImages(target) {
    return Promise.all(Array.from(target.querySelectorAll('img')).map((image) => new Promise((resolve) => {
        if (image.complete) {
            resolve();
        } else {
            image.onload = image.onerror = resolve;
        }
    })));
}

function addHistoryPdfPageSpacers(target) {
    const usableWidth = historyPdfLayout.pageWidth - historyPdfLayout.marginLeft - historyPdfLayout.marginRight;
    const usableHeight = historyPdfLayout.pageHeight - historyPdfLayout.marginTop - historyPdfLayout.marginBottom;
    const pageHeight = target.clientWidth * (usableHeight / usableWidth);
    const blocks = Array.from(target.children);
    const spacers = [];

    blocks.forEach((block) => {
        const targetTop = target.getBoundingClientRect().top;
        const blockRect = block.getBoundingClientRect();
        const blockTop = blockRect.top - targetTop;
        const pageEnd = (Math.floor(blockTop / pageHeight) + 1) * pageHeight;
        const crossesPage = blockTop + blockRect.height > pageEnd + 1;
        const fitsOnePage = blockRect.height <= pageHeight;

        if (crossesPage && fitsOnePage) {
            const spacer = document.createElement('div');
            spacer.className = 'history-pdf-page-spacer';
            spacer.style.height = `${Math.max(0, pageEnd - blockTop + 12)}px`;
            block.before(spacer);
            spacers.push(spacer);
        }
    });

    return spacers;
}

async function exportHistoryProfilePdf(target) {
    await waitForHistoryImages(target);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const spacers = addHistoryPdfPageSpacers(target);

    try {
        const canvas = await html2canvas(target, {
            scale: historyPdfLayout.renderScale,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });
        const usableWidth = historyPdfLayout.pageWidth - historyPdfLayout.marginLeft - historyPdfLayout.marginRight;
        const usableHeight = historyPdfLayout.pageHeight - historyPdfLayout.marginTop - historyPdfLayout.marginBottom;
        const sourcePageHeight = Math.floor(canvas.width * (usableHeight / usableWidth));
        const totalPages = Math.ceil(canvas.height / sourcePageHeight);

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
            const sourceY = pageIndex * sourcePageHeight;
            const sliceHeight = Math.min(sourcePageHeight, canvas.height - sourceY);
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = sourcePageHeight;

            const context = pageCanvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            context.drawImage(
                canvas,
                0,
                sourceY,
                canvas.width,
                sliceHeight,
                0,
                0,
                canvas.width,
                sliceHeight
            );

            if (pageIndex > 0) {
                pdf.addPage();
            }

            pdf.addImage(
                pageCanvas.toDataURL('image/jpeg', historyPdfLayout.imageQuality),
                'JPEG',
                historyPdfLayout.marginLeft,
                historyPdfLayout.marginTop,
                usableWidth,
                usableHeight,
                undefined,
                'FAST'
            );
        }

        pdf.save(generateFileName('student-history-profile'));
    } finally {
        spacers.forEach((spacer) => spacer.remove());
    }
}

function initializeHistoryPdfButton() {
    const button = document.querySelector('[data-history-export]');
    if (!button) {
        return;
    }

    button.addEventListener('click', async () => {
        const target = document.getElementById(button.dataset.historyExport);
        if (!target || typeof exportPDFWithCanvas !== 'function') {
            return;
        }

        button.disabled = true;
        button.textContent = 'กำลังสร้าง PDF...';
        target.classList.add('is-exporting');

        const resetExportState = () => {
            target.classList.remove('is-exporting');
            button.disabled = false;
            button.textContent = 'พิมพ์โปรไฟล์ PDF';
        };

        if (typeof html2canvas === 'undefined' || !window.jspdf) {
            document.body.classList.add('history-print-mode');
            window.addEventListener('afterprint', () => {
                document.body.classList.remove('history-print-mode');
                resetExportState();
            }, { once: true });
            window.print();
            return;
        }

        try {
            await exportHistoryProfilePdf(target);
        } finally {
            resetExportState();
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeHistoryPdfButton);
