//// Reusable modal logic (vanilla JS)
//(function () {
//  const modal = document.getElementById('project-modal');
//  if (!modal) return;

//  const titleEl = modal.querySelector('#modal-title');
//  const dateEl = modal.querySelector('#modal-date');
//  const descEl = modal.querySelector('#modal-desc');
//  const linksEl = modal.querySelector('#modal-links');

//  // focus trap helpers
//  const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
//  let lastFocused = null;

//  function openModal(data) {
//    lastFocused = document.activeElement;
//    titleEl.textContent = data.title || '';
//    dateEl.textContent = data.date || '';
//    //descEl.textContent = data.desc || '';
//    const rawDesc = data.desc || '';
//    // replace newline characters with <br> for display
//    descEl.innerHTML = rawDesc.replace(/\r?\n/g, '<br>');

//    // clear links and parse pipe-separated list: "Label|URL;Label2|URL2"
//    linksEl.innerHTML = '';
//    if (data.links) {
//      data.links.split(';').forEach(pair => {
//        const [label, url] = pair.split('|').map(s => (s||'').trim());
//        if (label && url) {
//          const a = document.createElement('a');
//          a.className = 'button small';
//          a.href = url;
//          a.target = '_blank';
//          a.rel = 'noopener noreferrer';
//          a.textContent = label;
//          linksEl.appendChild(a);
//        }
//      });
//    }

//    modal.hidden = false;
//    document.body.style.overflow = 'hidden'; // prevent background scroll

//    // focus first focusable element in modal
//    const focusables = modal.querySelectorAll(focusableSelectors);
//    if (focusables.length) focusables[0].focus();

//    // add key handling
//    document.addEventListener('keydown', onKeyDown);
//  }

//  function closeModal() {
//    modal.hidden = true;
//    document.body.style.overflow = '';
//    if (lastFocused) lastFocused.focus();
//    document.removeEventListener('keydown', onKeyDown);
//  }

//  function onKeyDown(e) {
//    if (e.key === 'Escape') {
//      closeModal();
//      return;
//    }
//    if (e.key === 'Tab') {
//      // keep focus inside modal
//      const focusables = Array.from(modal.querySelectorAll(focusableSelectors));
//      if (focusables.length === 0) {
//        e.preventDefault();
//        return;
//      }
//      const idx = focusables.indexOf(document.activeElement);
//      if (e.shiftKey) {
//        // shift+tab
//        if (idx === 0) {
//          e.preventDefault();
//          focusables[focusables.length - 1].focus();
//        }
//      } else {
//        // tab
//        if (idx === focusables.length - 1) {
//          e.preventDefault();
//          focusables[0].focus();
//        }
//      }
//    }
//  }

//  // openers
//  document.addEventListener('click', function (e) {
//    const btn = e.target.closest('.open-modal');
//    if (!btn) return;
//    // read data attributes
//    const data = {
//      title: btn.getAttribute('data-title') || '',
//      date: btn.getAttribute('data-date') || '',
//      desc: btn.getAttribute('data-desc') || '',
//      links: btn.getAttribute('data-links') || ''
//    };
//    e.preventDefault();
//    openModal(data);
//  });

//  // close on overlay or close-button
//  modal.addEventListener('click', function (e) {
//    if (e.target.hasAttribute('data-close')) closeModal();
//  });
//})();

//new: 20 Feb 2026 5pm
// Reusable modal logic (vanilla JS) - supports left icon + left buttons and right description/links
(function () {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const titleEl = modal.querySelector('#modal-title');
    const dateEl = modal.querySelector('#modal-date');
    const descEl = modal.querySelector('#modal-desc');
    const linksEl = modal.querySelector('#modal-links');
    const leftButtonsEl = modal.querySelector('#modal-left-buttons');
    const iconImg = modal.querySelector('#modal-icon-img');

    // focus trap helpers
    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    let lastFocused = null;

    function createButton(label, url, extraClass = 'button small') {
        const a = document.createElement('a');
        a.className = extraClass;
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = label;
        return a;
    }

    function openModal(data) {
        lastFocused = document.activeElement;

        titleEl.textContent = data.title || '';
        dateEl.textContent = data.date || '';

        // icon
        if (data.icon) {
            iconImg.src = data.icon;
            // alt: let it be title or plain "project icon"
            iconImg.alt = data.title ? `${data.title} icon` : 'project icon';
            modal.querySelector('.modal-icon').style.display = '';
        } else {
            iconImg.src = '';
            iconImg.alt = '';
            // optionally hide icon box if no icon
            // modal.querySelector('.modal-icon').style.display = 'none';
        }

        // left buttons: parse data-left-links => "Label|URL;Label2|URL2"
        leftButtonsEl.innerHTML = '';
        if (data.leftLinks) {
            data.leftLinks.split(';').forEach(pair => {
                const [label, url] = pair.split('|').map(s => (s || '').trim());
                if (label && url) leftButtonsEl.appendChild(createButton(label, url));
            });
        }

        // description: allow <br> or richer markup (we trust portfolio content)
        descEl.innerHTML = data.desc || '';

        // right links: same parsing as before
        linksEl.innerHTML = '';
        if (data.links) {
            data.links.split(';').forEach(pair => {
                const [label, url] = pair.split('|').map(s => (s || '').trim());
                if (label && url) linksEl.appendChild(createButton(label, url, 'button small'));
            });
        }

        modal.hidden = false;
        document.body.style.overflow = 'hidden'; // prevent background scroll

        // focus first focusable element in modal
        const focusables = modal.querySelectorAll(focusableSelectors);
        if (focusables.length) focusables[0].focus();

        document.addEventListener('keydown', onKeyDown);
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        if (e.key === 'Tab') {
            const focusables = Array.from(modal.querySelectorAll(focusableSelectors));
            if (focusables.length === 0) {
                e.preventDefault();
                return;
            }
            const idx = focusables.indexOf(document.activeElement);
            if (e.shiftKey) {
                if (idx === 0) {
                    e.preventDefault();
                    focusables[focusables.length - 1].focus();
                }
            } else {
                if (idx === focusables.length - 1) {
                    e.preventDefault();
                    focusables[0].focus();
                }
            }
        }
    }

    // openers: look for .open-modal and read data attributes
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.open-modal');
        if (!btn) return;

        const data = {
            title: btn.getAttribute('data-title') || '',
            date: btn.getAttribute('data-date') || '',
            desc: btn.getAttribute('data-desc') || '',
            links: btn.getAttribute('data-links') || '',
            leftLinks: btn.getAttribute('data-left-links') || '',
            icon: btn.getAttribute('data-icon') || ''
        };

        e.preventDefault();
        openModal(data);
    });

    // close on overlay or close-button
    modal.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-close')) closeModal();
    });
})();