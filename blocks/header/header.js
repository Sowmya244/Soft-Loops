export default function decorate(block) {
  block.classList.add('sl-header');

  const rows = [...block.querySelectorAll(':scope > div')];

  let brandText = '';
  const actions = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll('div');
    if (cells.length < 2) return;

    const type = cells[0].textContent.trim().toLowerCase();
    const valueEl = cells[1];
    const valueText = valueEl.textContent.trim();

    if (type === 'brand') {
      brandText = valueText;
    }

    if (type === 'action') {
      const link = valueEl.querySelector('a');
      actions.push({
        text: valueText,
        href: link ? link.getAttribute('href') : '#',
      });
    }
  });

  const header = document.createElement('header');
  header.className = 'sl-header-bar is-hero';

  const leftActions = actions.slice(0, 2);
  const rightActions = actions.slice(2);

  header.innerHTML = `
    <div class="sl-header-inner">
      <nav class="sl-header-left">
        ${leftActions
    .map(
      (a) => `<a href="${a.href}" class="sl-header-link">${a.text}</a>`,
    )
    .join('')}
      </nav>

      <div class="sl-header-logo">
        <a href="/" aria-label="Soft Loops Home">${brandText}</a>
      </div>

      <nav class="sl-header-right">
        ${rightActions
    .map(
      (a) => `<a href="${a.href}" class="sl-header-link">${a.text}</a>`,
    )
    .join('')}
      </nav>
    </div>
  `;

  block.innerHTML = '';
  document.body.prepend(header);

  /* Scroll behavior */
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 60) {
        header.classList.add('is-scrolled');
        header.classList.remove('is-hero');
      } else {
        header.classList.add('is-hero');
        header.classList.remove('is-scrolled');
      }
    },
    { passive: true },
  );
}
