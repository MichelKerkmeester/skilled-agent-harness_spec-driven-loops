// ───────────────────────────────────────────────────────────────────
// MODULE: Relocate Real Pipeline
// ───────────────────────────────────────────────────────────────────
// The other relocation suites replace every follow-up writer with a stub that
// exits 0, so they stay green when the pipeline stops calling a step. This
// suite runs the committed writers in a throwaway repository and reads the
// stores those writers own. It also guards the checkout it runs in, because a
// writer that resolved its output beside itself would otherwise write into the
// real tree.

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildRealPipelineRepo, archivePacketCopy, failWriterFirstCall } from './fixtures/subtrack-tree.mjs';

const CLI_DIR = path.resolve(__dirname, '..');

// The mutation check points this at a scratch copy; a normal run uses the
// committed script.
const RELOCATE_SOURCE = process.env.RELOCATE_REAL_PIPELINE_SOURCE
  ? path.resolve(process.env.RELOCATE_REAL_PIPELINE_SOURCE)
  : path.join(CLI_DIR, 'spec', 'relocate.mjs');

const CHECKOUT = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: CLI_DIR, encoding: 'utf8' }).trim();

const GUARD_PATHS = [
  'specs',
  '.skilled/skills/sk-doc/shared/scripts',
  '.skilled/skills/system-spec-kit/runtime/data',
  '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures',
];

function guard(): string {
  return execFileSync('git', ['status', '--porcelain', '--', ...GUARD_PATHS], { cwd: CHECKOUT, encoding: 'utf8' });
}

function changedLines(before: string, after: string): string[] {
  const beforeLines = new Set(before.split('\n').filter(Boolean));
  const afterLines = new Set(after.split('\n').filter(Boolean));
  return [...new Set([...beforeLines, ...afterLines])].filter((line) => beforeLines.has(line) !== afterLines.has(line));
}

let guardedBefore: string;

beforeAll(() => {
  guardedBefore = guard();
  expect(fs.existsSync(RELOCATE_SOURCE), `relocate source is missing: ${RELOCATE_SOURCE}`).toBe(true);
});

afterAll(() => {
  const guardedAfter = guard();
  const changed = changedLines(guardedBefore, guardedAfter);
  expect(changed, `the suite changed guarded paths in the checkout: ${changed.join(', ')}`).toEqual([]);
});

interface DescriptionMetadata {
  specFolder: string;
  parentChain: string[];
  specId?: string;
}

interface GraphMetadata {
  packet_id: string;
  children_ids: string[];
  spec_folder?: string;
}

interface PipelineRepo {
  root: string;
  map: string;
  packet: string;
  moved: string;
  tools: {
    relocate: string;
    archive: string;
    migrate: string;
    citeDrift: string;
    tsxLoader: string;
  };
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function runRelocate(repo: PipelineRepo, args: string[]) {
  return spawnSync('node', [repo.tools.relocate, ...args], { cwd: repo.root, encoding: 'utf8' });
}

function combined(result: { stdout: string; stderr: string }): string {
  return `${result.stdout}${result.stderr}`;
}

/** The values the happy path asserts, read again after a rerun finished the map. */
function expectMovedStores(repo: PipelineRepo, output: string): void {
  const description = readJson(path.join(repo.root, 'specs', repo.moved, 'description.json')) as DescriptionMetadata;
  expect(description.specFolder, output).toBe(repo.moved);
  expect(description.parentChain, output).toEqual(['demo', 'sub']);

  const graph = readJson(path.join(repo.root, 'specs', repo.moved, 'graph-metadata.json')) as GraphMetadata;
  expect(graph.packet_id, output).toBe(repo.moved);

  const trackGraph = readJson(path.join(repo.root, 'specs', 'demo', 'sub', 'graph-metadata.json')) as GraphMetadata;
  expect(trackGraph.children_ids, output).toContain(repo.moved);
  const rootGraph = readJson(path.join(repo.root, 'specs', 'demo', 'graph-metadata.json')) as GraphMetadata;
  expect(rootGraph.children_ids, output).toContain('demo/sub');
}

describe('relocate with the true pipeline writers', () => {
  it('applies a map into a new sub-track and reads every store the writers own', { timeout: 120_000 }, () => {
    const repo = buildRealPipelineRepo({ relocateSource: RELOCATE_SOURCE });

    try {
      expect(execFileSync('git', ['status', '--porcelain'], { cwd: repo.root, encoding: 'utf8' })).toBe('');

      const relocatePath = path.join(repo.root, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec', 'relocate.mjs');
      const relocate = (args: string[]) => spawnSync('node', [relocatePath, ...args], { cwd: repo.root, encoding: 'utf8' });

      const first = relocate(['--map', repo.map, '--apply']);
      const description = readJson(path.join(repo.root, 'specs', repo.moved, 'description.json')) as DescriptionMetadata;
      expect(
        description.parentChain,
        `the migrate step must record the new parent chain\n${first.stdout}${first.stderr}`,
      ).toEqual(['demo', 'sub']);
      expect(description.specFolder, first.stdout + first.stderr).toBe(repo.moved);
      expect(first.status, first.stdout + first.stderr).toBe(0);

      const movedGraph = readJson(path.join(repo.root, 'specs', repo.moved, 'graph-metadata.json')) as GraphMetadata;
      expect(movedGraph.packet_id, first.stdout + first.stderr).toBe(repo.moved);

      const trackGraph = readJson(path.join(repo.root, 'specs', 'demo', 'sub', 'graph-metadata.json')) as GraphMetadata;
      expect(trackGraph.children_ids).toContain(repo.moved);
      const rootGraph = readJson(path.join(repo.root, 'specs', 'demo', 'graph-metadata.json')) as GraphMetadata;
      expect(rootGraph.children_ids).toContain('demo/sub');

      const validateScript = path.join(repo.root, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec', 'validate.sh');
      const validation = spawnSync('bash', [validateScript, `specs/${repo.moved}`, '--strict'], { cwd: repo.root, encoding: 'utf8' });
      expect(validation.status, validation.stdout + validation.stderr).toBe(0);
      expect(validation.stdout).toContain('RESULT: PASSED');

      const second = relocate(['--map', repo.map, '--apply']);
      expect(second.status, second.stdout + second.stderr).toBe(0);
      expect(second.stdout).toContain('relocate: nothing to do');
    } finally {
      fs.rmSync(repo.root, { recursive: true, force: true });
    }
  });

  it('resumes a map after the redirect table step fails once', { timeout: 180_000 }, () => {
    const repo: PipelineRepo = buildRealPipelineRepo({ relocateSource: RELOCATE_SOURCE });
    try {
      // The failure lands after the ledger write, so the rerun has to read the
      // record and finish the late steps instead of finding nothing to do.
      failWriterFirstCall(repo.tools.citeDrift, { reexport: true });

      const first = runRelocate(repo, ['--map', repo.map, '--apply']);
      expect(first.status, combined(first)).toBe(2);
      expect(first.stdout, combined(first)).toContain('step redirect table (cite-drift-scan --rebuild-redirects): FAILED');

      const second = runRelocate(repo, ['--map', repo.map, '--apply']);
      expect(second.status, combined(second)).toBe(0);
      expect(second.stdout, combined(second)).toContain('step redirect table (cite-drift-scan --rebuild-redirects): ok');
      expectMovedStores(repo, combined(second));

      const third = runRelocate(repo, ['--map', repo.map, '--apply']);
      expect(third.status, combined(third)).toBe(0);
      expect(third.stdout, combined(third)).toContain('relocate: nothing to do');
    } finally {
      fs.rmSync(repo.root, { recursive: true, force: true });
    }
  });

  it('resumes a map after the description identity step fails once', { timeout: 180_000 }, () => {
    const repo: PipelineRepo = buildRealPipelineRepo({ relocateSource: RELOCATE_SOURCE });
    try {
      // This step runs before the ledger write, so the rerun has to detect the
      // stale parent chain and re-derive the identity rather than trust a record.
      failWriterFirstCall(repo.tools.migrate, { loader: repo.tools.tsxLoader });

      const first = runRelocate(repo, ['--map', repo.map, '--apply']);
      expect(first.status, combined(first)).toBe(2);
      expect(first.stdout, combined(first)).toContain('step description identity (migrate-generated-json --only): FAILED');

      const second = runRelocate(repo, ['--map', repo.map, '--apply']);
      expect(second.status, combined(second)).toBe(0);
      expect(second.stdout, combined(second)).toContain('step description identity (migrate-generated-json --only): ok');
      expectMovedStores(repo, combined(second));
    } finally {
      fs.rmSync(repo.root, { recursive: true, force: true });
    }
  });

  it('restores an archived packet onto the next free number', { timeout: 180_000 }, () => {
    const repo: PipelineRepo = buildRealPipelineRepo({ relocateSource: RELOCATE_SOURCE });
    try {
      const archived = 'demo/z_archive/001-archived-probe';
      const restored = 'demo/002-archived-probe';
      // The live packet keeps number 001 taken, so the restore must renumber
      // through the relocation engine rather than move the folder in place.
      archivePacketCopy(repo.root, repo.packet, archived);

      const restore = spawnSync('bash', [repo.tools.archive, '--restore', `specs/${archived}`], {
        cwd: repo.root,
        encoding: 'utf8',
      });
      expect(restore.status, combined(restore)).toBe(0);
      expect(restore.stdout, combined(restore)).toContain(`restoring as specs/${restored}`);
      expect(fs.existsSync(path.join(repo.root, 'specs', ...archived.split('/'))), combined(restore)).toBe(false);
      expect(fs.existsSync(path.join(repo.root, 'specs', ...restored.split('/'))), combined(restore)).toBe(true);

      const description = readJson(path.join(repo.root, 'specs', ...restored.split('/'), 'description.json')) as DescriptionMetadata;
      expect(description.specFolder, combined(restore)).toBe(restored);
      expect(description.parentChain, combined(restore)).toEqual(['demo']);
      expect(description.specId, combined(restore)).toBe('002');

      const graph = readJson(path.join(repo.root, 'specs', ...restored.split('/'), 'graph-metadata.json')) as GraphMetadata;
      expect(graph.packet_id, combined(restore)).toBe(restored);
      expect(graph.spec_folder, combined(restore)).toBe(restored);
    } finally {
      fs.rmSync(repo.root, { recursive: true, force: true });
    }
  });
});
