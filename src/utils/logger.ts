export class Logger {
  error(message: string, data?: any) {
    console.error(`[ERROR] ${message}`, data);
  }

  info(message: string) {
    console.log(`[INFO] ${message}`);
  }
}