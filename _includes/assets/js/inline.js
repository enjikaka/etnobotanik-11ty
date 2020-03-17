if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}

const fallbackImage = img => {
  img.setAttribute('src', '/static/img/fallback-plant.svg');
  img.removeAttribute('srcset');
};

document.addEventListener('DOMContentLoaded', () => {
  const images = [...document.querySelectorAll('.plants-list img')];

  images
    .filter(img => img.complete && img.naturalWidth === 0)
    .forEach(fallbackImage);

  images.filter(img => !img.complete).forEach(img => {
    img.onerror => () => fallbackImage(img);
  });
});
