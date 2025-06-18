import { JobClient } from '../clients/jobClient';
import { ApplicationClient } from '../clients/applicationClient';
import { ApplicationV2Client } from '../clients/applicationV2Client';
import { CommentClient } from '../clients/commentClient';
import { Logger } from '../utils/logger';

export class GupyService {
  constructor(
    private jobClient = new JobClient(),
    private applicationClient = new ApplicationClient(),
    private applicationV2Client = new ApplicationV2Client(),
    private commentClient = new CommentClient(),
    private logger = new Logger()
  ) {}

  async fetchAllData(): Promise<any[]> {
    // const jobs = await this.jobClient.fetchJobs();
    const jobs = [{id: 918195}];
    const fullData: { jobId: number; applications: any[] }[] = [];

    for (const job of jobs) {
      try {
        const applications = await this.applicationClient.fetchApplications(job.id);
        const applicationsWithComments = await Promise.all(applications.map(async (app) => {
          try {
            const comments = await this.commentClient.fetchComments(job.id, app.id);
            return { ...app, comments };
          } catch (e) {
            this.logger.error(`Failed to fetch comments for app ${app.id}`, e);
            return { ...app, comments: [] };
          }
        }));
        
        const applicationsV2 = await this.applicationV2Client.fetchApplicationV2(job.id);
        
        const applicationsV2Map = new Map(applicationsV2.map((a: any) => [a.id, a.expand.steps]));
        
        const applicationsWithSteps = applicationsWithComments.map(a => {
          const steps = applicationsV2Map.get(a.id);

          return {...a, steps: steps || [] };
        })
        
        fullData.push({ jobId: job.id, applications: applicationsWithSteps });

      } catch (e) {
        this.logger.error(`Failed to process job ${job.id}`, e);
      }
    }
    return fullData;
  }
}