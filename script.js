const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

  revealItems.forEach((item) => observer.observe(item));
}

const dialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#dialog-image');
const closeDialogButton = document.querySelector('.dialog-close');

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    dialogImage.src = button.dataset.lightbox;
    dialogImage.alt = button.dataset.alt || '';
    dialog.showModal();
  });
});

closeDialogButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const contactForm = document.querySelector('#contact-form');
const formError = document.querySelector('#form-error');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const business = String(formData.get('business') || '').trim();
  const need = String(formData.get('need') || '').trim();

  if (!name || !phone || !business) {
    formError.hidden = false;
    const requiredFields = ['name', 'phone', 'business'].map((fieldName) => contactForm.elements.namedItem(fieldName));
    const firstEmpty = requiredFields.find((field) => !field.value.trim());
    firstEmpty?.focus();
    return;
  }

  formError.hidden = true;
  const subject = encodeURIComponent(`Yêu cầu tư vấn quảng cáo Facebook từ ${name}`);
  const body = encodeURIComponent([
    `Tên: ${name}`,
    `Số điện thoại hoặc Zalo: ${phone}`,
    `Ngành kinh doanh: ${business}`,
    `Nhu cầu hiện tại: ${need || 'Chưa ghi'}`
  ].join('\n'));

  window.location.href = `mailto:phongpdt.work@gmail.com?subject=${subject}&body=${body}`;
});
