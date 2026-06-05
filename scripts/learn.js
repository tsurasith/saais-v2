const ATTENDANCE_STATUSES = ['present', 'activity', 'late', 'leave', 'absent', 'skip'];

function updateAttendanceRow(input) {
    const row = input.closest('[data-attendance-row]');

    if (!row) {
        return;
    }

    ATTENDANCE_STATUSES.forEach((status) => {
        row.classList.remove(`is-${status}`);
    });

    row.dataset.status = input.value;
    row.classList.add(`is-${input.value}`);
}

function synchronizeAttendanceRows() {
    document.querySelectorAll('[data-attendance-status]').forEach((input) => {
        if (input.checked) {
            updateAttendanceRow(input);
        }
    });
}

function initializeAttendanceRows() {
    synchronizeAttendanceRows();

    document.querySelectorAll('[data-attendance-status]').forEach((input) => {
        input.addEventListener('change', (event) => {
            updateAttendanceRow(event.target);
        });
    });
}

function initializeAttendanceForm() {
    const form = document.getElementById('attendanceForm');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
    });

    form.addEventListener('reset', () => {
        setTimeout(synchronizeAttendanceRows, 0);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAttendanceRows();
    initializeAttendanceForm();
});
