export default function () {
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach(checkbox => (checkbox.checked = true));
  document.querySelector('#search-form').per_page.value = 40;
  // refs.searchForm.by_page.checked = false;
  document.querySelector('#search-form').elements.searchQuery.value =
    'white roses';
}
