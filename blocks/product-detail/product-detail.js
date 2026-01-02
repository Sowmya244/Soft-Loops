/* HELPERS */
function createSection(title, text) {
  return `<div class="product-section"><h3>${title}</h3><p>${text}</p></div>`;
}

function cleanText(html = '') {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent.replace(/\s+/g, ' ').trim();
}

function extractTime(text = '') {
  const match = text.match(/\d+\s*–\s*\d+\s*hours/i);
  return match ? match[0] : '';
}

function dedupe(arr = []) {
  return [...new Set(arr.filter(Boolean))];
}

export default function decorate(block) {
  block.classList.add('product-detail');

  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  /* HERO */
  const heroRow = rows[0];
  const heroImg = heroRow.querySelector('img');

  const heroText = heroRow.textContent.replace(/\s+/g, ' ').trim();
  const priceMatch = heroText.match(/₹\s?([\d,]+)/);
  const price = priceMatch ? priceMatch[1] : '';
  const title = heroText.replace(/₹\s?[\d,]+/, '').trim();

  /* GALLERY */
  const galleryImages = rows[1]
    ? [...rows[1].querySelectorAll('img')]
    : [];

  /* DATA */
  const data = {};

  rows.slice(2).forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length < 2) return;

    const key = cells[0].textContent.toLowerCase().trim();
    if (key.includes('add to cart') || key.includes('customize')) return;

    const value = cells
      .slice(1)
      .map((c) => c.innerHTML.trim())
      .join(' ');

    data[key] = value;
  });

  const story = cleanText(data.story);
  const care = cleanText(data.care);
  const makerNote = cleanText(data['maker note']);
  const time = extractTime(data.time || '');

  const highlights = dedupe([
    time && `⏱️ Handmade • ${time}`,
    data['hand-crocheted straps'] && '🧵 Hand-crocheted straps',
    data['ready to ship'] && '📦 Ready to ship in 2–3 days',
    data['handmade in india'] && '🇮🇳 Handmade in India',
    '🌿 Lightweight, breathable & eco-friendly',
    '👜 Perfect for everyday use & gifting',
  ]);

  /* IMAGE AREA */
  const images = document.createElement('div');
  images.className = 'product-images';

  const thumbs = document.createElement('div');
  thumbs.className = 'product-thumbnails';

  const main = document.createElement('div');
  main.className = 'product-main-image';
  main.append(heroImg);

  galleryImages.forEach((img, i) => {
    const thumb = img.cloneNode();
    if (i === 0) thumb.classList.add('active');

    thumb.onclick = () => {
      heroImg.src = thumb.src;
      thumbs.querySelectorAll('img').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    };

    thumbs.append(thumb);
  });

  images.append(thumbs, main);

  /* INFO */
  const info = document.createElement('div');
  info.className = 'product-info';

  info.innerHTML = `
    <h1>${title}</h1>
    <div class="product-subtitle">Handcrafted Crochet Tote</div>
    ${price ? `<div class="product-price">₹${price}</div>` : ''}
    <ul class="product-highlights">
      ${highlights.map((h) => `<li>${h}</li>`).join('')}
    </ul>
    <div class="product-actions">
      <button class="add-to-cart">Add to Cart</button>
      <button class="customize">Customize</button>
    </div>
  `;

  const layout = document.createElement('div');
  layout.className = 'product-layout';
  layout.append(images, info);
  block.append(layout);

  /* BELOW THE FOLD */
  const details = document.createElement('section');
  details.className = 'product-details';

  if (story) details.innerHTML += createSection('Story', story);
  if (care) details.innerHTML += createSection('Care', care);
  if (makerNote) details.innerHTML += createSection('Maker\'s Note', makerNote);

  block.append(details);

  /* MODAL */
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `<span class="close">&times;</span><img src="${heroImg.src}">`;
  document.body.append(modal);

  main.onclick = () => {
    modal.style.display = 'flex';
    modal.querySelector('img').src = heroImg.src;
  };

  modal.querySelector('.close').onclick = () => {
    modal.style.display = 'none';
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  modal.querySelector('img').onclick = (e) => {
    e.target.classList.toggle('zoomed');
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}
