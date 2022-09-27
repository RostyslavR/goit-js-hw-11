import axios from 'axios';

export default class PixabayApiService {
  BASE_URL = 'https://pixabay.com/api/';
  API_KEY = '1631539-db8210cabd2636c6df59812df';
  constructor() {
    this.queryOptions = {};
    this.pageOptions = {};
    this.resetOptions();
  }

  resetOptions() {
    this.queryOptions = {
      key: this.API_KEY,
      page: 1,
    };

    this.pageOptions = {
      totalHits: 0,
      availableHits: 0,
      hitsPerPage: 0,
      totalPages: 0,
      currentPage: 0,
      thereIsHits: 0,
    };
  }

  setQueryOptions(queryData) {
    this.resetOptions();
    queryData.forEach((value, key) => (this.queryOptions[key] = value));
  }

  async getImages() {
    if (this.queryOptions.page) {
      const result = await axios.get(this.BASE_URL, {
        params: this.queryOptions,
      });
      const { total, totalHits, hits } = result.data;
      this.setPageOptions(total, totalHits);
      return hits;
    } else {
      return [];
    }
  }

  setPageOptions(total, totalHits) {
    this.pageOptions.totalHits = total;
    this.pageOptions.availableHits = totalHits;
    this.pageOptions.hitsPerPage = this.queryOptions.per_page;
    this.pageOptions.totalPages = Math.ceil(
      this.pageOptions.availableHits / this.pageOptions.hitsPerPage
    );
    if (this.queryOptions.page > 0) {
      this.pageOptions.currentPage = this.queryOptions.page;
    }
    if (total === 0 || this.pageOptions.totalPages === this.queryOptions.page) {
      this.queryOptions.page = 0;
    }
    this.pageOptions.thereIsHits = this.queryOptions.page;
    if (
      this.queryOptions.page &&
      this.pageOptions.totalPages > this.queryOptions.page
    ) {
      this.queryOptions.page += 1;
    }
  }

  getPageOptions() {
    return this.pageOptions;
  }
}
