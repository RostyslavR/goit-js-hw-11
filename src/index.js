import debounce from 'lodash.debounce';
import refs from './js/refs';
import setDefault from './js/set-default';
import PixabayApiService from './js/pixabay-service';
import GalleryRender from './js/gallery-render';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '1631539-db8210cabd2636c6df59812df';
const DEBOUNCE_DELAY = 20;

setDefault();
Notify.init({
  position: 'center-top',
});

const pixabay = new PixabayApiService();
const gallery = new GalleryRender(refs.gallery);

refs.searchForm.addEventListener('submit', onSubmit);
refs.goTopBtn.addEventListener('click', onGoTopClick);

window.addEventListener('scroll', debounce(onScroll, DEBOUNCE_DELAY));

function onScroll() {
  const { scrollHeight, clientHeight } = document.documentElement;
  refs.goTopBtn.hidden = scrollY < clientHeight * 2;

  if (scrollY > scrollHeight - clientHeight * 2) {
    addPage();
  }
}

async function addPage() {
  try {
    images = await pixabay.getImages();
    gallery.renderingGallery(images);
    setInfo();
    if (!images.length) {
      console.log(images.length);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch {
    console.log(error);
    Notify.failure('Error!');
  }
}

function onGoTopClick() {
  window.scrollTo(scrollY, 0);
}

async function onSubmit(evt) {
  evt.preventDefault();
  const formData = new FormData(evt.currentTarget);
  formData.append('q', strSearchStr(formData.get('searchQuery')));
  formData.delete('searchQuery');
  pixabay.setQueryOptions(formData);
  try {
    const images = await pixabay.getImages();
    setInfo();
    gallery.reset();
    gallery.renderingGallery(images);
    if (!images.length) {
      console.log(images.length);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch {
    console.log(error);
    Notify.failure('Error!');
  }
}

function strSearchStr(str) {
  return str.trim().replace(/ {2,}/g, ' ').replace(/ /g, '+');
}

function setInfo() {
  const { totalHits, availableHits, totalPages, currentPage } =
    pixabay.getPageOptions();
  refs.totalImages.textContent = `${totalHits} images found`;
  refs.availableImages.textContent = `${availableHits} images available`;
  refs.totalPages.textContent = `${totalPages} pages`;
  refs.loadedPages.textContent = `loaded ${currentPage} pages`;
}
