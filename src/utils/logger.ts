export class Logger {
  static info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()} :: ${message}`);
  }

  static step(message: string): void {
    console.log(`[STEP] ${message}`);
  }

  static testStart(title: string): void {
    console.log(`[STEP] [TEST START] ${title}`);
  }

  static testEnd(title: string, passed: boolean): void {
    const status = passed ? 'PASSED' : 'FAILED';
    console.log(`[STEP] [TEST END] ${title} (${status})`);
  }

  static error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()} :: ${message}`);
  }
}
