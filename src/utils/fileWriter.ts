import * as fsSync from 'fs';
import { truncateString } from './helpers/truncateString';

export class FileWriter {
  async save(filename: string, data: any[]): Promise<void> {
    const stream = fsSync.createWriteStream(filename, { encoding: 'utf-8' });
    stream.write('[\n');

    for (let i = 0; i < data.length; i++) {
      const line = JSON.stringify(truncateString(data[i]), null, 2);
      stream.write(line);
      if (i < data.length - 1) stream.write(',\n');
    }

    stream.write('\n]');
    stream.end();

    stream.on('finish', () => {
      console.log(`Data saved to ${filename}`);
    });

    stream.on('error', (err) => {
      console.error(`Error writing file: ${err}`);
    });
  }
}
