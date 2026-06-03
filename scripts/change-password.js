document.querySelectorAll('.password-toggle').forEach((button) => {
    button.addEventListener('click', () => {
        const input = document.getElementById(button.dataset.target);
        const icon = button.querySelector('i');
        const isPassword = input.type === 'password';

        input.type = isPassword ? 'text' : 'password';
        button.classList.toggle('is-visible', isPassword);
        button.setAttribute('aria-label', isPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน');
        icon.classList.toggle('fa-eye', !isPassword);
        icon.classList.toggle('fa-eye-slash', isPassword);
    });
});

const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const matchStatus = document.getElementById('passwordMatchStatus');

function updatePasswordMatchStatus() {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    matchStatus.classList.remove('is-match', 'is-mismatch');

    if (!confirmPassword) {
        matchStatus.textContent = '';
        return;
    }

    if (!password) {
        matchStatus.textContent = 'กรุณากรอกรหัสผ่านใหม่ก่อน';
        matchStatus.classList.add('is-mismatch');
        return;
    }

    if (password === confirmPassword) {
        matchStatus.textContent = 'รหัสผ่านและยืนยันรหัสผ่านตรงกัน';
        matchStatus.classList.add('is-match');
        return;
    }

    matchStatus.textContent = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
    matchStatus.classList.add('is-mismatch');
}

passwordInput.addEventListener('input', updatePasswordMatchStatus);
confirmPasswordInput.addEventListener('input', updatePasswordMatchStatus);

document.getElementById('changePasswordForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (!password || !confirmPassword) {
        errorDiv.textContent = 'กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน';
        errorDiv.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = 'รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร';
        errorDiv.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
        errorDiv.style.display = 'block';
        return;
    }

    successDiv.textContent = 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว';
    successDiv.style.display = 'block';
});
