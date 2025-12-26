/*
 * Soft Loops – Collections Block
 */

export default function decorate(block) {
  /* ---------- helpers ---------- */

  function buildCollection(data, i) {
    const section = document.createElement('section');
    section.className = 'collection';
    if (i % 2 === 1) section.classList.add('is-reverse');

    const images = document.createElement('div');
    images.className = 'collection-images';

    data.images.forEach((img) => images.append(img));

    const content = document.createElement('div');
    content.className = 'collection-content';

    if (data.title) {
      const h3 = document.createElement('h3');
      h3.textContent = data.title;
      content.append(h3);
    }

    if (data.description) {
      const p = document.createElement('p');
      p.textContent = data.description;
      content.append(p);
    }

    if (data.cta) {
      content.append(data.cta);
    }

    section.append(images, content);
    return section;
  }

  block.classList.add('collections');

  const rows = [...block.querySelectorAll(':scope > div')];
  const wrapper = document.createElement('div');
  wrapper.className = 'collections-inner';

  let current = null;
  let index = 0;

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 2) return;

    const type = cells[0].textContent.trim().toLowerCase();
    const value = cells[1];

    /* Start new collection */
    if (type === 'section') {
      current = {
        images: [],
        title: '',
        description: '',
        cta: null,
      };
      wrapper.append(buildCollection(current, index));
      index += 1;
    }

    if (!current) return;

    if (type === 'image') {
      const img = value.querySelector('img');
      if (img) current.images.push(img);
    }

    if (type === 'title') {
      current.title = value.textContent.trim();
    }

    if (type === 'description') {
      current.description = value.textContent.trim();
    }

    if (type === 'cta') {
      current.cta = value.querySelector('a');
    }
  });

  block.innerHTML = '';
  block.append(wrapper);
}
