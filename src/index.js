// import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import refs from './js/refs';
import setDefault from './js/set-default';
import PixabayApiService from './js/pixabay-service';
import GalleryRender from './js/gallery-render';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';

// const DEBOUNCE_DELAY = 25;
const THROTTLE_DELAY = 700;

setDefault();

const pixabay = new PixabayApiService();
const gallery = new GalleryRender(refs.gallery);

refs.searchForm.addEventListener('submit', onSubmit);
refs.goTopBtn.addEventListener('click', onGoTopClick);

async function onSubmit(evt) {
  evt.preventDefault();
  gallery.reset();
  const formData = new FormData(evt.currentTarget);
  formData.append('q', strSearchStr(formData.get('searchQuery')));
  formData.delete('searchQuery');
  pixabay.setQueryOptions(formData);
  try {
    const images = await pixabay.getImages();
    if (images.length) {
      const { totalHits, thereIsHits } = setInfo();
      Notify.success(`Hooray! We found ${totalHits} images.`);
      gallery.renderingGallery(images);
      if (thereIsHits) {
        window.addEventListener('scroll', onScrollD);
      } else {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch {
    console.log(error);
    Notify.failure('Error!');
  }
}

async function addPage() {
  try {
    const images = await pixabay.getImages();
    const { thereIsHits } = setInfo();
    gallery.renderingGallery(images);
    if (!thereIsHits) {
      window.removeEventListener('scroll', onScrollD);
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch {
    console.log(error);
    Notify.failure('Error!');
  }
}

const onScrollD = throttle(onScroll, THROTTLE_DELAY);
function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  refs.goTopBtn.hidden = scrollY < clientHeight;
  if (scrollTop + clientHeight * 2 > scrollHeight) {
    addPage();
  }
}

function onGoTopClick() {
  window.scrollTo(scrollY, 0);
}

function strSearchStr(str) {
  return str.trim().replace(/ {2,}/g, ' ').replace(/ /g, '+');
}

function setInfo() {
  const { totalHits, availableHits, totalPages, currentPage, thereIsHits } =
    pixabay.getPageOptions();
  refs.infoBlock.innerHTML = `
      <div>${totalHits} images found</div>
      <div>${availableHits} images available</div>
      <div>${totalPages} pages</div>
      <div>loaded ${currentPage} pages</div>
  `;
  return { totalHits, thereIsHits };
}
