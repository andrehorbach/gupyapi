import { JobClient } from '../clients/jobClient';
import { JobStageClient } from '../clients/jobStageClient';
import { Logger } from '../utils/logger';
import { ProgressTracker } from '../utils/progressTracker';
import Bottleneck from 'bottleneck';

export class GupyJobStageService {
  constructor(
    private jobClient = new JobClient(),
    private stageClient = new JobStageClient(),
    private logger = new Logger()
  ) {}
  
  async fetchJobStageData(): Promise<string[]> {
    const limiter = new Bottleneck({
      minTime: 1,
      maxConcurrent: 10,
    });

    const jobs = await this.jobClient.fetchJobs();
    const progressTracker = new ProgressTracker(jobs.length);

    progressTracker.start();

    const jobStagesArrays = await Promise.all(
      jobs.map((job) =>
        limiter.schedule(async () => {
          try {
            return await this.stageClient.fetchJobStages(job.id);
          } catch (e) {
            this.logger.error(`Failed to fetch stages for job ${job.id}.`, e);
            return [];
          }
        })
      )
    );

    progressTracker.stop();

    const allStages = Array.from(new Set(jobStagesArrays.flat().map(stage => stage.name))).sort();

    return allStages;
  }

}