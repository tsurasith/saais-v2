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

function initializeAttendanceRows() {
    document.querySelectorAll('[data-attendance-status]').forEach((input) => {
        if (input.checked) {
            updateAttendanceRow(input);
        }

        input.addEventListener('change', (event) => {
            updateAttendanceRow(event.target);
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeAttendanceRows);
