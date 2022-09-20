import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '1631539-db8210cabd2636c6df59812df';

let page = 1;
let startPage = page;
let query = '';

const refSearchForm = document.querySelector('#search-form');
const refGallery = document.querySelector('.gallery');
const refLoadMore = document.querySelector('.load-more');
const refNextPage = document.querySelector('.next-page');
const refGoTop = document.querySelector('.go-top');

const refLoadedPages = document.querySelector('#loaded-pages');

refSearchForm.addEventListener('submit', onSubmit);
refLoadMore.addEventListener('click', onMoreClick);
refNextPage.addEventListener('click', onNextClick);
refGoTop.addEventListener('click', onGoTopClick);

window.addEventListener('scroll', onScroll);

function onScroll() {
  const { scrollHeight, clientHeight } = document.documentElement;
  refGoTop.hidden = scrollY < clientHeight;
  // refLoadMore.hidden = scrollY < scrollHeight - clientHeight - 400;
  if (scrollY > scrollHeight - clientHeight - 400) {
    onMoreClick();
  }

  // console.log({ scrollY, scrollTop, scrollHeight, clientHeight });
}

function onMoreClick() {
  page += 1;
  showImages();
}

function onGoTopClick() {
  page = startPage;
  window.scrollTo(scrollY, 0);
}

function onNextClick() {
  page += 1;
  refGallery.innerHTML = '';
  showImages();
}

//********************4 axios */
function onSubmit(evt) {
  evt.preventDefault();
  query = evt.currentTarget.searchQuery.value
    .trim()
    .replace(/ {2,}/g, ' ')
    .replace(/ /g, '+');
  refGallery.innerHTML = '';
  page = 1;
  showImages();
}
async function showImages() {
  const url = `${BASE_URL}?key=${API_KEY}&image_type=photo&per_page=10&page=${page}&orientation=horizontal&q=${query}`;
  const { data } = await axios(url);
  renderingGallery(data.hits);
  refLoadedPages.textContent = `loaded ${page}`;
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
