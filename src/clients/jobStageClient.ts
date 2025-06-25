import { BaseClient } from './baseClient';

interface JobStage {
  id: number;
  name: string;
  type: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export class JobStageClient extends BaseClient {

  async fetchJobStages(jobId: number): Promise<JobStage[]> {
    const data = await this.fetchJson<{results: JobStage[]}>(`${this.BASE_URL_V1}/jobs/${jobId}/steps`)
    return data.results || [];
  }
}