import { BaseClient } from './baseClient';
import { Logger } from '../utils/logger';
import { ProgressTracker } from '../utils/progressTracker';
import Bottleneck from 'bottleneck';

export class JobClient extends BaseClient {
  private limiter: Bottleneck;

  constructor() {
    super();
    this.limiter = new Bottleneck({
      minTime: 300, // 1 request every 300ms (~3.3 req/s)
      maxConcurrent: 1,
    });
  }

  async fetchJobs(): Promise<any[]> {
    let currentPage = 1;
    let totalPages = 1;
    let results: any[] = [];

    do {
      const page = currentPage;
      console.log(`Fetching Jobs Page ${page}...`)
      const data = await this.limiter.schedule(() =>
        this.fetchJson<any>(`${this.BASE_URL_V1}/jobs?fields=all&page=${page}`)
      );
      results = results.concat(data.results);
      totalPages = data.totalPages;
      currentPage++;
    } while (currentPage <= totalPages);

    return results;
  }
}