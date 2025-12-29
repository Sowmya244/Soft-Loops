export default function decorate(block) {
  block.classList.add('collections');

  const rows = [...block.children];

  const images = [];
  let title = '';
  let description = '';
  let cta = null;

  rows.forEach((row) => {
    const cells = row.children;
    if (cells.length < 4) return;

    const img = cells[0].querySelector('img');
    if (img) images.push(img);

    if (!title) title = cells[1].textContent.trim();
    if (!description) description = cells[2].textContent.trim();
    if (!cta) cta = cells[3].querySelector('a');
  });

  /* BUILD DOM */
  const card = document.createElement('div');
  card.className = 'collection-card';

  const carousel = document.createElement('div');
  carousel.className = 'collection-carousel';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  images.forEach((img) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.append(img);
    track.append(slide);
  });

  carousel.append(track);

  /* Dots */
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'carousel-dots';

  images.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsWrap.append(dot);
  });

  carousel.append(dotsWrap);

  /* CONTENT */
  const content = document.createElement('div');
  content.className = 'collection-content';
  content.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
  if (cta) content.append(cta);

  card.append(carousel, content);
  block.innerHTML = '';
  block.append(card);

  /* =========================
     CAROUSEL LOGIC
  ========================= */

  const slides = [...track.children];
  const dots = [...dotsWrap.children];
  let index = 0;

  function update() {
    const slideWidth = slides[0].offsetWidth + 24;
    track.style.transform = `translateX(calc(50% - ${slideWidth * index}px - ${slideWidth / 2}px))`;

    slides.forEach((s) => s.classList.remove('is-active'));
    dots.forEach((d) => d.classList.remove('active'));

    slides[index].classList.add('is-active');
    dots[index].classList.add('active');
  }

  update();

  /* AUTO PLAY */
  let timer = setInterval(() => {
    index = (index + 1) % slides.length;
    update();
  }, 4000);

  /* DOT CLICK */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
  });

  /* SWIPE */
  let startX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(timer);
  });

  track.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -50) index = (index + 1) % slides.length;
    if (diff > 50) index = (index - 1 + slides.length) % slides.length;
    update();

    timer = setInterval(() => {
      index = (index + 1) % slides.length;
      update();
    }, 3000);
  });
}
