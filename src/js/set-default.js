export default function () {
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach(checkbox => (checkbox.checked = true));
  document.querySelector('#search-form').per_page.value = 10;
  // refs.searchForm.by_page.checked = false;
  document.querySelector('#search-form').elements.searchQuery.value = '48';
}
