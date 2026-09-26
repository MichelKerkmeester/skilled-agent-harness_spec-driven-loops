import type { SourceReader, SourceRequest, SourceSnippet } from '../src/application/ports.js';

/** Hands back canned content and records what was asked for. */
export class FakeReader implements SourceReader {
  readonly requests: SourceRequest[] = [];

  constructor(private readonly files: Readonly<Record<string, string>> = {}) {}

  async read(requests: readonly SourceRequest[]): Promise<readonly SourceSnippet[]> {
    this.requests.push(...requests);
    return requests.map((request) => {
      const content = this.files[request.path] ?? `// ${request.path}`;
      return {
        path: request.path,
        startLine: request.start ?? 1,
        endLine: request.end ?? content.split('\n').length,
        content,
        truncated: false,
      };
    });
  }
}
