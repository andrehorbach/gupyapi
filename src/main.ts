import * as fs from 'fs/promises';
import { JobClient } from './clients/jobClient';
import { ApplicationClient } from './clients/applicationClient';
import { ApplicationV2Client } from './clients/applicationV2Client';
import { JobStageClient } from './clients/jobStageClient';
import { CommentClient } from './clients/commentClient';
import { Logger } from './utils/logger';
import { GupyInquirer } from './services/gupyInquirer';
import { GupyAppService } from './services/gupyAppService';
import { GupyJobStageService } from './services/gupyStageService';
import { FileWriter } from './utils/fileWriter';
import { GupyJobService } from './services/gupyJobService';

// Instantiate Logger
const logger = new Logger();

// Instantiate Gupy API clients
const jobsClient = new JobClient();
const applicationsClient = new ApplicationClient();
const applicationsV2Client = new ApplicationV2Client();
const stagesClient = new JobStageClient();
const commentsClient = new CommentClient();
const gupyInquirer = new GupyInquirer();
const fileWriter = new FileWriter();
// Instantiate Gupy Service with its clients
const gupyJobService = new GupyJobService(
  jobsClient, 
  logger
);
const gupyAppService = new GupyAppService(
  jobsClient, 
  applicationsClient, 
  applicationsV2Client, 
  commentsClient,
  logger
);
const gupyJobStageService = new GupyJobStageService(
  jobsClient,
  stagesClient,
  logger
);

async function main() {

  const dataType = await gupyInquirer.typeInquirer();
  console.log("Selected Data Type: " + dataType);

  const dataFetch: Record<string, () => Promise<any[]>> = {
      '1': () => gupyJobService.fetchJobData(),
      '2': () => gupyAppService.fetchAppData(),
      '3': () => gupyJobStageService.fetchJobStageData(),
  }

  const dataFetcher = dataFetch[dataType];

  if (!dataFetcher) {
    console.log(`Unsupported option: ${dataType}`);
    return;
  }

  try {

   const data = await dataFetcher();
    await fileWriter.save('gupy_output_data.json', data);
    console.log('Data successfully saved to gupy_output_data.json');
  } catch (error) {
    logger.error('Main process failed', error);
    process.exit(1);
  }
}

main();
