import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const sLbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export default class GalleryRender {
  constructor(refGallery) {
    this.gallery = refGallery;
  }

  reset() {
    this.gallery.innerHTML = '';
  }

  renderingGallery(images) {
    const galleryMarkUp = images.map(this.galleryItem).join('');
    this.gallery.insertAdjacentHTML('beforeend', galleryMarkUp);
    sLbox.refresh();
  }

  galleryItem(item) {
    const {
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = item;

    return `<div class="photo-card" >
           <a class="gallery__item"
             href="${largeImageURL}">
             <img
               src="${webformatURL}" 
               alt="${tags}"
               loading="lazy" />
           </a>
           <div class="info">
             <p class="info-item">Likes
               <p>${likes}</p>
             </p>
             <p class="info-item">Views
               <p>${views}</p>
             </p>
             <p class="info-item">Comments
               <p>${comments}</p>
             </p>
             <p class="info-item">Downloads
               <p>${downloads}</p>
             </p>
           </div>
          </div>`;
  }
}
