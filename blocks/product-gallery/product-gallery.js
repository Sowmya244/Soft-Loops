export default function decorate(block) {
  block.classList.add('product-gallery');

  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'product-gallery-grid';

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 6) return;

    const img = cells[0].querySelector('img');
    const name = cells[1].textContent.trim();
    const price = cells[2].textContent.trim();
    const desc = cells[3].textContent.trim();
    const details = cells[4].textContent.trim();
    const ctaText = cells[5].textContent.trim();

    if (!img || !name) return;

    const card = document.createElement('article');
    card.className = 'product-card';

    /* Wishlist */
    const wishlist = document.createElement('div');
    wishlist.className = 'product-wishlist';
    wishlist.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7-4.6-9.5-8.5C.5 9 2.5 5 6.5 5c2.1 0 3.4 1.1 4.5 2.3C12.1 6.1 13.4 5 15.5 5c4 0 6 4 4 7.5C19 16.4 12 21 12 21z"/>
      </svg>
    `;

    wishlist.addEventListener('click', () => {
      wishlist.classList.toggle('is-active');
    });

    const imageWrap = document.createElement('div');
    imageWrap.className = 'product-image';
    imageWrap.append(img, wishlist);

    const content = document.createElement('div');
    content.className = 'product-content';
    content.innerHTML = `
      <h3>${name}</h3>
      <div class="product-price">${price}</div>
      <p class="product-desc">${desc}</p>
      <p class="product-details">${details}</p>
      <button type="button" class="product-cta">${ctaText}</button>
    `;

    card.append(imageWrap, content);
    grid.append(card);
  });

  block.append(grid);
}
