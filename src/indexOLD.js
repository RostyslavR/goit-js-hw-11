import refs from './js/refs';
import PixabayApiService from './js/pixabay-service';
import GalleryRender from './js/gallery-render';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import setDefault from './js/set-default';

//==================================================================================

setDefault();
Notify.init({
  position: 'center-top',
});

const pixabay = new PixabayApiService();
const gallery = new GalleryRender();
refs.searchForm.addEventListener('submit', onSubmit);

refs.currentPage.addEventListener('input', onInputCurrentPage);
refs.moreBtn.addEventListener('click', onClickMore);
refs.nextBtn.addEventListener('click', onClickNext);
refs.goTopBtn.addEventListener('click', onClickGoTop);

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  console.log({ scrollTop, scrollHeight, clientHeight });
});

function onSubmit(evt) {
  evt.preventDefault();
  const formData = new FormData(evt.currentTarget);
  formData.append('q', formData.get('searchQuery').replace(' ', '+'));
  formData.delete('searchQuery');
  // need fixing
  pixabay.setQueryOptions(formData);
  showImages();
}

function onClickMore() {
  showImages(1);
}
function onClickNext() {
  showImages();
}

function onClickGoTop() {
  // showImages(-1);
}

function onInputCurrentPage(evt) {
  pixabay.setPage(Number(evt.currentTarget.value));
  showImages();
}

async function showImages(k = 0) {
  try {
    const images = await pixabay.getImages(k);
    const currentPage = setPageOptions();

    gallery.renderingGallery(images, currentPage, k);
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

function setPageOptions() {
  const { totalHits, availableHits, hitsPerPage, totalPages, currentPage } =
    pixabay.getPageOptions();

  refs.totalImages.textContent = `${totalHits} images found`;
  refs.availableImages.textContent = `${availableHits} images available`;
  refs.totalPages.textContent = `${totalPages} pages`;
  refs.currentPage.value = currentPage;
  return currentPage;
}
