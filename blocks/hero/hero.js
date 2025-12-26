export default function decorate(block) {
  block.classList.add('sl-hero');

  const pictures = [...block.querySelectorAll('picture')];
  const rows = [...block.querySelectorAll(':scope > div')];

  let brand = 'Soft Loops';
  const slides = [];

  let currentSlide = null;

  rows.forEach((row) => {
    const cells = row.querySelectorAll('div');
    if (cells.length < 2) return;

    const type = cells[0].textContent.trim().toLowerCase();
    const valueEl = cells[1];

    if (type === 'brand') {
      brand = valueEl.textContent.trim();
    }

    if (type === 'slide') {
      currentSlide = {};
      slides.push(currentSlide);
    }

    if (type === 'subheading' && currentSlide) {
      currentSlide.subheading = valueEl.textContent.trim();
    }

    if (type === 'cta' && currentSlide) {
      currentSlide.cta = valueEl.querySelector('a');
    }
  });

  /* Background slides */
  const bgWrap = document.createElement('div');
  bgWrap.className = 'sl-hero-bg';

  pictures.forEach((pic, i) => {
    const bg = document.createElement('div');
    bg.className = 'sl-hero-slide-bg';
    if (i === 0) bg.classList.add('is-active');
    bg.append(pic);
    bgWrap.append(bg);
  });

  /* Brand overlay */
  const brandWrap = document.createElement('div');
  brandWrap.className = 'sl-hero-brand';
  brandWrap.innerHTML = `<h1>${brand}</h1>`;

  /* Slide content */
  const slidesWrap = document.createElement('div');
  slidesWrap.className = 'sl-hero-slides';

  slides.forEach((slide, i) => {
    const slideEl = document.createElement('div');
    slideEl.className = 'sl-hero-slide';
    if (i === 0) slideEl.classList.add('is-active');

    slideEl.innerHTML = `<p>${slide.subheading || ''}</p>`;
    if (slide.cta) slideEl.append(slide.cta);

    slidesWrap.append(slideEl);
  });

  block.innerHTML = '';
  block.append(bgWrap, brandWrap, slidesWrap);

  /* Carousel logic */
  let index = 0;
  setInterval(() => {
    const bgSlides = bgWrap.querySelectorAll('.sl-hero-slide-bg');
    const textSlides = slidesWrap.querySelectorAll('.sl-hero-slide');

    bgSlides.forEach((s) => s.classList.remove('is-active'));
    textSlides.forEach((s) => s.classList.remove('is-active'));

    index = (index + 1) % bgSlides.length;

    bgSlides[index].classList.add('is-active');
    textSlides[index].classList.add('is-active');
  }, 5500);
}
