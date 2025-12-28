export default function decorate(block) {
  block.classList.add('custom-story');

  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 3) return;

    const img = cells[0].querySelector('img');
    const title = cells[1].textContent.trim();
    const desc = cells[2].textContent.trim();

    if (!img || !title || !desc) return;

    const scene = document.createElement('section');
    scene.className = 'custom-story-scene';
    if (index % 2 === 1) scene.classList.add('is-reverse');

    const imageWrap = document.createElement('div');
    imageWrap.className = 'custom-story-image';
    imageWrap.append(img);

    const content = document.createElement('div');
    content.className = 'custom-story-content';
    content.innerHTML = `
      <h3>${title}</h3>
      <p>${desc}</p>
    `;

    // CTA only on last scene
    if (index === rows.length - 1) {
      const cta = document.createElement('a');
      cta.href = 'custom-request';

      cta.textContent = 'Start Your Custom Crochet Story';
      content.append(cta);
    }

    scene.append(imageWrap, content);
    block.append(scene);
  });

  /* reveal animation */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.4 },
  );

  block.querySelectorAll('.custom-story-scene').forEach((scene) => {
    observer.observe(scene);
  });
}
