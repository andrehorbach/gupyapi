import { BaseClient } from './baseClient';

export class JobClient extends BaseClient {
  async fetchJobs(): Promise<any[]> {
    let currentPage = 1;
    let totalPages = 1;
    let results: any[] = [];

    do {
      const data = await this.fetchJson<any>(`${this.BASE_URL_V1}/jobs?fields=all&page=${currentPage}`);
      results = results.concat(data.results);
      totalPages = data.totalPages;
      currentPage++;
    } while (currentPage <= totalPages);

    return results;
  }
}