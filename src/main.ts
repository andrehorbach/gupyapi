import * as fs from 'fs/promises';
import { JobClient } from './clients/jobClient';
import { ApplicationClient } from './clients/applicationClient';
import { ApplicationV2Client } from './clients/applicationV2Client';
import { CommentClient } from './clients/commentClient';
import { Logger } from './utils/logger';
import { GupyService } from './services/gupyService';

// Instantiate Logger
const logger = new Logger();

// Instantiate Gupy API clients
const jobsClient = new JobClient();
const applicationsClient = new ApplicationClient();
const applicationsV2Client = new ApplicationV2Client();
const commentsClient = new CommentClient();

// Instantiate Gupy Service with its clients
const gupyService = new GupyService(jobsClient, applicationsClient, applicationsV2Client, commentsClient, logger);

async function main() {
  try {
    const data = await gupyService.fetchAllData();

    await fs.writeFile('gupy_output_data.json', JSON.stringify(data, null, 2), 'utf-8');

    console.log('Data successfully saved to gupy_output_data.json');
  } catch (error) {
    logger.error('Main process failed', error);
    process.exit(1);
  }
}

main();
