export class Logger {
  static info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()} :: ${message}`);
  }

  static step(message: string): void {
    console.log(`[STEP] ${message}`);
  }

  static error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()} :: ${message}`);
  }
}
