import * as fs from 'fs/promises';
import { JobClient } from './clients/jobClient';
import { ApplicationClient } from './clients/applicationClient';
import { ApplicationV2Client } from './clients/applicationV2Client';
import { CommentClient } from './clients/commentClient';
import { Logger } from './utils/logger';
import { GupyInquirer } from './services/gupyInquirer';
import { GupyAppService } from './services/gupyAppService';
import { FileWriter } from './utils/fileWriter';

// Instantiate Logger
const logger = new Logger();

// Instantiate Gupy API clients
const jobsClient = new JobClient();
const applicationsClient = new ApplicationClient();
const applicationsV2Client = new ApplicationV2Client();
const commentsClient = new CommentClient();
const gupyInquirer = new GupyInquirer();
const fileWriter = new FileWriter();
// Instantiate Gupy Service with its clients
const gupyService = new GupyAppService(jobsClient, applicationsClient, applicationsV2Client, commentsClient, logger);

async function main() {

  const dataType = await gupyInquirer.typeInquirer();
  console.log("Selected Data Type: " + dataType);

  try {
    const data = await gupyService.fetchAllData();

    await fileWriter.save('gupy_output_data.json', data);
    console.log('Data successfully saved to gupy_output_data.json');
  } catch (error) {
    logger.error('Main process failed', error);
    process.exit(1);
  }
}

main();
