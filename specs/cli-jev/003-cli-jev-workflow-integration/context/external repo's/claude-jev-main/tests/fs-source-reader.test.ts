import { mkdtemp, mkdir, realpath, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  FileTooLargeError,
  ForbiddenPathError,
  FsSourceReader,
  NotAFileError,
  OutsideRootsError,
  SourceReadingDisabledError,
  TooManySourcesError,
} from '../src/infrastructure/fs-source-reader.js';

let root = '';

const LINES = ['one', 'two', 'three', 'four', 'five'].join('\n');

function reader(overrides: Partial<{ allowReading: boolean; maxFileBytes: number; maxFilesPerCall: number }> = {}) {
  return new FsSourceReader({
    roots: async () => [root],
    allowReading: overrides.allowReading ?? true,
    maxFileBytes: overrides.maxFileBytes ?? 65_536,
    maxFilesPerCall: overrides.maxFilesPerCall ?? 20,
  });
}

beforeAll(async () => {
  root = await realpath(await mkdtemp(join(tmpdir(), 'jev-reader-')));
  await mkdir(join(root, 'src'), { recursive: true });
  await mkdir(join(root, 'config'), { recursive: true });
  await writeFile(join(root, 'src', 'lines.ts'), LINES);
  await writeFile(join(root, 'src', 'secrets.service.ts'), 'export const load = () => 1;');
  await writeFile(join(root, 'config', 'secrets.json'), '{"token":"xxx"}');
  await writeFile(join(root, '.env'), 'TOKEN=xxx');
  await writeFile(join(root, 'server.pem'), 'key material');
  await writeFile(join(root, 'src', 'blob.bin'), Buffer.from([1, 2, 0, 3]));
  await writeFile(join(root, 'src', 'huge.log'), Buffer.alloc(4 * 1024 * 1024 + 1, 0x61));
});

afterAll(() => {
  root = '';
});

describe('FsSourceReader', () => {
  it('returns nothing for an empty request list', async () => {
    await expect(reader({ allowReading: false }).read([])).resolves.toEqual([]);
  });

  it('reads a whole file relative to the root', async () => {
    const [snippet] = await reader().read([{ path: 'src/lines.ts' }]);
    expect(snippet?.content).toBe(LINES);
    expect(snippet?.startLine).toBe(1);
    expect(snippet?.endLine).toBe(5);
    expect(snippet?.truncated).toBe(false);
  });

  it('reads an inclusive line range', async () => {
    const [snippet] = await reader().read([{ path: 'src/lines.ts', start: 2, end: 3 }]);
    expect(snippet?.content).toBe('two\nthree');
    expect(snippet?.startLine).toBe(2);
    expect(snippet?.endLine).toBe(3);
  });

  it('clamps a range that runs past the end of the file', async () => {
    const [snippet] = await reader().read([{ path: 'src/lines.ts', start: 4, end: 900 }]);
    expect(snippet?.content).toBe('four\nfive');
    expect(snippet?.endLine).toBe(5);
  });

  it('truncates to the byte budget and says so', async () => {
    const [snippet] = await reader({ maxFileBytes: 7 }).read([{ path: 'src/lines.ts' }]);
    expect(snippet?.truncated).toBe(true);
    expect(snippet?.content).toBe('one\ntwo');
  });

  it('caps a per-request budget at the configured maximum', async () => {
    const [snippet] = await reader({ maxFileBytes: 7 }).read([
      { path: 'src/lines.ts', maxBytes: 1000 },
    ]);
    expect(snippet?.content).toBe('one\ntwo');
  });

  it('refuses an env file', async () => {
    await expect(reader().read([{ path: '.env' }])).rejects.toThrow(ForbiddenPathError);
  });

  it('refuses key material by extension', async () => {
    await expect(reader().read([{ path: 'server.pem' }])).rejects.toThrow(ForbiddenPathError);
  });

  it('refuses a secret store but allows source code named after secrets', async () => {
    await expect(reader().read([{ path: 'config/secrets.json' }])).rejects.toThrow(ForbiddenPathError);
    const [snippet] = await reader().read([{ path: 'src/secrets.service.ts' }]);
    expect(snippet?.content).toContain('export const load');
  });

  it('refuses a path that climbs out of the roots', async () => {
    await expect(reader().read([{ path: '../../etc/hosts' }])).rejects.toThrow(OutsideRootsError);
  });

  it('refuses an absolute path outside the roots', async () => {
    await expect(reader().read([{ path: '/etc/hosts' }])).rejects.toThrow(OutsideRootsError);
  });

  it('refuses a directory', async () => {
    await expect(reader().read([{ path: 'src' }])).rejects.toThrow(NotAFileError);
  });

  it('describes a binary file instead of sending its bytes', async () => {
    const [snippet] = await reader().read([{ path: 'src/blob.bin' }]);
    expect(snippet?.content).toContain('binary file');
    expect(snippet?.truncated).toBe(true);
  });

  it('refuses more files than the per-call limit', async () => {
    await expect(
      reader({ maxFilesPerCall: 1 }).read([{ path: 'src/lines.ts' }, { path: 'src/lines.ts' }]),
    ).rejects.toThrow(TooManySourcesError);
  });

  it('refuses every read when source reading is turned off', async () => {
    await expect(reader({ allowReading: false }).read([{ path: 'src/lines.ts' }])).rejects.toThrow(
      SourceReadingDisabledError,
    );
  });

  it('falls back to the process directory when the client offers no roots', async () => {
    const fallback = new FsSourceReader({
      roots: async () => [],
      allowReading: true,
      maxFileBytes: 65_536,
      maxFilesPerCall: 20,
    });
    const [snippet] = await fallback.read([{ path: 'package.json' }]);
    expect(snippet?.content).toContain('"name": "claude-jev"');
  });

  it('refuses a file over the ceiling', async () => {
    await expect(reader().read([{ path: 'src/huge.log' }])).rejects.toThrow(FileTooLargeError);
  });

  it('refuses a file over the ceiling even when a line range is given', async () => {
    await expect(
      reader().read([{ path: 'src/huge.log', start: 1, end: 2 }]),
    ).rejects.toThrow(FileTooLargeError);
  });
});
