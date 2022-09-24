import debounce from 'lodash.debounce';
import refs from './js/refs';
import setDefault from './js/set-default';
import PixabayApiService from './js/pixabay-service';
import GalleryRender from './js/gallery-render';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '1631539-db8210cabd2636c6df59812df';
const DEBOUNCE_DELAY = 30;

const endOfImages = false;

setDefault();

const pixabay = new PixabayApiService();
const gallery = new GalleryRender(refs.gallery);

refs.searchForm.addEventListener('submit', onSubmit);
refs.goTopBtn.addEventListener('click', onGoTopClick);

window.addEventListener('wheel', debounce(onScrollx, DEBOUNCE_DELAY));

function onScrollx(e) {
  const { scrollHeight, clientHeight } = document.documentElement;
  // window.removeEventListener('wheel', onScrollx, { once: true });
  if (scrollHeight - scrollY < clientHeight * 2 && !endOfImages) {
    addPage();
  }
  // window.addEventListener('wheel', onScrollx, { once: true });

  console.log(scrollHeight, clientHeight, scrollY, e.deltaY);
}

// function onScrollD() {
//   debounce(onScroll, DEBOUNCE_DELAY);
// }

function onScroll() {
  const { scrollHeight, clientHeight } = document.documentElement;
  refs.goTopBtn.hidden = scrollY < clientHeight;
  const lY = scrollHeight - clientHeight * 1.5;
  if (scrollY > lY && lY > 0) {
    addPage();
  }
}

async function addPage() {
  // window.removeEventListener('scroll', onScroll);
  try {
    const images = await pixabay.getImages();
    gallery.renderingGallery(images);
    const { end } = setInfo();
    endOfImages = end;
    if (endOfImages) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
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
  // window.addEventListener('scroll', onScroll);
  gallery.reset();
  onGoTopClick();
  const formData = new FormData(evt.currentTarget);
  formData.append('q', strSearchStr(formData.get('searchQuery')));
  formData.delete('searchQuery');
  pixabay.setQueryOptions(formData);
  try {
    const images = await pixabay.getImages();
    const { totalHits, end } = setInfo();
    // endOfImages = end;
    // console.log(end);
    console.log(totalHits);
    Notify.success(`Hooray! We found ${totalHits} images.`);
    gallery.renderingGallery(images);
    if (!images.length) {
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
  return { currentPage, totalHits };
}
