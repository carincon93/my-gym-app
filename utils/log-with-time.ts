export function logWithTime(...args: any[]) {
  const now = new Date().toLocaleTimeString();
  console.log(`[${now}]`, ...args);
}
