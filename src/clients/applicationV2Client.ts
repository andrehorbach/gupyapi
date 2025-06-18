import { BaseClient } from './baseClient';

export class ApplicationV2Client extends BaseClient {
  async fetchApplicationV2(jobId: number): Promise<any[]> {
    let results: any[] = [];
    let nextPageToken: string | null = null;

    do {
      const tokenParam: string = nextPageToken
        ? `&pageToken=${encodeURIComponent(nextPageToken)}`
        : '';
        
      const url: string = `${this.BASE_URL_V2}/applications?jobId=${jobId}&fields=all&expand=steps${tokenParam}`;
      
      const data: any = await this.fetchJson<any>(url);
      results = results.concat(data.results || []);

      nextPageToken = data.nextPageToken ?? null;
    } while (nextPageToken);

    return results;
  }
}
