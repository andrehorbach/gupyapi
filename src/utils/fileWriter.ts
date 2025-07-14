import * as fsSync from 'fs';
import { truncateString } from './helpers/truncateString';

export class FileWriter {
  async save(dataType: string, data: any[]): Promise<void> {

    const fileName: Record<string, string> = {
      '1': 'gupy_jobs',
      '2': 'gupy_applications',
      '3': 'gupy_stages',
  }

    const stream = fsSync.createWriteStream(`${fileName[dataType]}.json`, { encoding: 'utf-8' });
    stream.write('[\n');

    for (let i = 0; i < data.length; i++) {
      const line = JSON.stringify(truncateString(data[i]), null, 2);
      stream.write(line);
      if (i < data.length - 1) stream.write(',\n');
    }

    stream.write('\n]');
    stream.end();

    stream.on('finish', () => {
      console.log(`Data saved to ${fileName[dataType]}.json`);
    });

    stream.on('error', (err) => {
      console.error(`Error writing file: ${err}`);
    });
  }
}
