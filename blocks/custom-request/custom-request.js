export default function decorate(block) {
  block.classList.add('custom-request');
  block.id = 'custom-request'; // 👈 ADD THIS

  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'custom-request-form';

  let currentGroup = null;

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 2) return;

    const type = cells[0].textContent.trim().toLowerCase();
    const value = cells[1].textContent.trim();

    /* INTRO */
    if (type === 'intro title') {
      const h2 = document.createElement('h2');
      h2.textContent = value;
      form.append(h2);
      return;
    }

    if (type === 'intro text') {
      const p = document.createElement('p');
      p.className = 'intro-text';
      p.textContent = value;
      form.append(p);
      return;
    }

    /* PROMPT */
    if (type === 'prompt') {
      currentGroup = document.createElement('div');
      currentGroup.className = 'form-group';

      const label = document.createElement('h3');
      label.textContent = value;
      currentGroup.append(label);

      form.append(currentGroup);
      return;
    }

    /* OPTIONS */
    if (type === 'options' && currentGroup) {
      const optionsWrap = document.createElement('div');
      optionsWrap.className = 'options';

      value.split('|').forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = opt.trim();
        btn.dataset.value = opt.trim().toLowerCase();

        btn.addEventListener('click', () => {
          optionsWrap
            .querySelectorAll('button')
            .forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const other = currentGroup.querySelector('.other-input');
          if (other) {
            if (btn.dataset.value === 'other') {
              other.classList.add('show');
              other.focus();
            } else {
              other.classList.remove('show');
            }
          }
        });

        optionsWrap.append(btn);
      });

      currentGroup.append(optionsWrap);
      return;
    }

    /* OTHER INPUT */
    if (type === 'other input' && currentGroup) {
      const textarea = document.createElement('textarea');
      textarea.placeholder = value;
      textarea.className = 'other-input';
      currentGroup.append(textarea);
      return;
    }

    /* MAIN TEXTAREA */
    if (type === 'textarea') {
      const textarea = document.createElement('textarea');
      textarea.className = 'main-textarea';
      textarea.placeholder = value;
      form.append(textarea);
      return;
    }

    /* UPLOAD */
    if (type === 'upload') {
      const upload = document.createElement('input');
      upload.type = 'file';
      upload.className = 'upload-input';
      form.append(upload);
      return;
    }

    /* CONTACT */
    if (type === 'contact') {
      const fields = value.split('|');
      const contactWrap = document.createElement('div');
      contactWrap.className = 'contact-fields';

      fields.forEach((f) => {
        const input = document.createElement('input');
        input.placeholder = f.trim();
        contactWrap.append(input);
      });

      form.append(contactWrap);
      return;
    }

    /* SUBMIT */
    if (type === 'submit') {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.className = 'submit-btn';
      btn.textContent = value;

      const note = document.createElement('small');
      note.textContent = 'We usually reply within 24–48 hours';

      form.append(btn, note);
    }
  });

  block.append(form);

  /* =========================
     SUCCESS MODAL
  ========================= */

  const modal = document.createElement('div');
  modal.className = 'custom-success-modal';
  modal.innerHTML = `
    <div class="custom-success-box">
      <h3>🧶 Your Crochet Story Is Sent</h3>
      <p>
        Thank you for sharing your idea.<br>
        We’ll get back to you within <strong>24–48 hours</strong>.
      </p>
      <button type="button">Close</button>
    </div>
  `;

  document.body.append(modal);

  /* SUBMIT HANDLER */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.classList.add('show');
  });

  /* CLOSE MODAL */
  modal.querySelector('button').addEventListener('click', () => {
    modal.classList.remove('show');

    // Reset form fields
    form.reset();

    // Reset active buttons
    form
      .querySelectorAll('.options button')
      .forEach((btn) => btn.classList.remove('active'));

    // Hide all "Other" inputs
    form
      .querySelectorAll('.other-input')
      .forEach((input) => input.classList.remove('show'));
  });
}
