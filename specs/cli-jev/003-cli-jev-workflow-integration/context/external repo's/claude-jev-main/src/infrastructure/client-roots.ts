import { fileURLToPath } from 'node:url';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';

/**
 * The session's working directories, as reported by the client. Cached until
 * the client says they changed, and empty when the client offers none — the
 * reader then falls back to the process directory.
 */
export class ClientRoots {
  private cached: readonly string[] | undefined;

  constructor(private readonly server: Server) {}

  invalidate(): void {
    this.cached = undefined;
  }

  async list(): Promise<readonly string[]> {
    if (this.cached !== undefined) return this.cached;
    this.cached = await this.fetch();
    return this.cached;
  }

  private async fetch(): Promise<readonly string[]> {
    let result: Awaited<ReturnType<Server['listRoots']>>;
    try {
      result = await this.server.listRoots();
    } catch {
      return [];
    }
    const paths: string[] = [];
    for (const root of result.roots) {
      try {
        paths.push(fileURLToPath(root.uri));
      } catch {
        continue;
      }
    }
    return paths;
  }
}
