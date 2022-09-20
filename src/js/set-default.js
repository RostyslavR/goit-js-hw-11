import refs from './refs';
export default function () {
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach(checkbox => (checkbox.checked = true));
  refs.searchForm.per_page.value = 4;
  // refs.searchForm.by_page.checked = false;
  // refs.searchForm.searchQuery.value = 'white roses';
}
//
