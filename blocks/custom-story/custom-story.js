export default function decorate(block) {
  block.classList.add('custom-story');

  const rows = [...block.children];
  const scenes = [];

  let currentScene = null;

  rows.forEach((row) => {
    const img = row.querySelector('img');
    const link = row.querySelector('a');
    const text = row.textContent.trim();

    // IMAGE → start new scene
    if (img) {
      currentScene = {
        img,
        text: '',
        cta: null,
      };
      scenes.push(currentScene);
      return;
    }

    if (!currentScene) return;

    // CTA
    if (link) {
      currentScene.cta = link;
      return;
    }

    // TEXT
    if (text) {
      currentScene.text = text;
    }
  });

  block.innerHTML = '';

  scenes.forEach((scene) => {
    const section = document.createElement('section');
    section.className = 'custom-story-scene';

    const imageWrap = document.createElement('div');
    imageWrap.className = 'custom-story-image';
    imageWrap.append(scene.img);

    const content = document.createElement('div');
    content.className = 'custom-story-content';

    content.innerHTML = `<p>${scene.text}</p>`;
    if (scene.cta) content.append(scene.cta);

    section.append(imageWrap, content);
    block.append(section);
  });

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.35 },
  );

  block.querySelectorAll('.custom-story-scene').forEach((scene) => {
    observer.observe(scene);
  });
}
