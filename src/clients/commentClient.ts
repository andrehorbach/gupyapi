import { BaseClient } from './baseClient';

export class CommentClient extends BaseClient {
  async fetchComments(jobId: number, applicationId: number): Promise<any[]> {
    const url = `${this.BASE_URL_V1}/jobs/${jobId}/applications/${applicationId}/comments`;
    const data = await this.fetchJson<any>(url);
    return data.results || [];
  }
}