import * as fs from 'fs/promises';
import { truncateString } from './helpers/truncateString';

export class FileWriter {
  async save(filename: string, data: any[]): Promise<void> {
    const jsonContent = '[\n' +
      data.map((item, index) => {
        return JSON.stringify(truncateString(item), null, 2);
      }).join(',\n') +
      '\n]';

    await fs.writeFile(filename, jsonContent, { encoding: 'utf-8' });
    console.log(`Data saved to ${filename}`);
  }
}
