// จัดการ dropdown menu
document.addEventListener('DOMContentLoaded', function () {
  const toggles = document.querySelectorAll('.dropdown-toggle');
  toggles.forEach(toggle => {
    const menu = toggle.nextElementSibling;
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-menu.show')
        .forEach(m => m.classList.remove('show'));
      menu.classList.toggle('show');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown-menu.show')
      .forEach(m => m.classList.remove('show'));
  });
});
ß