if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  [...document.querySelectorAll('.plants-list img')]
    .filter(img => img.naturalWidth === 0)
    .forEach(img => {
      img.setAttribute('src', '/static/img/fallback-plant.svg');
      img.removeAttribute('srcset');
    });
});
