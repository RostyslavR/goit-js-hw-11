import axios from 'axios';

export default class PixabayApiService {
  BASE_URL = 'https://pixabay.com/api/';
  API_KEY = '1631539-db8210cabd2636c6df59812df';
  constructor() {}

  resetOptions() {
    this.queryOptions = {
      key: this.API_KEY,
      page: 1,
      per_page: 20,
    };

    this.pageOptions = {
      totalHits: 0,
      availableHits: 0,
      hitsPerPage: 0,
      totalPages: 0,
      currentPage: 0,
      thereAreHits: 0,
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

  setPageOptions(total, tlHits) {
    let {
      totalHits,
      availableHits,
      hitsPerPage,
      totalPages,
      currentPage,
      thereAreHits,
    } = this.pageOptions;

    let { per_page, page, ...restQueryOptions } = this.queryOptions;

    totalHits = total;
    availableHits = tlHits;
    hitsPerPage = per_page;
    totalPages = Math.ceil(availableHits / hitsPerPage);
    if (page > 0) {
      currentPage = page;
    }
    if (total === 0 || totalPages === page) {
      page = 0;
    }
    thereAreHits = page;
    if (page > 0 && totalPages > page) {
      page += 1;
    }

    this.pageOptions = {
      totalHits,
      availableHits,
      hitsPerPage,
      totalPages,
      currentPage,
      thereAreHits,
    };
    this.queryOptions = {
      per_page,
      page,
      ...restQueryOptions,
    };
  }

  getPageOptions() {
    return this.pageOptions;
  }
}
