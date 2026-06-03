declare module "post-me" {
  export class WindowMessenger {
    constructor(options: {
      localWindow?: Window;
      remoteWindow: Window;
      remoteOrigin: string;
    });
  }

  export function ParentHandshake(
    messenger: WindowMessenger,
    localMethods?: Record<string, (...args: any[]) => any>,
    maxAttempts?: number,
    attemptsInterval?: number
  ): Promise<{ close: () => void }>;
}
