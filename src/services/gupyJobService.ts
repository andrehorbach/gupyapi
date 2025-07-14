import { JobClient } from '../clients/jobClient';
import { Logger } from '../utils/logger';

export class GupyJobService {
  constructor(
    private jobClient = new JobClient(),
    private logger = new Logger()
  ) {}
  
async fetchJobData(gupyJobs: number[]): Promise<any[]> {
  try {
    const jobsData = await this.jobClient.fetchJobs();

    const filteredJobs = gupyJobs.length
      ? jobsData.filter((job) => gupyJobs.includes(job.id))
      : jobsData;

    return filteredJobs;
      } catch (e) {
        this.logger.error("Failed to fetch jobs data.", e);
        return [];
      }
    }
}