import debounce from 'lodash.debounce';
import axios from 'axios';
import refs from './js/refs';
import PixabayApiService from './js/pixabay-service';
import GalleryRender from './js/gallery-render';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '1631539-db8210cabd2636c6df59812df';
const DEBOUNCE_DELAY = 20;

const pixabay = new PixabayApiService();
const gallery = new GalleryRender(refs.gallery);

let page = 0;
let totalPage = 0;

refs.searchForm.addEventListener('submit', onSubmit);
refs.goTopBtn.addEventListener('click', onGoTopClick);
refs.addPageBtn.addEventListener('click', addPage);

window.addEventListener('scroll', debounce(onScroll, DEBOUNCE_DELAY));

function onScroll() {
  const { scrollHeight, clientHeight } = document.documentElement;
  refs.goTopBtn.hidden = scrollY < clientHeight;
  // refs.addPageBtn.hidden = scrollY < scrollHeight - clientHeight - 400;

  if (scrollY > scrollHeight - clientHeight * 2) {
    addPage();
  }
}

async function addPage() {
  images = await pixabay.getImages();
  gallery.renderingGallery(images);
  setInfo();
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
  images = await pixabay.getImages();
  setInfo();
  gallery.reset();
  gallery.renderingGallery(images);
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
