import { BaseClient } from './baseClient';

export class ApplicationClient extends BaseClient {
  async fetchApplications(jobId: number): Promise<any[]> {
    let currentPage = 1;
    let totalPages = 1;
    let results: any[] = [];

    do {
      const url = `${this.BASE_URL_V1}/jobs/${jobId}/applications?fields=all&page=${currentPage}`;
      const data = await this.fetchJson<any>(url);
      results = results.concat(data.results);
      totalPages = data.totalPages;
      currentPage++;
    } while (currentPage <= totalPages);

    return results;
  }
}