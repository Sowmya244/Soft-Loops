export default function decorate(block) {
  block.classList.add('sl-hero');

  const rows = [...block.querySelectorAll(':scope > div')];

  const slides = [];
  let currentSlide = null;

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');

    // Empty row = slide separator
    if (
      cells.length === 2
      && !cells[0].textContent.trim()
      && !cells[1].textContent.trim()
    ) {
      currentSlide = null;
      return;
    }

    if (cells.length !== 2) return;

    const picture = cells[0].querySelector('picture');
    const contentCell = cells[1];

    // Start a new slide when image is found
    if (picture) {
      currentSlide = {
        picture,
        title: '',
        subheading: '',
        cta: null,
      };
      slides.push(currentSlide);

      const texts = [...contentCell.children];

      if (texts[0]) currentSlide.title = texts[0].textContent.trim();
      if (texts[1]) currentSlide.subheading = texts[1].textContent.trim();
      if (texts[2]) currentSlide.cta = texts[2].querySelector('a');
    }
  });

  /* ---------- BUILD HERO ---------- */

  /* Backgrounds */
  const bgWrap = document.createElement('div');
  bgWrap.className = 'sl-hero-bg';

  slides.forEach((slide, i) => {
    const bg = document.createElement('div');
    bg.className = 'sl-hero-slide-bg';
    if (i === 0) bg.classList.add('is-active');
    bg.append(slide.picture);
    bgWrap.append(bg);
  });

  /* Brand overlay (from first slide title) */
  const brandWrap = document.createElement('div');
  brandWrap.className = 'sl-hero-brand';
  brandWrap.innerHTML = `<h1>${slides[0]?.title || 'Soft Loops'}</h1>`;

  /* Slide text */
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

  /* ---------- CAROUSEL ---------- */

  let index = 0;
  setInterval(() => {
    const bgSlides = bgWrap.querySelectorAll('.sl-hero-slide-bg');
    const textSlides = slidesWrap.querySelectorAll('.sl-hero-slide');

    bgSlides.forEach((s) => s.classList.remove('is-active'));
    textSlides.forEach((s) => s.classList.remove('is-active'));

    index = (index + 1) % bgSlides.length;

    bgSlides[index].classList.add('is-active');
    textSlides[index].classList.add('is-active');
  }, 3000);
}
