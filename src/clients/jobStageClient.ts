import { BaseClient } from './baseClient';
import Bottleneck from 'bottleneck';

interface JobStage {
  id: number;
  name: string;
  type: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export class JobStageClient extends BaseClient {
  private limiter: Bottleneck;

  constructor() {
    super();
    this.limiter = new Bottleneck({
      minTime: 75, // 1 request every 300ms (~3.3 req/s)
      maxConcurrent: 3,
    });
  }

  async fetchJobStages(jobId: number): Promise<JobStage[]> {
    const data = await this.limiter.schedule(() =>
      this.fetchJson<{results: JobStage[]}>(`${this.BASE_URL_V1}/jobs/${jobId}/steps`)
    );
    return data.results || [];
  }
}