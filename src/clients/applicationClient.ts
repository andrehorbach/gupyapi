import { BaseClient } from './baseClient';
import Bottleneck from 'bottleneck';

export class ApplicationClient extends BaseClient {
  // private limiter: Bottleneck;

  // constructor() {
  //   super();
  //   this.limiter = new Bottleneck({
  //     reservoir: 15,
  //     reservoirRefreshAmount: 15,
  //     reservoirRefreshInterval: 1000,
  //     maxConcurrent: 1
  //   });
  // }

  async fetchApplications(jobId: number): Promise<any[]> {
    // First request to get page 1 and totalPages
    const firstUrl = `${this.BASE_URL_V1}/jobs/${jobId}/applications?fields=all&page=1`;
    // const firstData = await this.limiter.schedule(() => this.fetchJson<any>(firstUrl));
    const firstData = await this.fetchJson<any>(firstUrl);

    const results = [...firstData.results];
    const totalPages = firstData.totalPages;

    if (totalPages <= 1) return results;

    // Create an array of page numbers for the remaining pages
    const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

    // Fire remaining requests in parallel (limited by Bottleneck)
    const remainingRequests = pageNumbers.map((page) => {
      const url = `${this.BASE_URL_V1}/jobs/${jobId}/applications?fields=all&page=${page}`;
      return this.fetchJson<any>(url);
    });

    const remainingData = await Promise.all(remainingRequests);

    for (const data of remainingData) {
      results.push(...data.results);
    }

    return results;
  }

}
