/* eslint-env browser */
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

const removeImage = img => img.remove();

function handlePlantsListImageFallback () {
  /** @type {HTMLImageElement[]} */
  // @ts-ignore
  const images = [...document.querySelectorAll('.plants-list img')];

  images
    .filter(img => img.complete && img.naturalWidth === 0)
    .forEach(fallbackImage);

  images.filter(img => !img.complete).forEach(img => {
    img.onerror = () => fallbackImage(img);
  });
}

function handleArticleImageFallback () {
  /** @type {HTMLImageElement[]} */
  // @ts-ignore
  const images = [...document.querySelectorAll('article img')];

  images
    .filter(img => img.complete && img.naturalWidth === 0)
    .forEach(removeImage);

  images.filter(img => !img.complete).forEach(img => {
    img.onerror = () => removeImage(img);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  handlePlantsListImageFallback();
  handleArticleImageFallback();
});
