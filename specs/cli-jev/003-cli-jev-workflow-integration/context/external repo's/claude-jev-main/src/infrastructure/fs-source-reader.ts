import { readFile, realpath, stat } from 'node:fs/promises';
import { isAbsolute, resolve, sep } from 'node:path';
import type { SourceReader, SourceRequest, SourceSnippet } from '../application/ports.js';

/**
 * Above this a file is refused outright. A line range does not lower the cost:
 * the whole file is read before any line can be selected, so the ceiling holds
 * whether or not a range was asked for.
 */
const FILE_CEILING_BYTES = 4 * 1024 * 1024;

/**
 * Secret stores and key material. These are refused with no option to allow
 * them: nothing here is source code a review needs.
 */
const FORBIDDEN: readonly RegExp[] = [
  /^\.env(\..+)?$/i,
  /^\.git$/,
  /^\.ssh$/,
  /^\.gnupg$/,
  /^\.aws$/,
  /^\.gcloud$/,
  /^\.npmrc$/i,
  /^\.netrc$/i,
  /^\.pypirc$/i,
  /^\.pgpass$/i,
  /^\.dockercfg$/i,
  /^id_(rsa|dsa|ecdsa|ed25519)(\.pub)?$/i,
  /^credentials?(\..+)?$/i,
  /^\.credentials?(\..+)?$/i,
  /(^|[.\-_])secrets?\.(json|ya?ml|toml|ini|txt|env|conf|cfg)$/i,
  /\.(pem|key|p12|pfx|jks|keystore|p8|ppk|kdbx)$/i,
];

export class SourceReadingDisabledError extends Error {
  constructor() {
    super('source reading is turned off; pass the code as text instead');
    this.name = 'SourceReadingDisabledError';
  }
}

export class ForbiddenPathError extends Error {
  constructor(path: string) {
    super(`refused to read "${path}": it matches a secret or key-material pattern`);
    this.name = 'ForbiddenPathError';
  }
}

export class OutsideRootsError extends Error {
  constructor(path: string, roots: readonly string[]) {
    super(`refused to read "${path}": it is outside the working directories (${roots.join(', ')})`);
    this.name = 'OutsideRootsError';
  }
}

export class TooManySourcesError extends Error {
  constructor(count: number, limit: number) {
    super(`${count} sources requested, the limit is ${limit}`);
    this.name = 'TooManySourcesError';
  }
}

export class FileTooLargeError extends Error {
  constructor(path: string, size: number) {
    super(
      `"${path}" is ${size} bytes, over the ${FILE_CEILING_BYTES}-byte ceiling; point at a smaller file`,
    );
    this.name = 'FileTooLargeError';
  }
}

export class NotAFileError extends Error {
  constructor(path: string) {
    super(`"${path}" is not a regular file`);
    this.name = 'NotAFileError';
  }
}

function segments(path: string): readonly string[] {
  return path.split(/[\\/]/).filter((segment) => segment.length > 0);
}

function assertAllowed(requested: string, resolved: string): void {
  for (const segment of [...segments(requested), ...segments(resolved)]) {
    if (FORBIDDEN.some((pattern) => pattern.test(segment))) throw new ForbiddenPathError(requested);
  }
}

function contains(root: string, target: string): boolean {
  return target === root || target.startsWith(root.endsWith(sep) ? root : root + sep);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface FsSourceReaderOptions {
  /** The session's working directories; nothing outside them is read. */
  readonly roots: () => Promise<readonly string[]>;
  readonly allowReading: boolean;
  readonly maxFileBytes: number;
  readonly maxFilesPerCall: number;
}

export class FsSourceReader implements SourceReader {
  constructor(private readonly options: FsSourceReaderOptions) {}

  async read(requests: readonly SourceRequest[]): Promise<readonly SourceSnippet[]> {
    if (requests.length === 0) return [];
    if (!this.options.allowReading) throw new SourceReadingDisabledError();
    if (requests.length > this.options.maxFilesPerCall) {
      throw new TooManySourcesError(requests.length, this.options.maxFilesPerCall);
    }
    const roots = await this.resolveRoots();
    return Promise.all(requests.map((request) => this.readOne(request, roots)));
  }

  private async resolveRoots(): Promise<readonly string[]> {
    const declared = await this.options.roots();
    const real: string[] = [];
    for (const root of declared) {
      try {
        real.push(await realpath(root));
      } catch {
        continue;
      }
    }
    return real.length > 0 ? real : [await realpath(process.cwd())];
  }

  private async readOne(
    request: SourceRequest,
    roots: readonly string[],
  ): Promise<SourceSnippet> {
    const resolved = await this.locate(request.path, roots);
    assertAllowed(request.path, resolved);

    const info = await stat(resolved);
    if (!info.isFile()) throw new NotAFileError(request.path);
    if (info.size > FILE_CEILING_BYTES) throw new FileTooLargeError(request.path, info.size);

    const raw = await readFile(resolved);
    if (raw.includes(0)) {
      return {
        path: request.path,
        startLine: 1,
        endLine: 1,
        content: `[binary file, ${info.size} bytes, not sent]`,
        truncated: true,
      };
    }

    const lines = raw.toString('utf8').split('\n');
    const startLine = clamp(request.start ?? 1, 1, lines.length);
    const endLine = clamp(request.end ?? lines.length, startLine, lines.length);
    const selected = lines.slice(startLine - 1, endLine).join('\n');
    const budget = Math.min(request.maxBytes ?? this.options.maxFileBytes, this.options.maxFileBytes);
    const bytes = Buffer.from(selected, 'utf8');
    if (bytes.byteLength <= budget) {
      return { path: request.path, startLine, endLine, content: selected, truncated: false };
    }
    const content = new TextDecoder('utf-8').decode(bytes.subarray(0, budget));
    return {
      path: request.path,
      startLine,
      endLine: startLine + content.split('\n').length - 1,
      content,
      truncated: true,
    };
  }

  private async locate(path: string, roots: readonly string[]): Promise<string> {
    assertAllowed(path, path);
    const candidates = isAbsolute(path) ? [path] : roots.map((root) => resolve(root, path));
    for (const candidate of candidates) {
      let real: string;
      try {
        real = await realpath(candidate);
      } catch {
        continue;
      }
      if (roots.some((root) => contains(root, real))) return real;
    }
    throw new OutsideRootsError(path, roots);
  }
}
