import { JobClient } from '../clients/jobClient';
import { Logger } from '../utils/logger';

export class GupyJobService {
  constructor(
    private jobClient = new JobClient(),
    private logger = new Logger()
  ) {}
  
  async fetchJobsData(): Promise<any[]> {
    try {
      const jobsData = await this.jobClient.fetchJobs();
      return jobsData;
    } catch (e) {
        this.logger.error("Failed to fetch jobs data.", e);
        return [];
    }
  }

}