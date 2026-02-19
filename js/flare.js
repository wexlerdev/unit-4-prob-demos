/**
 * Unit 4 Probability Demos — Cartoon flare / onomatopoeia
 * showFlare(text, targetEl?, options?)
 */

(function () {
  const THROTTLE_MS = 800;
  const lastFlareByKey = {};

  window.showFlare = function (text, targetEl, options) {
    const opts = options || {};
    const size = opts.size || 'normal'; // 'small' | 'normal' | 'big' | 'subtle'
    const key = opts.key || 'default';

    // Throttle
    const now = Date.now();
    if (lastFlareByKey[key] && now - lastFlareByKey[key] < THROTTLE_MS) {
      return;
    }
    lastFlareByKey[key] = now;

    const overlay = document.createElement('div');
    overlay.className = 'flare-overlay';

    const bubble = document.createElement('div');
    bubble.className = 'flare-bubble';
    if (size !== 'normal') {
      bubble.classList.add('flare-' + size);
    }
    bubble.textContent = String(text).toUpperCase();

    let container = bubble;
    if (targetEl && targetEl.getBoundingClientRect) {
      const rect = targetEl.getBoundingClientRect();
      const wrapper = document.createElement('div');
      wrapper.style.cssText =
        'position:fixed;left:' +
        (rect.left + rect.width / 2) +
        'px;top:' +
        (rect.top + rect.height / 2) +
        'px;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;pointer-events:none;';
      wrapper.appendChild(bubble);
      overlay.appendChild(wrapper);
    } else {
      overlay.appendChild(bubble);
    }

    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
    }, 700);
  };
})();
