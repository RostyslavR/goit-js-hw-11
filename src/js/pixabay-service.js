import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '1631539-db8210cabd2636c6df59812df';
export default class PixabayApiService {
  constructor() {
    this.queryOptions = {};

    // this.queryString = '';

    this.pageOptions = {
      totalHits: 0,
      availableHits: 0,
      hitsPerPage: 0,
      totalPages: 0,
      currentPage: 0,
    };
  }

  resetQueryOptions() {
    this.queryOptions = {
      key: API_KEY,
      page: 1,
    };
  }

  setQueryOptions(queryData) {
    this.resetQueryOptions();
    queryData.forEach((value, key) => (this.queryOptions[key] = value));
    this.getImages();
  }

  setPageOptions(total, totalHits) {
    this.pageOptions.totalHits = total;
    this.pageOptions.availableHits = totalHits;
    this.pageOptions.hitsPerPage = this.queryOptions.per_page;
    this.pageOptions.totalPages = Math.ceil(
      this.pageOptions.availableHits / this.pageOptions.hitsPerPage
    );
    this.pageOptions.currentPage = this.queryOptions.page;
    // console.log(this.pageOptions);
  }

  getPageOptions() {
    return this.pageOptions;
  }

  setPage(page) {
    this.queryOptions.page = page;
  }

  async getImages(page = 1) {
    this.setPage(page);
    const result = await axios.get(BASE_URL, { params: this.queryOptions });
    const { total, totalHits, hits } = result.data;
    this.setPageOptions(total, totalHits);
    return hits;
  }

  setQuery(queryData) {
    console.log(queryData);
    // console.log(this.formDataToQueryStr(data));
    this.queryOptions = {};
    queryData.forEach((value, key) => (this.queryOptions[key] = value));
    console.log(this.queryOptions);
    const qD = Array.from(queryData);
    // console.log(qD);
    this.queryOptions = { ...qD };
    // console.log(this.queryOptions);
    // this.queryString = this.queryDataHandler(queryData);
  }

  async getImagesold() {
    const url = this.buildUrl(this.queryString, this.queryOptions);
    console.log(url);
    const result = await axios.get(url);
    const { total, totalHits, hits } = result.data;
    // const result = await (await fetch(url)).json();
    // const { total, totalHits, hits } = result;

    this.pageOptions.totalHits = total;
    this.pageOptions.availableHits = totalHits;
    this.pageOptions.totalPages = Math.ceil(
      this.pageOptions.availableHits / this.pageOptions.hitsPerPage
    );
    if (this.queryOptions.page > this.pageOptions.totalPages) {
      this.queryOptions.page = 1;
    }

    return hits;
  }

  getOptions() {
    return { ...this.pageOptions, ...this.queryOptions };
  }

  buildUrl(queryString, options = {}) {
    const optionsString = this.formDataToQueryStr(Object.entries(options));
    const url = `${BASE_URL}/?${queryString}&${optionsString}`;
    return url;
  }

  queryDataHandler(queryData) {
    this.pageOptions.totalPages = 0;
    this.queryOptions.page = 1;
    // this.queryOptions.page = Number(queryData.get('page'));
    this.pageOptions.hitsPerPage = Number(queryData.get('per_page'));
    queryData.append('q', queryData.get('searchQuery').replace(' ', '+'));
    queryData.delete('searchQuery');
    queryData.delete('pagination');
    queryData.delete('by_page');
    queryData.delete('page');
    return this.formDataToQueryStr(queryData);
  }

  formDataToQueryStr(data) {
    return [...data].map(el => el.join('=')).join('&');
  }

  nextPage() {
    this.queryOptions.page < this.pageOptions.totalPages
      ? (this.queryOptions.page += 1)
      : (this.queryOptions.page = 1);
  }
}
