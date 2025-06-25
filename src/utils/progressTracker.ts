import * as readline from 'readline';

export class ProgressTracker {
  private ellipsisChars = ['|', '/', '-', '\\'];
  private ellipsisIndex = 0;
  private animationInterval: NodeJS.Timeout | null = null;
  private startTime = 0;
  private totalJobs = 0;
  private completedJobs = 0;
  private totalRequests = 0;

  constructor(private jobCount: number) {
    this.totalJobs = jobCount;
  }

  start() {
    this.startTime = Date.now();
    this.animationInterval = setInterval(() => this.render(), 500);
  }

  stop() {
    if (this.animationInterval) clearInterval(this.animationInterval);
    this.render();
    console.log('\n');
  }

  incrementJob() {
    this.completedJobs++;
  }

  incrementRequests(n: number = 1) {
    this.totalRequests += n;
  }

  private render() {
    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const reqPerSec = elapsedSeconds > 0 ? (this.totalRequests / elapsedSeconds).toFixed(1) : '0.0';
    const ellipsis = this.ellipsisChars[this.ellipsisIndex];
    this.ellipsisIndex = (this.ellipsisIndex + 1) % this.ellipsisChars.length;

    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(
      `${ellipsis} Progress: ${this.completedJobs}/${this.totalJobs} jobs | ${this.totalRequests} applications | ${elapsedSeconds}s | ${reqPerSec} req/s`
    );
  }
}
