import { JobClient } from '../clients/jobClient';
import { ApplicationClient } from '../clients/applicationClient';
import { ApplicationV2Client } from '../clients/applicationV2Client';
import { CommentClient } from '../clients/commentClient';
import { Logger } from '../utils/logger';
import { ProgressTracker } from '../utils/progressTracker';
import Bottleneck from 'bottleneck';

export class GupyAppService {
  constructor(
    private jobClient = new JobClient(),
    private applicationClient = new ApplicationClient(),
    private applicationV2Client = new ApplicationV2Client(),
    private commentClient = new CommentClient(),
    private logger = new Logger()
  ) {}
  
  async fetchAppData(gupyJobs: number[]): Promise<any[]> {
    const limiter = new Bottleneck({
      minTime: 1,
      maxConcurrent: 10,  
    });
    const jobs = gupyJobs.length ? 
      gupyJobs 
      : (await this.jobClient.fetchJobs()).map(job => job.id);
      console.log(gupyJobs)
    // Test Jobs Data:
    // const jobs = [{ id: 4448137 },{ id: 3197203 },{ id: 5631808 }];
    const progressTracker = new ProgressTracker(jobs.length);

    const fullData: any[] = [];
    progressTracker.start();

    for (const job of jobs) {
      try {
        // console.log(`Starting job ${job}...`);
        
        const applications = await this.applicationClient.fetchApplications(job);
        progressTracker.incrementRequests(applications.length);

     const applicationsWithComments = await Promise.all(
        applications.map((app) =>
          limiter.schedule(async () => {
            try {
              // console.log(`Fetching comments for Job ${job.id} Application ${app.id}...`);
              
              const comments = await this.commentClient.fetchComments(job, app.id);
              return { ...app, comments };
            } catch (e) {
              this.logger.error(`Failed to fetch comments for app ${app.id}`, e);
              return { ...app, comments: [] };
            }
          })
        )
      );

      const applicationsV2 = await limiter.schedule(() =>
        this.applicationV2Client.fetchApplicationV2(job.id)
      );
      const applicationsV2Map = new Map(applicationsV2.map((a: any) => [a.id, a.expand.steps]));

      const applicationsWithSteps = applicationsWithComments.map((a: any) => {
        const steps = applicationsV2Map.get(a.id);
        return { ...a, steps: steps || [] };
      });

      fullData.push(...applicationsWithSteps );

    } catch (e) {
      this.logger.error(`Failed to process job ${job.id}`, e);
    }

      progressTracker.incrementJob();
    }

    progressTracker.stop();
    return fullData;
  }

}