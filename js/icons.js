(function () {
  const spriteUrl = '/images/icons.svg';

  function svgUse(id) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `${spriteUrl}#${id}`);
    svg.appendChild(use);
    return svg;
  }

  document.querySelectorAll('[data-icon]').forEach((el) => {
    const id = el.getAttribute('data-icon');
    if (!id || el.querySelector('svg')) return;
    el.appendChild(svgUse(id));
  });
})();
