// ───────────────────────────────────────────────────────────────────
// MODULE: Symlinked Project Root Tests
// ───────────────────────────────────────────────────────────────────
// A project repository reaches this runtime through a `.skilled` link into a shared checkout.
// Node resolves every module through that link, so a project root derived from the module's own
// location named the shared checkout, and a save run from the project looked for its packet in
// the wrong tree. These cases run the built scripts through a real link, from a temp repository,
// the way a linked project runs them.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const SKILLED_DIR = resolve(__dirname, '..', '..', '..', '..', '..');
const RUNTIME_REPOSITORY = resolve(SKILLED_DIR, '..');
const LINKED_CLI_DIST = join('.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'dist');

const PACKET = join('specs', 'demo', '001-demo');
const SAVE_PAYLOAD = JSON.stringify({
  specFolder: 'specs/demo/001-demo',
  sessionSummary: 'Fixed the project root for linked repositories so saves land in the caller repository.',
  exchanges: [{
    userInput: 'Make saves from a linked repository land in that repository',
    assistantResponse: 'Derived the project root from the working directory git top-level and added tests that run through a real symlink.',
  }],
  filesModified: [{ path: 'specs/demo/001-demo/spec.md', changes_summary: 'probe' }],
});

const roots: string[] = [];

afterEach(() => {
  while (roots.length > 0) {
    rmSync(roots.pop() as string, { recursive: true, force: true });
  }
});

/** A git repository in its physical form whose `.skilled` links to this runtime. */
function makeLinkedRepository(): string {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'linked-project-')));
  roots.push(root);
  const init = spawnSync('git', ['init', '-q'], { cwd: root, encoding: 'utf8' });
  if (init.status !== 0) {
    throw new Error(`git init failed: ${init.stderr}`);
  }
  symlinkSync(SKILLED_DIR, join(root, '.skilled'));
  // A linked project carries the runtime folders too, and the graph-metadata write guard trusts
  // only a workspace anchored on `.opencode`.
  symlinkSync(join(RUNTIME_REPOSITORY, '.opencode'), join(root, '.opencode'));
  const packet = join(root, PACKET);
  mkdirSync(packet, { recursive: true });
  writeFileSync(join(packet, 'spec.md'), '# Demo\n', 'utf8');
  return root;
}

/** The project root the built config resolves when imported through the link from `cwd`. */
function projectRootFrom(cwd: string, linkedRepository: string): { root: string; stderr: string } {
  const configUrl = pathToFileURL(join(linkedRepository, LINKED_CLI_DIST, 'core', 'config.js')).href;
  const result = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', `const m = await import(${JSON.stringify(configUrl)}); process.stdout.write(m.CONFIG.PROJECT_ROOT);`],
    { cwd, encoding: 'utf8' },
  );
  if (result.status !== 0) {
    throw new Error(`config probe failed: ${result.stderr}`);
  }
  return { root: result.stdout, stderr: result.stderr };
}

describe('project root for a repository that links .skilled', () => {
  it('is the linked repository, not the runtime repository', () => {
    const repository = makeLinkedRepository();
    expect(projectRootFrom(repository, repository).root).toBe(repository);
  });

  it('is the repository top-level when the run starts in a subfolder', () => {
    const repository = makeLinkedRepository();
    const subfolder = join(repository, 'docs', 'notes');
    mkdirSync(subfolder, { recursive: true });
    expect(projectRootFrom(subfolder, repository).root).toBe(repository);
  });

  it('stays the runtime repository for a run inside the runtime repository itself', () => {
    const repository = makeLinkedRepository();
    expect(projectRootFrom(RUNTIME_REPOSITORY, repository).root).toBe(realpathSync(RUNTIME_REPOSITORY));
  });

  it('falls back to the runtime repository outside any project and says so on stderr', () => {
    const repository = makeLinkedRepository();
    const outside = realpathSync(mkdtempSync(join(tmpdir(), 'no-project-')));
    roots.push(outside);
    const probe = projectRootFrom(outside, repository);
    expect(probe.root).toBe(RUNTIME_REPOSITORY);
    expect(probe.stderr).toContain('is not inside a repository that uses spec-kit');
  });
});

describe('generate-context launched through the link', () => {
  const run = (repository: string, nodeFlags: string[], args: string[], cwd: string = repository) => spawnSync(
    process.execPath,
    [...nodeFlags, join(repository, LINKED_CLI_DIST, 'continuity', 'generate-context.js'), ...args],
    { cwd, encoding: 'utf8' },
  );

  it('saves to the linked repository\'s own packet', () => {
    const repository = makeLinkedRepository();
    const result = run(repository, [], ['--json', SAVE_PAYLOAD]);

    expect(result.stderr).not.toContain('divergent-duplicate');
    expect(result.status).toBe(0);
    expect(existsSync(join(repository, PACKET, 'description.json'))).toBe(true);
    expect(existsSync(join(repository, PACKET, 'graph-metadata.json'))).toBe(true);
    expect(existsSync(join(RUNTIME_REPOSITORY, PACKET))).toBe(false);
  }, 60_000);

  it('saves a packet reached through a specs folder that links into another workspace', () => {
    // The save resolves the packet before it refreshes graph metadata, and walking up from the
    // resolved path reaches the other workspace, whose roots do not hold the track.
    const repository = makeLinkedRepository();
    const workspace = realpathSync(mkdtempSync(join(tmpdir(), 'track-owner-')));
    roots.push(workspace);
    mkdirSync(join(workspace, '.opencode'));
    const trackSpecs = join(workspace, 'repositories', 'demo', 'specs');
    const trackPacket = join(trackSpecs, 'demo', '001-demo');
    mkdirSync(trackPacket, { recursive: true });
    writeFileSync(join(trackPacket, 'spec.md'), '# Demo\n', 'utf8');
    rmSync(join(repository, 'specs'), { recursive: true, force: true });
    symlinkSync(trackSpecs, join(repository, 'specs'));

    const result = run(repository, [], ['--json', SAVE_PAYLOAD]);

    expect(result.stderr).not.toContain('outside a configured specs root');
    expect(result.status).toBe(0);
    expect(existsSync(join(trackPacket, 'graph-metadata.json'))).toBe(true);
  }, 60_000);

  it('honours an explicit project root from a directory outside any repository', () => {
    const repository = makeLinkedRepository();
    const outside = realpathSync(mkdtempSync(join(tmpdir(), 'no-project-')));
    roots.push(outside);
    const result = run(repository, [], ['--project-root', repository, '--json', SAVE_PAYLOAD], outside);

    expect(result.status).toBe(0);
    expect(existsSync(join(repository, PACKET, 'graph-metadata.json'))).toBe(true);
  }, 60_000);

  it('does not exit 0 on a save with nothing in it', () => {
    const repository = makeLinkedRepository();
    const result = run(repository, [], ['--json', JSON.stringify({ specFolder: 'specs/demo/001-demo', exchanges: [] })]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('INSUFFICIENT_CONTEXT_ABORT');
    expect(result.stderr).toContain('No primary evidence was captured');
  }, 60_000);

  it('rejects an unknown option the same way with and without --preserve-symlinks-main', () => {
    const repository = makeLinkedRepository();
    const plain = run(repository, [], ['--not-an-option']);
    const preserved = run(repository, ['--preserve-symlinks-main'], ['--not-an-option']);

    expect(plain.status).toBe(1);
    expect(plain.stderr).toContain('Unknown option: --not-an-option');
    expect(preserved.status).toBe(plain.status);
    expect(preserved.stderr).toContain('Unknown option: --not-an-option');
  });

  it('refuses a --project-root that sits outside the working repository', () => {
    const repository = makeLinkedRepository();
    const elsewhere = realpathSync(mkdtempSync(join(tmpdir(), 'elsewhere-')));
    roots.push(elsewhere);
    writeFileSync(join(elsewhere, 'marker'), '\n', 'utf8');
    const result = run(repository, [], ['--project-root', elsewhere, '--json', '{"specFolder":"specs/001-demo"}']);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--project-root must be inside the working repository');
  });

  it('refuses a --project-root that does not exist', () => {
    const repository = makeLinkedRepository();
    const result = run(repository, [], ['--project-root', join(repository, 'missing'), '--json', '{"specFolder":"specs/001-demo"}']);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--project-root is not a directory');
  });
});
