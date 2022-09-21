import axios from 'axios';

export default class PixabayApiService {
  BASE_URL = 'https://pixabay.com/api/';
  API_KEY = '1631539-db8210cabd2636c6df59812df';
  constructor() {
    this.queryOptions = {};

    this.pageOptions = {
      totalHits: 0,
      availableHits: 0,
      hitsPerPage: 1,
      totalPages: 1,
      currentPage: 0,
    };
  }

  resetQueryOptions() {
    this.queryOptions = {
      key: this.API_KEY,
      page: 0,
    };
    this.pageOptions.totalPages = 1;
  }

  setQueryOptions(queryData) {
    this.resetQueryOptions();
    queryData.forEach((value, key) => (this.queryOptions[key] = value));
  }

  async getImages() {
    if (this.nextPage()) {
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
    this.pageOptions.currentPage = this.queryOptions.page;
  }

  getPageOptions() {
    return this.pageOptions;
  }

  nextPage() {
    if (this.queryOptions.page < this.pageOptions.totalPages) {
      this.queryOptions.page += 1;
      return true;
    }
    return false;
  }
}
