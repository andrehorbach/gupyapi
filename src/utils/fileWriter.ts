import * as fs from 'fs/promises';
import { truncateString } from './helpers/truncateString'

export class FileWriter {
  async save(filename: string, data: any[]): Promise<void> {
    const fileStream = await fs.open(filename, 'w');
    fileStream.write('[');
    for (let i = 0; i < data.length; i++) {
      if (i > 0) fileStream.write(',\n');
      fileStream.write(JSON.stringify(truncateString(data[i]), null, 2));
    }
    fileStream.write(']');
    await fileStream.close();
    console.log(`Data saved to ${filename}`);
  }
}