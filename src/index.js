import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '1631539-db8210cabd2636c6df59812df';

refSearchForm = document.querySelector('#search-form');
refGallery = document.querySelector('.gallery');

refSearchForm.addEventListener('submit', onSubmit);

//********************4 axios */
function onSubmit(evt) {
  evt.preventDefault();
  query = evt.currentTarget.searchQuery.value.trim().replace(' ', '+');
  const url = `${BASE_URL}?key=${API_KEY}&image_type=photo&per_page=40&page=1&orientation=horizontal&q=${query}`;
  showImages(url);
}
async function showImages(url) {
  const { data } = await axios(url);
  renderingGallery(data.hits);
}

//********************3 axios */
// async function onSubmit(evt) {
//   evt.preventDefault();
//   const result = await axios(url);
//   renderingGallery(result.data.hits);
// }

//********************2 */
// async function onSubmit(evt) {
//   evt.preventDefault();
//   const data = await (await fetch(url)).json();
//   renderingGallery(data.hits);
// }

//********************1 */
// function onSubmit(evt) {
//   evt.preventDefault();
//   fetch(url)
//     .then(response => response.json())
//     .then(data => renderingGallery(data.hits));
// }
//******************* */

function renderingGallery(images) {
  const galleryMarkUp = images.map(makeGalleryItem).join('');
  // refGallery.innerHTML = galleryMarkUp;
  refGallery.insertAdjacentHTML('beforeend', galleryMarkUp);
}
function makeGalleryItem(item) {
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
