const calendarState = {
    activeInput: null,
    currentDate: new Date()
};

const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const fullDayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

function parseInputDate(value) {
    return getValidDate(value) || new Date();
}

function getValidDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
        Number.isNaN(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatBuddhistDate(date) {
    const year = date.getFullYear() + 543;
    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    return `${fullDayNames[date.getDay()]} ${day} ${month} ${year}`;
}

function updateBuddhistDateLabel(input) {
    const labelId = input.dataset.buddhistLabel;
    if (!labelId) {
        return;
    }

    const label = document.getElementById(labelId);
    if (!label) {
        return;
    }

    label.classList.remove('is-valid', 'is-invalid');

    if (!input.value.trim()) {
        label.textContent = '';
        return;
    }

    const validDate = getValidDate(input.value.trim());
    if (!validDate) {
        label.textContent = 'รูปแบบวันที่ไม่ถูกต้อง';
        label.classList.add('is-invalid');
        return;
    }

    label.textContent = formatBuddhistDate(validDate);
    label.classList.add('is-valid');
}

function getCalendarElement() {
    let calendar = document.getElementById('calendarPopup');
    if (calendar) {
        return calendar;
    }

    calendar = document.createElement('div');
    calendar.id = 'calendarPopup';
    calendar.className = 'calendar-popup';
    calendar.setAttribute('role', 'dialog');
    calendar.setAttribute('aria-label', 'เลือกวันที่');
    document.body.appendChild(calendar);

    return calendar;
}

function positionCalendar(input, calendar) {
    const rect = input.getBoundingClientRect();
    const calendarWidth = 300;
    const viewportPadding = 12;
    const left = Math.min(
        rect.left + window.scrollX,
        window.scrollX + window.innerWidth - calendarWidth - viewportPadding
    );

    calendar.style.top = `${rect.bottom + window.scrollY + 8}px`;
    calendar.style.left = `${Math.max(viewportPadding, left)}px`;
}

function renderCalendar() {
    const calendar = getCalendarElement();
    const input = calendarState.activeInput;
    const selectedDate = parseInputDate(input?.value);
    const viewDate = calendarState.currentDate;
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const todayValue = formatDate(new Date());
    const selectedValue = formatDate(selectedDate);
    const cells = [];

    for (let i = 0; i < firstDay.getDay(); i += 1) {
        cells.push('<span class="calendar-day is-empty"></span>');
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
        const date = new Date(year, month, day);
        const value = formatDate(date);
        const classes = ['calendar-day'];

        if (value === todayValue) {
            classes.push('is-today');
        }

        if (value === selectedValue) {
            classes.push('is-selected');
        }

        cells.push(`<button type="button" class="${classes.join(' ')}" data-date="${value}">${day}</button>`);
    }

    calendar.innerHTML = `
        <div class="calendar-header">
            <button type="button" class="calendar-nav" data-calendar-action="prev" aria-label="เดือนก่อนหน้า">&lsaquo;</button>
            <div class="calendar-title">${monthNames[month]} ${year + 543}</div>
            <button type="button" class="calendar-nav" data-calendar-action="next" aria-label="เดือนถัดไป">&rsaquo;</button>
        </div>
        <div class="calendar-weekdays">
            ${dayNames.map((day) => `<span>${day}</span>`).join('')}
        </div>
        <div class="calendar-grid">
            ${cells.join('')}
        </div>
    `;

    positionCalendar(input, calendar);
}

function closeCalendar() {
    const calendar = document.getElementById('calendarPopup');
    if (calendar) {
        calendar.remove();
    }
    calendarState.activeInput = null;
}

function showCalendar(inputId) {
    const input = document.getElementById(inputId);
    if (!input) {
        return;
    }

    calendarState.activeInput = input;
    calendarState.currentDate = parseInputDate(input.value);
    renderCalendar();
}

document.addEventListener('click', (event) => {
    const calendar = document.getElementById('calendarPopup');
    if (!calendar) {
        return;
    }

    if (event.target.closest('#calendarPopup')) {
        const navButton = event.target.closest('[data-calendar-action]');
        const dateButton = event.target.closest('[data-date]');

        if (navButton) {
            const direction = navButton.dataset.calendarAction === 'next' ? 1 : -1;
            calendarState.currentDate = new Date(
                calendarState.currentDate.getFullYear(),
                calendarState.currentDate.getMonth() + direction,
                1
            );
            renderCalendar();
            return;
        }

        if (dateButton && calendarState.activeInput) {
            calendarState.activeInput.value = dateButton.dataset.date;
            updateBuddhistDateLabel(calendarState.activeInput);
            calendarState.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
            closeCalendar();
        }

        return;
    }

    if (calendarState.activeInput && event.target === calendarState.activeInput) {
        return;
    }

    closeCalendar();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeCalendar();
    }
});

window.addEventListener('resize', () => {
    const calendar = document.getElementById('calendarPopup');
    if (calendar && calendarState.activeInput) {
        positionCalendar(calendarState.activeInput, calendar);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-buddhist-label]').forEach((input) => {
        updateBuddhistDateLabel(input);
        input.addEventListener('input', () => updateBuddhistDateLabel(input));
        input.addEventListener('change', () => updateBuddhistDateLabel(input));
    });
});
