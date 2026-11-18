// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Restart Lifecycle Contract
// ───────────────────────────────────────────────────────────────────

// The restart path is text in the two workflow assets: a prior lineage is read
// before the archive, the archive moves the packet exactly once, and the new
// gen values reach the config and the ledger. These cases read the assets as
// plain text and run the archive and binding commands against temp folders, so
// a path that passes here has run the same shell the workflow runs.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEEP_RESEARCH_STEM_PRODUCERS } from '../../lib/deep-research-ledger-schema/deep-research-ledger-types.js';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const here = dirname(fileURLToPath(import.meta.url));
const RUNTIME_ROOT = resolve(here, '..', '..');
const REPO_ROOT = resolve(RUNTIME_ROOT, '..', '..', '..', '..');
const SKILLS_ROOT = resolve(REPO_ROOT, '.skilled');
const COMMANDS_ROOT = resolve(SKILLS_ROOT, 'commands', 'deep');
const ASSETS = resolve(COMMANDS_ROOT, 'assets');
const GATEWAY = resolve(RUNTIME_ROOT, 'scripts', 'append-mode-event.cjs');
const REPO_TMP = resolve(here, '..', '.tmp');

interface WorkflowFile {
  readonly label: string;
  readonly file: string;
  readonly kind: 'research' | 'review';
}

const FILES: readonly WorkflowFile[] = [
  { label: 'research', file: 'deep-research.yaml', kind: 'research' },
  { label: 'review', file: 'deep-review.yaml', kind: 'review' },
];
const RESEARCH_FILES = FILES.filter((entry) => entry.kind === 'research');

const LINEAGE_VALUES_LINES = [
  '        lineage_values:',
  '          generation_init: "{prior_generation + 1} when lineage_mode == \'restart\', else 1"',
  '          lineage_mode_init: "restart when lineage_mode == \'restart\', else new"',
  '          parent_session_id_init: "{prior_session_id} when lineage_mode == \'restart\', else null"',
];
const RESEARCH_POPULATE_LINES = [
  '          lineage.parentSessionId: "{parent_session_id_init}"',
  '          lineage.lineageMode: "{lineage_mode_init}"',
  '          lineage.generation: "{generation_init}"',
];
const REVIEW_POPULATE_LINES = [
  '          parentSessionId: "{parent_session_id_init}"',
  '          lineageMode: "{lineage_mode_init}"',
  '          generation: "{generation_init}"',
];

const tempDirs: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function fileText(file: string): string {
  return readFileSync(resolve(ASSETS, file), 'utf8');
}

function topLevelStep(text: string, name: string): string {
  const marker = `\n  ${name}:\n`;
  const start = text.indexOf(marker);
  if (start === -1) return '';
  const rest = text.slice(start + 1);
  const end = rest.search(/\n  [a-z_]+:\n/u);
  return end === -1 ? rest : rest.slice(0, end);
}

function phaseStep(text: string, name: string): string {
  const marker = `      ${name}:\n`;
  const start = text.indexOf(marker);
  if (start === -1) return '';
  const rest = text.slice(start + 1);
  const end = rest.search(/\n      [a-z_0-9]+:\n/u);
  return end === -1 ? rest : rest.slice(0, end);
}

function indentOf(line: string): number {
  return line.length - line.trimStart().length;
}

function keyBlock(block: string, key: string): string {
  const lines = block.split('\n');
  const start = lines.findIndex((line) => {
    const trimmed = line.trim();
    return trimmed === `${key}:` || trimmed.startsWith(`${key}: `);
  });
  if (start === -1) return '';

  const baseIndent = indentOf(lines[start]);
  let end = start;
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '') continue;
    if (indentOf(line) <= baseIndent) break;
    end = index;
  }
  return lines.slice(start, end + 1).join('\n');
}

function blockScalar(block: string, key: string): string {
  const lines = block.split('\n');
  const start = lines.findIndex((line) => line.trim() === `${key}: |`);
  if (start === -1) return '';

  const baseIndent = indentOf(lines[start]);
  let end = start;
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '') {
      end = index;
      continue;
    }
    if (indentOf(line) <= baseIndent) break;
    end = index;
  }

  const body = lines.slice(start + 1, end + 1);
  while (body.length > 0 && body[body.length - 1].trim() === '') body.pop();
  const indents = body.filter((line) => line.trim() !== '').map(indentOf);
  if (indents.length === 0) return '';
  const common = Math.min(...indents);
  return body.map((line) => (line.trim() === '' ? '' : line.slice(common))).join('\n');
}

function archiveCommand(block: string): string {
  const rest = block.replace(keyBlock(block, 'bind_prior_lineage'), '');
  return blockScalar(rest, 'command');
}

function render(command: string, values: Readonly<Record<string, string>>): string {
  let rendered = command;
  for (const [placeholder, value] of Object.entries(values)) {
    rendered = rendered.split(placeholder).join(value);
  }
  return rendered;
}

function afterAcquire(text: string): string {
  return text.slice(text.indexOf('      step_acquire_lock:\n'));
}

function runShell(command: string, cwd = REPO_ROOT): ReturnType<typeof spawnSync> {
  return spawnSync('bash', ['-c', command], { cwd, encoding: 'utf8' });
}

function lastJsonLine(stdout: string | null | undefined): Record<string, unknown> {
  const line = String(stdout ?? '')
    .split(/\r?\n/u)
    .filter(Boolean)
    .at(-1) ?? '{}';
  return JSON.parse(line) as Record<string, unknown>;
}

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function makeRepoScratchDir(prefix: string): string {
  mkdirSync(REPO_TMP, { recursive: true });
  const dir = mkdtempSync(join(REPO_TMP, prefix));
  tempDirs.push(dir);
  return dir;
}

function restartBlock(text: string): string {
  return topLevelStep(text, 'step_apply_lifecycle_request');
}

function confirmRestartBlock(text: string): string {
  return keyBlock(phaseStep(text, 'step_classify_session'), 'on_restart_choice');
}

function autoArchiveCommand(): string {
  return archiveCommand(restartBlock(fileText('deep-research.yaml')));
}

function bindCommand(entry: WorkflowFile): string {
  return blockScalar(keyBlock(restartBlock(fileText(entry.file)), 'bind_prior_lineage'), 'command');
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('workflow restart lifecycle', () => {
  it('research flags: research.md and the presentation bind lineage_mode', () => {
    const researchCommand = readFileSync(resolve(COMMANDS_ROOT, 'research.md'), 'utf8');
    expect(researchCommand).toContain('--restart');
    expect(researchCommand).toContain('--lineage-mode');

    const presentation = readFileSync(resolve(ASSETS, 'deep-research-presentation.txt'), 'utf8');
    expect(presentation).toContain('lineage_mode');
    expect(presentation).toContain('--restart -> lineage_mode = restart');
  });

  for (const { label, file } of RESEARCH_FILES) {
    it(`${label} flags: preflight requires lineage_mode`, () => {
      const preflight = phaseStep(fileText(file), 'step_preflight_contract');
      expect(preflight).not.toBe('');
      const requiredLine = preflight
        .split('\n')
        .find((line) => line.includes('required_values_present:')) ?? '';
      expect(requiredLine).not.toBe('');
      expect(requiredLine).toContain('lineage_mode');
    });
  }

  for (const { label, file } of FILES) {
    it(`${label} restart order: the archive runs before fan-out, directories and the lock`, () => {
      const text = fileText(file);
      const archiveAt = text.indexOf('\n  step_apply_lifecycle_request:\n');
      const fanoutAt = text.indexOf('\n  step_fanout_spawn:\n');
      const directoriesAt = text.indexOf('      step_create_directories:\n');
      const lockAt = text.indexOf('      step_acquire_lock:\n');

      expect(archiveAt).not.toBe(-1);
      expect(archiveAt).toBeLessThan(fanoutAt);
      expect(fanoutAt).toBeLessThan(directoriesAt);
      expect(directoriesAt).toBeLessThan(lockAt);
      expect(topLevelStep(text, 'step_apply_lifecycle_request')).toContain(
        "skip_when: \"lineage_mode != 'restart'\"",
      );
    });
  }

  for (const entry of FILES) {
    it(`no post-lock move: ${entry.label} restart never moves the packet after the lock`, () => {
      const text = fileText(entry.file);
      const tail = afterAcquire(text);
      expect(tail.length).toBeGreaterThan(0);
      expect(tail).not.toContain('mv {state_paths.packet_dir}');
      expect(tail).not.toContain('mv "{state_paths.packet_dir}"');

      // The classified restart branch is confirm-only. It archives into the
      // existing archive root and leaves the held lock file in place.
      const restartChoice = confirmRestartBlock(text);
      expect(restartChoice).not.toBe('');
      expect(restartChoice).toContain('! -name "$(basename "{state_paths.lock_file}")"');
      expect(restartChoice).toContain(
        'mkdir -p "{state_paths.prompt_dir}" "{state_paths.iteration_dir}" "{state_paths.delta_dir}"',
      );
      expect(restartChoice).toContain('on_fail: "Halt with STATUS=FAIL through step_release_lock');
    });
  }

  it('no post-lock move: the auto archive moves the packet into the archive root', () => {
    const command = autoArchiveCommand();
    expect(command).not.toBe('');

    const dir = makeTempDir('workflow-restart-');
    const packetDir = join(dir, 'packet');
    const archiveRoot = join(dir, 'archive');
    mkdirSync(packetDir, { recursive: true });
    writeFileSync(join(packetDir, 'iteration-1.md'), 'row\n');

    const rendered = render(command, {
      '{state_paths.packet_dir}': packetDir,
      '{state_paths.archive_root}': archiveRoot,
      '{timestamp_slug}': 'slug-1',
    });
    const run = runShell(rendered);

    expect(run.status, String(run.stdout) + String(run.stderr)).toBe(0);
    expect(existsSync(join(archiveRoot, 'slug-1', 'iteration-1.md'))).toBe(true);
    expect(existsSync(packetDir)).toBe(true);
    expect(readdirSync(packetDir)).toEqual([]);

    const archiveTarget = resolve(archiveRoot, 'slug-1');
    expect(rendered).toContain(archiveTarget);
    expect(archiveTarget.startsWith(resolve(archiveRoot))).toBe(true);
  });

  it('no post-lock move: archive target exists stops the auto archive', () => {
    const command = autoArchiveCommand();
    expect(command).not.toBe('');

    const dir = makeTempDir('workflow-restart-');
    const packetDir = join(dir, 'packet');
    const archiveRoot = join(dir, 'archive');
    mkdirSync(packetDir, { recursive: true });
    mkdirSync(join(archiveRoot, 'slug-1'), { recursive: true });
    writeFileSync(join(packetDir, 'iteration-1.md'), 'row\n');

    const rendered = render(command, {
      '{state_paths.packet_dir}': packetDir,
      '{state_paths.archive_root}': archiveRoot,
      '{timestamp_slug}': 'slug-1',
    });
    const run = runShell(rendered);

    expect(run.status).not.toBe(0);
    expect(existsSync(join(packetDir, 'iteration-1.md'))).toBe(true);
  });

  it('no post-lock move: the confirm archive keeps the held lock file in place', () => {
    const command = archiveCommand(
      confirmRestartBlock(fileText('deep-research.yaml')),
    );
    expect(command).not.toBe('');

    const dir = makeTempDir('workflow-restart-');
    const packetDir = join(dir, 'packet');
    const archiveRoot = join(dir, 'archive');
    const lockFile = join(packetDir, '.deep-research.lock');
    mkdirSync(join(packetDir, 'iterations'), { recursive: true });
    writeFileSync(join(packetDir, 'deep-research-config.json'), '{}\n');
    writeFileSync(join(packetDir, 'iterations', 'a.md'), 'a\n');
    writeFileSync(lockFile, 'lock\n');

    const rendered = render(command, {
      '{state_paths.packet_dir}': packetDir,
      '{state_paths.archive_root}': archiveRoot,
      '{timestamp_slug}': 'slug-1',
      '{state_paths.lock_file}': lockFile,
      '{state_paths.prompt_dir}': join(packetDir, 'prompts'),
      '{state_paths.iteration_dir}': join(packetDir, 'iterations'),
      '{state_paths.delta_dir}': join(packetDir, 'deltas'),
    });
    const run = runShell(rendered);

    expect(run.status, String(run.stdout) + String(run.stderr)).toBe(0);
    expect(existsSync(lockFile)).toBe(true);
    expect(existsSync(join(archiveRoot, 'slug-1', 'deep-research-config.json'))).toBe(true);
    expect(existsSync(join(archiveRoot, 'slug-1', 'iterations', 'a.md'))).toBe(true);
    expect(existsSync(join(packetDir, 'deep-research-config.json'))).toBe(false);
    for (const name of ['prompts', 'iterations', 'deltas']) {
      expect(existsSync(join(packetDir, name))).toBe(true);
    }
  });

  for (const entry of FILES) {
    it(`prior lineage binding: ${entry.label} reads the old config before the archive`, () => {
      const text = fileText(entry.file);
      const restartPaths = [
        {
          label: 'step_apply_lifecycle_request',
          block: restartBlock(text),
          archiveMarker: 'mv "{state_paths.packet_dir}"',
        },
        {
          label: 'step_classify_session.on_restart_choice',
          block: confirmRestartBlock(text),
          archiveMarker: 'find "{state_paths.packet_dir}"',
        },
      ];

      const dir = makeTempDir('workflow-restart-');
      const configPath = join(dir, 'deep-research-config.json');
      const stateLogPath = join(dir, 'deep-research-state.jsonl');
      const prior = entry.kind === 'research'
        ? { lineage: { sessionId: 'sess-old', generation: 2 } }
        : { sessionId: 'sess-old', generation: 2 };
      writeFileSync(configPath, JSON.stringify(prior));

      for (const restartPath of restartPaths) {
        const block = restartPath.block;
        expect(block, restartPath.label).not.toBe('');

        const bindAt = block.indexOf('bind_prior_lineage:');
        expect(bindAt, restartPath.label).not.toBe(-1);
        const archiveAt = block.indexOf(restartPath.archiveMarker);
        expect(archiveAt, restartPath.label).not.toBe(-1);
        expect(bindAt, restartPath.label).toBeLessThan(archiveAt);

        const command = blockScalar(keyBlock(block, 'bind_prior_lineage'), 'command');
        expect(command, restartPath.label).not.toBe('');

        const run = runShell(render(command, {
          '{state_paths.config}': configPath,
          '{state_paths.state_log}': stateLogPath,
        }));
        expect(run.status, String(run.stdout) + String(run.stderr)).toBe(0);
        const binding = lastJsonLine(run.stdout);
        expect(binding).toMatchObject({ priorSessionId: 'sess-old', priorGeneration: 2 });
        expect(binding.priorTailDigest).toMatch(/^[0-9a-f]{64}$/);
      }
    });
  }

  it('restart projection: the gateway records run_restarted after run_initialized', () => {
    const text = fileText('deep-research.yaml');
    const openCommand = blockScalar(phaseStep(text, 'step_create_state_log'), 'command');
    expect(openCommand).not.toBe('');

    const dir = makeRepoScratchDir('workflow-restart-');
    const configPath = join(dir, 'deep-research-config.json');
    const stateLogPath = join(dir, 'deep-research-state.jsonl');
    writeFileSync(configPath, JSON.stringify({
      topic: 'probe',
      maxIterations: 3,
      specFolder: 'specs/x',
      createdAt: '2026-11-14T10:00:00Z',
      status: 'initialized',
      lineage: {
        sessionId: 'sess-new',
        parentSessionId: 'sess-old',
        lineageMode: 'restart',
        generation: 3,
        continuedFromRun: null,
      },
    }));

    const open = runShell(render(openCommand, {
      '{state_paths.config}': configPath,
      '{state_paths.state_log}': stateLogPath,
    }));
    expect(open.status, String(open.stdout) + String(open.stderr)).toBe(0);

    const restartedStep = phaseStep(text, 'step_record_restarted_run');
    expect(restartedStep).not.toBe('');
    const marker = "append_jsonl: '";
    const markerAt = restartedStep.indexOf(marker);
    expect(markerAt).not.toBe(-1);
    const tail = restartedStep.slice(markerAt + marker.length);
    const newlineAt = tail.indexOf('\n');
    const eventLine = (newlineAt === -1 ? tail : tail.slice(0, newlineAt)).trimEnd();
    expect(eventLine.endsWith("'")).toBe(true);
    const eventText = render(eventLine.slice(0, -1), {
      '{session_id_init}': 'sess-new',
      '{restart_lineage_id}': 'sess-old',
      '{generation_init}': '3',
      '{prior_tail_digest}': createHash('sha256').update('').digest('hex'),
    });
    const eventPath = join(dir, 'event.json');
    writeFileSync(eventPath, eventText);

    const append = spawnSync(process.execPath, [
      GATEWAY,
      '--mode',
      'research',
      '--run-directory',
      dir,
      '--event-json',
      eventPath,
    ], { cwd: REPO_ROOT, encoding: 'utf8' });
    expect(append.status, String(append.stdout) + String(append.stderr)).toBe(0);

    const payload = lastJsonLine(append.stdout);
    expect(payload.ok).toBe(true);
    const receipt = payload.receipt as Record<string, unknown>;
    expect(receipt.event_type).toBe('deep-research.ledger.run-restarted');
    expect(receipt.sequence).toBe(2);

    const projectedPath = join(dir, 'research', 'deep-research-state.jsonl');
    expect(existsSync(projectedPath)).toBe(true);
    const rows = readFileSync(projectedPath, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    const restarted = rows.find((row) => row.event === 'restarted');
    expect(restarted).toBeDefined();
    expect(restarted).toMatchObject({ event: 'restarted', generation: 3 });
  });

  it('restart projection: the ledger table marks run_restarted spoken by the research workflow', () => {
    expect(DEEP_RESEARCH_STEM_PRODUCERS['deep_research.run_restarted']).toEqual({
      status: 'spoken',
      producers: [
        '.skilled/commands/deep/assets/deep-research.yaml',
      ],
    });
  });

  it('prior lineage binding: missing old config binds null and generation 0', () => {
    const command = bindCommand(RESEARCH_FILES[0]);
    expect(command).not.toBe('');

    const dir = makeTempDir('workflow-restart-');
    const configPath = join(dir, 'deep-research-config.json');
    const stateLogPath = join(dir, 'deep-research-state.jsonl');
    const run = runShell(render(command, {
      '{state_paths.config}': configPath,
      '{state_paths.state_log}': stateLogPath,
    }));

    expect(run.status, String(run.stdout) + String(run.stderr)).toBe(0);
    const binding = lastJsonLine(run.stdout);
    expect(binding).toMatchObject({ priorSessionId: null, priorGeneration: 0 });
    expect(binding.priorTailDigest).toMatch(/^[0-9a-f]{64}$/);
  });

  it('prior lineage binding: corrupt old config stops the restart', () => {
    const command = bindCommand(RESEARCH_FILES[0]);
    expect(command).not.toBe('');

    const dir = makeTempDir('workflow-restart-');
    const configPath = join(dir, 'deep-research-config.json');
    const stateLogPath = join(dir, 'deep-research-state.jsonl');
    writeFileSync(configPath, '{not json');
    const run = runShell(render(command, {
      '{state_paths.config}': configPath,
      '{state_paths.state_log}': stateLogPath,
    }));

    expect(run.status).not.toBe(0);
  });

  it('prior lineage binding: the tail digest is the sha256 of the old state log', () => {
    const command = bindCommand(RESEARCH_FILES[0]);
    expect(command).not.toBe('');

    const dir = makeTempDir('workflow-restart-');
    const configPath = join(dir, 'deep-research-config.json');
    const stateLogPath = join(dir, 'deep-research-state.jsonl');
    writeFileSync(configPath, JSON.stringify({ lineage: { sessionId: 'sess-old', generation: 2 } }));
    writeFileSync(stateLogPath, 'row\n');

    const run = runShell(render(command, {
      '{state_paths.config}': configPath,
      '{state_paths.state_log}': stateLogPath,
    }));

    expect(run.status, String(run.stdout) + String(run.stderr)).toBe(0);
    expect(lastJsonLine(run.stdout).priorTailDigest).toBe(
      createHash('sha256').update('row\n').digest('hex'),
    );
  });

  for (const entry of FILES) {
    it(`${entry.label} config lineage: the restart values reach the config`, () => {
      const text = fileText(entry.file);
      const createConfig = phaseStep(text, 'step_create_config');
      expect(createConfig).not.toBe('');

      for (const line of LINEAGE_VALUES_LINES) {
        expect(createConfig).toContain(line);
      }
      const populateLines = entry.kind === 'research' ? RESEARCH_POPULATE_LINES : REVIEW_POPULATE_LINES;
      for (const line of populateLines) {
        expect(createConfig).toContain(line);
      }

      for (const line of text.split('\n')) {
        expect(line.trimEnd().endsWith('lineageMode: "new"'), line).toBe(false);
        expect(line.trimEnd().endsWith('generation: 1'), line).toBe(false);
      }

      if (entry.kind === 'review') {
        expect(phaseStep(text, 'step_create_findings_registry')).toContain(
          '"generation":{generation_init},"lineageMode":"{lineage_mode_init}"',
        );
      }
    });
  }

  for (const { label, file } of RESEARCH_FILES) {
    it(`${label} restarted event: recorded after the run opens`, () => {
      const text = fileText(file);
      const stateLogAt = text.indexOf('      step_create_state_log:\n');
      const restartedAt = text.indexOf('      step_record_restarted_run:\n');
      const strategyAt = text.indexOf('      step_create_strategy:\n');

      expect(stateLogAt).not.toBe(-1);
      expect(restartedAt).not.toBe(-1);
      expect(strategyAt).not.toBe(-1);
      expect(stateLogAt).toBeLessThan(restartedAt);
      expect(restartedAt).toBeLessThan(strategyAt);

      const restarted = phaseStep(text, 'step_record_restarted_run');
      expect(restarted).toContain("skip_when: \"lineage_mode != 'restart'\"");
      expect(restarted).toContain('deep_research.run_restarted');
      expect(restarted).toContain('"stem":"deep_research.run_restarted"');
      expect(restarted).toContain('restart_lineage_id: "{prior_session_id} when it is not null, else {session_id_init}"');
      expect(phaseStep(text, 'step_classify_session')).not.toContain('run_restarted');
    });
  }

  for (const entry of FILES) {
    it(`${entry.label} config lineage: lineage_values sits directly before the populate map`, () => {
      const createConfig = phaseStep(fileText(entry.file), 'step_create_config');
      expect(createConfig).not.toBe('');

      const valuesAt = createConfig.indexOf('        lineage_values:');
      const populateAt = createConfig.indexOf('        populate:');
      expect(valuesAt).not.toBe(-1);
      expect(populateAt).not.toBe(-1);
      expect(valuesAt).toBeLessThan(populateAt);
      expect(createConfig.slice(valuesAt, populateAt)).toContain('generation_init:');
    });
  }

  it('prior lineage binding: the binding fails only when the old config is unreadable', () => {
    const entry = RESEARCH_FILES[0];
    const block = restartBlock(fileText(entry.file));
    expect(block).not.toBe('');

    const command = blockScalar(keyBlock(block, 'bind_prior_lineage'), 'command');
    expect(command).not.toBe('');
    expect(command).toContain('error.code !== "ENOENT"');
    expect(keyBlock(block, 'bind_prior_lineage')).toContain(
      'on_fail: "Halt with STATUS=FAIL. The old config is unreadable, so repair or archive the packet by hand."',
    );
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. COMPLETED-RUN EXTENSION
// ───────────────────────────────────────────────────────────────────

// An extension reopens a finished run in place. These cases run the workflow's own
// extension, duration-check and snapshot commands against a run the gateway opened,
// so the budgets they assert are the ones a live run would get.

function stepCommand(file: string, name: string): string {
  return blockScalar(phaseStep(fileText(file), name), 'command');
}

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

type JsonObject = Record<string, unknown>;

// The extension cases read a few fields of the config and the registry, so a
// caller that reads a nested field names the shape it expects.
function readJson<T = JsonObject>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function stateRows(stateLog: string): JsonObject[] {
  return readFileSync(stateLog, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as JsonObject);
}

interface ExtensionRun {
  readonly dir: string;
  readonly config: string;
  readonly stateLog: string;
}

function openResearchRun(sessionId: string): ExtensionRun {
  const dir = join(makeTempDir('extend-research-'), 'research');
  mkdirSync(dir, { recursive: true });
  const config = join(dir, 'deep-research-config.json');
  const stateLog = join(dir, 'deep-research-state.jsonl');
  writeFileSync(config, JSON.stringify({
    topic: 'Extend a completed research run',
    maxIterations: 10,
    maxDurationMinutes: 120,
    convergenceThreshold: 0.05,
    antiConvergence: { minIterations: 1, convergenceMode: 'default', stopPolicy: 'convergence' },
    stopPolicy: 'convergence',
    specFolder: 'specs/test-research-extension',
    executionMode: 'auto',
    executor: { kind: 'native', model: null, reasoningEffort: null },
    createdAt: minutesAgo(300),
    status: 'initialized',
    lineage: { sessionId, parentSessionId: null, lineageMode: 'new', generation: 1, continuedFromRun: null },
  }));
  const init = runShell(render(stepCommand('deep-research.yaml', 'step_create_state_log'), {
    '{state_paths.config}': config,
    '{state_paths.state_log}': stateLog,
  }));
  expect(init.status, String(init.stdout) + String(init.stderr)).toBe(0);
  return { dir, config, stateLog };
}

function appendResearchIteration(run: ExtensionRun, sessionId: string, iteration: number, status: string): void {
  const eventPath = join(run.dir, '..', `iteration-${iteration}.json`);
  writeFileSync(eventPath, JSON.stringify({
    type: 'iteration',
    schemaVersion: 1,
    iteration,
    run: iteration,
    status,
    focus: `question ${iteration}`,
    newInfoRatio: 0.4,
    ruledOut: [],
    sessionId,
    lineageId: sessionId,
  }));
  const result = spawnSync(process.execPath, [
    GATEWAY, '--mode', 'research', '--run-directory', run.dir, '--event-json', eventPath,
  ], { cwd: REPO_ROOT, encoding: 'utf8' });
  expect(result.status, String(result.stdout) + String(result.stderr)).toBe(0);
}

function markComplete(config: string): void {
  writeFileSync(config, JSON.stringify({ ...readJson(config), status: 'complete' }));
}

function extendResearch(run: ExtensionRun, extend: string, extendMinutes = ''): ReturnType<typeof spawnSync> {
  return runShell(render(stepCommand('deep-research.yaml', 'step_extend_completed_run'), {
    '{state_paths.config}': run.config,
    '{state_paths.state_log}': run.stateLog,
    '{state_paths.packet_dir}': run.dir,
    '{extend}': extend,
    '{extend_minutes}': extendMinutes,
  }));
}

function durationCheck(file: string, config: string): Record<string, unknown> {
  const result = runShell(render(stepCommand(file, 'step_check_max_duration'), {
    '{state_paths.config}': config,
  }));
  expect(result.status, String(result.stderr)).toBe(0);
  return lastJsonLine(result.stdout);
}

function appendReviewIteration(dir: string, run: number, runValue: number | string = run): void {
  const eventPath = join(dir, '..', `iteration-${run}.json`);
  writeFileSync(eventPath, JSON.stringify({
    type: 'iteration',
    iteration: run,
    mode: 'review',
    target_agent: 'deep-review',
    agent_definition_loaded: true,
    resolved_route: 'Resolved route: mode=review target_agent=deep-review',
    run: runValue,
    status: 'complete',
    focus: 'correctness',
    dimensions: ['correctness'],
    filesReviewed: ['scripts/example.cjs:1'],
    findingsCount: 0,
    findingsSummary: { P0: 0, P1: 0, P2: 0 },
    findingsNew: [],
    findingDetails: [],
    traceabilityChecks: {},
    newFindingsRatio: 0,
    sessionId: '2026-11-17T00:00:00Z',
    generation: 1,
    lineageMode: 'new',
    timestamp: '2026-11-17T00:40:00Z',
    durationMs: 60000,
  }));
  const result = spawnSync(process.execPath, [
    GATEWAY, '--mode', 'review', '--run-directory', dir, '--event-json', eventPath,
  ], { cwd: REPO_ROOT, encoding: 'utf8' });
  expect(result.status, String(result.stdout) + String(result.stderr)).toBe(0);
}

describe('completed-run extension', () => {
  for (const { label, file } of FILES) {
    it(`${label} binds --extend and --extend-minutes beside lineage_mode`, () => {
      const presentation = fileText(`deep-${label}-presentation.txt`);
      expect(presentation).toContain('--extend=N -> extend = N, lineage_mode = completed-continue');
      expect(presentation).toContain('--extend-minutes=M -> extend_minutes = M');
      expect(presentation).toContain('| `extend` |');
      const command = readFileSync(resolve(COMMANDS_ROOT, `${label}.md`), 'utf8');
      expect(command).toContain('| `--extend` |');
      expect(command).toContain('| `--extend-minutes` |');
      expect(phaseStep(fileText(file), 'step_preflight_contract')).toContain('extend_values:');
    });

    it(`${label} refuses --extend with fan-out before any lineage spawns`, () => {
      const text = fileText(file);
      const lifecycleAt = text.indexOf('\n  step_apply_lifecycle_request:\n');
      const guardAt = text.indexOf('\n  step_reject_extend_with_fanout:\n');
      const spawnAt = text.indexOf('\n  step_fanout_spawn:\n');
      expect(lifecycleAt).toBeGreaterThan(-1);
      expect(guardAt).toBeGreaterThan(lifecycleAt);
      expect(spawnAt).toBeGreaterThan(guardAt);
      const guard = topLevelStep(text, 'step_reject_extend_with_fanout');
      expect(guard).toContain('skip_when: "lineage_mode != \'completed-continue\' or config.fanout is absent"');
      expect(guard).toContain('halt: true');
      expect(guard).toContain('Usage error (extend-with-fanout)');
    });

    it(`${label} extends under the lock, before classification, and resumes without a resumed row`, () => {
      const text = fileText(file);
      const lockAt = text.indexOf('\n      step_acquire_lock:\n');
      const extendAt = text.indexOf('\n      step_extend_completed_run:\n');
      const classifyAt = text.indexOf('\n      step_classify_session:\n');
      expect(lockAt).toBeGreaterThan(-1);
      expect(extendAt).toBeGreaterThan(lockAt);
      expect(classifyAt).toBeGreaterThan(extendAt);
      const classify = phaseStep(text, 'step_classify_session');
      expect(classify).toContain('extension_rule:');
      expect(keyBlock(classify, 'on_resume')).toContain('extension_override:');
      expect(keyBlock(classify, 'on_resume_choice')).toContain('extension_override:');
    });
  }

  it('research: a run stopped at 7 of 10 extended by 3 is capped at 10, and the budget starts after the time spent', () => {
    const sessionId = 'extend-research-run';
    const run = openResearchRun(sessionId);
    for (let iteration = 1; iteration <= 7; iteration += 1) {
      appendResearchIteration(run, sessionId, iteration, iteration === 7 ? 'error' : 'complete');
    }
    markComplete(run.config);
    const before = readJson(run.config);

    // The old budget is spent: 300 minutes since createdAt against 120 allowed.
    expect(durationCheck('deep-research.yaml', run.config)).toMatchObject({ reached: true });

    const result = extendResearch(run, '3');
    expect(result.status, String(result.stdout) + String(result.stderr)).toBe(0);
    expect(lastJsonLine(result.stdout)).toMatchObject({ continuedFromRun: 7, newMaxIterations: 10 });
    // The extension never writes the stop policy or convergence mode, so only an
    // inbox question can keep a converged run going.
    expect(lastJsonLine(result.stdout).warning).toContain('all_questions_answered');
    expect(lastJsonLine(result.stdout).warning).not.toContain('Pass --convergence-mode=off');
    expect(lastJsonLine(result.stdout).warning).toContain('keeps the stop policy and convergence mode it was created with');

    const after = readJson(run.config);
    expect(after).toMatchObject({ status: 'initialized', maxIterations: 10 });
    expect(after.createdAt).toBe(before.createdAt);
    expect(after.lineage).toMatchObject({ lineageMode: 'completed-continue', continuedFromRun: 7, sessionId, generation: 1 });
    // max(120 prior, about 300 elapsed) + 120 default: the first new iteration is inside the budget.
    expect(after.maxDurationMinutes).toBeGreaterThanOrEqual(420);
    expect(durationCheck('deep-research.yaml', run.config)).toMatchObject({ reached: false });

    const extended = stateRows(run.stateLog).filter((row) => row.event === 'extended');
    expect(extended).toHaveLength(1);
    expect(extended[0]).toMatchObject({
      lineageMode: 'completed-continue',
      continuedFromRun: 7,
      extension: { addedIterations: 3, priorMaxIterations: 10, newMaxIterations: 10, priorMaxDurationMinutes: 120 },
    });
  });

  it('research: a second extension of the same generation gets its own snapshot and event', () => {
    const sessionId = 'extend-research-twice';
    const run = openResearchRun(sessionId);
    const snapshot = (continuedFromRun: string) => runShell(render(
      stepCommand('deep-research.yaml', 'step_snapshot_extended_synthesis'),
      {
        '{state_paths.config}': run.config,
        '{state_paths.packet_dir}': run.dir,
        '{state_paths.research_output}': join(run.dir, 'research.md'),
        '{continued_from_run}': continuedFromRun,
      },
    ));
    for (let iteration = 1; iteration <= 2; iteration += 1) appendResearchIteration(run, sessionId, iteration, 'complete');
    markComplete(run.config);
    writeFileSync(join(run.dir, 'research.md'), '# First synthesis\n');
    expect(extendResearch(run, '1').status).toBe(0);
    expect(snapshot('2').status).toBe(0);

    appendResearchIteration(run, sessionId, 3, 'complete');
    markComplete(run.config);
    writeFileSync(join(run.dir, 'research.md'), '# Second synthesis\n');
    const second = extendResearch(run, '2');
    expect(second.status, String(second.stderr)).toBe(0);
    expect(readJson(run.config)).toMatchObject({ maxIterations: 5 });
    expect(snapshot('3').status).toBe(0);

    expect(readFileSync(join(run.dir, 'synthesis-v1-r2.md'), 'utf8')).toBe('# First synthesis\n');
    expect(readFileSync(join(run.dir, 'synthesis-v1-r3.md'), 'utf8')).toBe('# Second synthesis\n');
    // A snapshot that already exists is never overwritten.
    expect(snapshot('3').status).not.toBe(0);
    expect(stateRows(run.stateLog).filter((row) => row.event === 'extended')).toHaveLength(2);
  });

  it('research: --extend refuses a run that is not complete and leaves its config untouched', () => {
    const sessionId = 'extend-research-unfinished';
    const run = openResearchRun(sessionId);
    appendResearchIteration(run, sessionId, 1, 'complete');
    const before = readFileSync(run.config, 'utf8');
    const result = extendResearch(run, '3');
    expect(result.status).toBe(2);
    expect(String(result.stderr)).toContain('--extend needs a completed run');
    expect(readFileSync(run.config, 'utf8')).toBe(before);
    expect(stateRows(run.stateLog).some((row) => row.event === 'extended')).toBe(false);
  });

  it('research: --extend and --extend-minutes refuse anything but a positive integer', () => {
    const sessionId = 'extend-research-invalid';
    const run = openResearchRun(sessionId);
    appendResearchIteration(run, sessionId, 1, 'complete');
    markComplete(run.config);
    const before = readFileSync(run.config, 'utf8');
    for (const [extend, minutes, flag] of [
      ['0', '', '--extend '], ['-2', '', '--extend '], ['abc', '', '--extend '], ['1.5', '', '--extend '],
      ['2', '0', '--extend-minutes'], ['2', 'ten', '--extend-minutes'],
    ]) {
      const result = extendResearch(run, extend, minutes);
      expect(result.status, `${extend}/${minutes}`).toBe(2);
      expect(String(result.stderr)).toContain(`${flag.trim()} needs a positive integer`);
    }
    expect(readFileSync(run.config, 'utf8')).toBe(before);
    expect(stateRows(run.stateLog).some((row) => row.event === 'extended')).toBe(false);
  });

  // Only a refused flag or an unfinished run is a usage error. A config the
  // script cannot parse is a failure, so it must not reach the usage branch.
  it.each(['deep-research.yaml', 'deep-review.yaml'])('%s: an unreadable config fails the extension without a usage-error exit', (file) => {
    const dir = makeTempDir('extend-broken-');
    const config = join(dir, 'config.json');
    writeFileSync(config, '{ not json');
    const result = runShell(render(stepCommand(file, 'step_extend_completed_run'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': join(dir, 'state.jsonl'),
      '{state_paths.packet_dir}': dir,
      '{extend}': '3',
      '{extend_minutes}': '',
    }));
    expect(result.status, String(result.stderr)).toBe(1);
    expect(readFileSync(config, 'utf8')).toBe('{ not json');
  });

  it('research: --extend-minutes replaces the default added minutes', () => {
    const sessionId = 'extend-research-minutes';
    const run = openResearchRun(sessionId);
    appendResearchIteration(run, sessionId, 1, 'complete');
    markComplete(run.config);
    expect(extendResearch(run, '1', '30').status).toBe(0);
    const after = readJson(run.config);
    expect(after.maxDurationMinutes).toBeGreaterThanOrEqual(330);
    expect(after.maxDurationMinutes).toBeLessThan(340);
  });

  // Config creation writes the stop policy at the top level only, so the
  // re-stop warning must read it there or a max-iterations run is warned too.
  it('research: a max-iterations run gets no re-stop warning', () => {
    const sessionId = 'extend-research-max-iterations';
    const run = openResearchRun(sessionId);
    appendResearchIteration(run, sessionId, 1, 'complete');
    const written = readJson(run.config);
    writeFileSync(run.config, JSON.stringify({
      ...written,
      status: 'complete',
      stopPolicy: 'max-iterations',
      antiConvergence: { minIterations: 1, convergenceMode: 'default' },
    }));
    const result = extendResearch(run, '1');
    expect(result.status, String(result.stdout) + String(result.stderr)).toBe(0);
    expect(lastJsonLine(result.stdout).warning).toBeNull();
  });

  // The review prompt pack has the leaf write the run id string in `run`, so the
  // extension must count runs by the integer iteration, as the state reader does.
  it('review: runs are counted by iteration when the leaf writes a run id string', () => {
    const dir = join(makeTempDir('extend-review-run-id-'), 'review');
    mkdirSync(dir, { recursive: true });
    const config = join(dir, 'deep-review-config.json');
    const stateLog = join(dir, 'deep-review-state.jsonl');
    writeFileSync(config, JSON.stringify({
      topic: 'Review: the extension',
      mode: 'review',
      sessionId: '2026-11-17T00:00:00Z',
      parentSessionId: null,
      lineageMode: 'new',
      generation: 1,
      reviewTarget: 'the extension',
      reviewTargetType: 'files',
      reviewDimensions: ['correctness'],
      maxIterations: 2,
      maxDurationMinutes: 120,
      createdAt: minutesAgo(30),
      antiConvergence: { convergenceMode: 'default', divergent: {}, stopPolicy: 'convergence' },
      stopPolicy: 'convergence',
    }));
    const init = runShell(render(stepCommand('deep-review.yaml', 'step_create_state_log'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': stateLog,
    }));
    expect(init.status, String(init.stdout) + String(init.stderr)).toBe(0);
    for (let run = 1; run <= 2; run += 1) appendReviewIteration(dir, run, '2026-11-17T00:00:00Z');
    writeFileSync(config, JSON.stringify({ ...readJson(config), status: 'complete' }));

    const result = runShell(render(stepCommand('deep-review.yaml', 'step_extend_completed_run'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': stateLog,
      '{extend}': '3',
      '{extend_minutes}': '',
    }));
    expect(result.status, String(result.stdout) + String(result.stderr)).toBe(0);
    expect(readJson(config)).toMatchObject({ maxIterations: 5, continuedFromRun: 2 });
  });

  it('review: an extension raises the cap from the counted runs and the budget from the time spent', () => {
    const dir = join(makeTempDir('extend-review-'), 'review');
    mkdirSync(dir, { recursive: true });
    const config = join(dir, 'deep-review-config.json');
    const stateLog = join(dir, 'deep-review-state.jsonl');
    writeFileSync(config, JSON.stringify({
      topic: 'Review: the extension',
      mode: 'review',
      sessionId: '2026-11-17T00:00:00Z',
      parentSessionId: null,
      lineageMode: 'new',
      generation: 1,
      reviewTarget: 'the extension',
      reviewTargetType: 'files',
      reviewDimensions: ['correctness', 'security'],
      maxIterations: 4,
      maxDurationMinutes: 120,
      createdAt: minutesAgo(300),
      antiConvergence: { convergenceMode: 'default', divergent: {}, stopPolicy: 'convergence' },
      stopPolicy: 'convergence',
    }));
    const init = runShell(render(stepCommand('deep-review.yaml', 'step_create_state_log'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': stateLog,
    }));
    expect(init.status, String(init.stdout) + String(init.stderr)).toBe(0);
    // The extension counts the iteration rows the log holds when it runs.
    for (let run = 1; run <= 4; run += 1) appendReviewIteration(dir, run);
    writeFileSync(config, JSON.stringify({ ...readJson(config), status: 'complete' }));
    const before = readJson(config);

    const result = runShell(render(stepCommand('deep-review.yaml', 'step_extend_completed_run'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': stateLog,
      '{extend}': '3',
      '{extend_minutes}': '',
    }));
    expect(result.status, String(result.stdout) + String(result.stderr)).toBe(0);
    const after = readJson(config);
    expect(after).toMatchObject({
      status: 'initialized',
      maxIterations: 7,
      lineageMode: 'completed-continue',
      continuedFromRun: 4,
    });
    expect(after.createdAt).toBe(before.createdAt);
    expect(after.maxDurationMinutes).toBeGreaterThanOrEqual(420);
    expect(durationCheck('deep-review.yaml', config)).toMatchObject({ reached: false });
    // The extension never writes the stop policy or convergence mode, so the warning
    // must not advise passing a flag beside --extend.
    expect(lastJsonLine(result.stdout).warning).toContain('all_dimensions_clean');
    expect(lastJsonLine(result.stdout).warning).not.toContain('Pass --convergence-mode=off');
    expect(lastJsonLine(result.stdout).warning).toContain('keeps the stop policy and convergence mode it was created with');
    expect(stateRows(stateLog).some((row) => row.event === 'extended' && row.continuedFromRun === 4)).toBe(true);

    const report = join(dir, 'review-report.md');
    const snapshot = (continuedFromRun: string) => runShell(render(
      stepCommand('deep-review.yaml', 'step_snapshot_extended_review_report'),
      {
        '{state_paths.config}': config,
        '{state_paths.packet_dir}': dir,
        '{state_paths.review_output}': report,
        '{continued_from_run}': continuedFromRun,
      },
    ));
    writeFileSync(report, '# First report\n');
    expect(snapshot('4').status).toBe(0);

    // A second extension of the same generation keeps its own snapshot.
    appendReviewIteration(dir, 5);
    writeFileSync(config, JSON.stringify({ ...readJson(config), status: 'complete' }));
    writeFileSync(report, '# Second report\n');
    const second = runShell(render(stepCommand('deep-review.yaml', 'step_extend_completed_run'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': stateLog,
      '{extend}': '1',
      '{extend_minutes}': '',
    }));
    expect(second.status, String(second.stderr)).toBe(0);
    expect(readJson(config)).toMatchObject({ maxIterations: 6, continuedFromRun: 5 });
    expect(snapshot('5').status).toBe(0);
    expect(readFileSync(join(dir, 'review-report-v1-r4.md'), 'utf8')).toBe('# First report\n');
    expect(readFileSync(join(dir, 'review-report-v1-r5.md'), 'utf8')).toBe('# Second report\n');
    expect(snapshot('5').status).not.toBe(0);
    expect(stateRows(stateLog).filter((row) => row.event === 'extended')).toHaveLength(2);
  });

  it('review: a max-iterations run gets no re-stop warning', () => {
    const dir = join(makeTempDir('extend-review-policy-'), 'review');
    mkdirSync(dir, { recursive: true });
    const config = join(dir, 'deep-review-config.json');
    const stateLog = join(dir, 'deep-review-state.jsonl');
    // The shape config creation writes: stopPolicy at the top level only.
    writeFileSync(config, JSON.stringify({
      topic: 'Review: the stop policy read',
      mode: 'review',
      sessionId: '2026-11-17T00:00:00Z',
      parentSessionId: null,
      lineageMode: 'new',
      generation: 1,
      reviewTarget: 'the extension',
      reviewTargetType: 'files',
      reviewDimensions: ['correctness'],
      maxIterations: 2,
      maxDurationMinutes: 120,
      createdAt: minutesAgo(10),
      antiConvergence: { convergenceMode: 'default', divergent: {} },
      stopPolicy: 'max-iterations',
    }));
    const init = runShell(render(stepCommand('deep-review.yaml', 'step_create_state_log'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': stateLog,
    }));
    expect(init.status, String(init.stdout) + String(init.stderr)).toBe(0);
    for (let run = 1; run <= 2; run += 1) appendReviewIteration(dir, run);
    writeFileSync(config, JSON.stringify({ ...readJson(config), status: 'complete' }));
    const result = runShell(render(stepCommand('deep-review.yaml', 'step_extend_completed_run'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': stateLog,
      '{extend}': '1',
      '{extend_minutes}': '',
    }));
    expect(result.status, String(result.stdout) + String(result.stderr)).toBe(0);
    expect(lastJsonLine(result.stdout).warning).toBeNull();
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. EXPANSIVE FRONTIER GRAPH MIRROR
// ───────────────────────────────────────────────────────────────────

// The mirror step hands the frontier projection to the shared graph upsert,
// which parses one JSON value. A node store with more than one live node is
// the shape every real run has, so this case renders the step and runs both
// of its commands against a temp graph database.

describe('expansive frontier graph mirror', () => {
  function frontierRow(nodeId: string, parentId: string, depth: number, status: string): Record<string, unknown> {
    const question = `What does frontier node ${nodeId} settle?`;
    return {
      nodeId,
      parentId,
      depth,
      scope: 'runtime/lib',
      question,
      status,
      reason: status === 'exhausted' ? 'budget' : null,
      iteration: 1,
      dedupeKey: question.toLowerCase(),
    };
  }

  it('upserts every node and edge of a multi-node frontier', () => {
    const artifactDir = join(makeTempDir('frontier-graph-mirror-'), 'research');
    mkdirSync(artifactDir, { recursive: true });
    const dbDir = makeTempDir('frontier-graph-db-');
    writeFileSync(join(artifactDir, 'frontier-nodes.jsonl'), [
      frontierRow('F-1-001', 'root', 1, 'open'),
      frontierRow('F-2-002', 'F-1-001', 2, 'exhausted'),
    ].map((row) => JSON.stringify(row)).join('\n') + '\n');

    const command = render(stepCommand('deep-research.yaml', 'step_frontier_graph_upsert'), {
      '{artifact_dir}': artifactDir,
      '{spec_folder}': 'specs/test-frontier-graph-mirror',
      '{config.lineage.sessionId}': 'frontier-graph-mirror-session',
    });
    expect(command).toContain('frontier-admit.cjs graph');

    const result = runShell(`export DEEP_LOOP_COVERAGE_DB_DIR=${JSON.stringify(dbDir)}\nset -e\n${command}`);
    expect(result.status, String(result.stdout) + String(result.stderr)).toBe(0);
    const upserted = lastJsonLine(result.stdout) as { status?: string; data?: { insertedNodes?: number; insertedEdges?: number } };
    expect(upserted.status).toBe('ok');
    // One QUESTION, one closed CLAIM and the DERIVED_FROM edge between them.
    expect(upserted.data?.insertedNodes).toBe(2);
    expect(upserted.data?.insertedEdges).toBe(1);
  });

  // The loop renders the frontier block from the strategy's next focus, which
  // only a reduce writes. Without a reduce between the seed and the loop, the
  // first iteration would run with no frontier block at all.
  it('gives iteration 1 a frontier focus and block once the seed is reduced', () => {
    const specFolder = join(makeTempDir('frontier-seed-reduce-'), 'spec');
    const artifactDir = join(specFolder, 'research');
    mkdirSync(artifactDir, { recursive: true });
    writeFileSync(join(specFolder, 'spec.md'), '# Seed reduce\n');
    writeFileSync(join(artifactDir, 'deep-research-config.json'), JSON.stringify({
      topic: 'How does frontier admission work?',
      maxIterations: 10,
      createdAt: '2026-11-18T00:00:00.000Z',
      status: 'initialized',
      antiConvergence: { minIterations: 3, convergenceMode: 'default', depthMode: 'expansive' },
      expansiveDepth: { maxDepth: 3, maxChildrenPerNode: 6, budgetSplit: { depth1: 0.5, depth2: 0.35, depth3: 0.15 } },
      lineage: { sessionId: 'seed-reduce', parentSessionId: null, lineageMode: 'new', generation: 1, continuedFromRun: null },
      resource_map: { emit: false },
    }));
    writeFileSync(join(artifactDir, 'deep-research-state.jsonl'), `${JSON.stringify({
      type: 'config',
      topic: 'How does frontier admission work?',
      maxIterations: 10,
      createdAt: '2026-11-18T00:00:00.000Z',
    })}\n`);
    writeFileSync(
      join(artifactDir, 'deep-research-strategy.md'),
      readFileSync(resolve(SKILLS_ROOT, 'skills', 'system-deep-loop', 'deep-research', 'assets', 'deep-research-strategy.md'), 'utf8'),
    );
    writeFileSync(join(artifactDir, 'frontier-seed.json'), JSON.stringify([
      { question: 'Which module owns frontier admission?', scope: 'runtime/scripts', evidence: 'runtime/scripts/frontier-admit.cjs' },
      { question: 'Which caps does frontier admission read?', scope: 'runtime/config', evidence: 'runtime/config' },
    ]));
    const seed = spawnSync(process.execPath, [
      resolve(RUNTIME_ROOT, 'scripts', 'frontier-admit.cjs'),
      'seed',
      '--artifact-dir',
      artifactDir,
      '--iteration',
      '0',
      '--input',
      join(artifactDir, 'frontier-seed.json'),
    ], { encoding: 'utf8' });
    expect(seed.status, String(seed.stderr)).toBe(0);
    expect(existsSync(join(artifactDir, 'frontier-nodes.jsonl'))).toBe(true);

    const reduceCommand = render(stepCommand('deep-research.yaml', 'step_frontier_reduce_seed'), {
      '{spec_folder}': specFolder,
      '{reducer_artifact_arg}': '',
    });
    expect(reduceCommand).toContain('reduce-state.cjs');
    const reduce = runShell(reduceCommand);
    expect(reduce.status, String(reduce.stderr)).toBe(0);

    const strategy = readFileSync(join(artifactDir, 'deep-research-strategy.md'), 'utf8');
    const anchorBody = /<!-- ANCHOR:next-focus -->([\s\S]*?)<!-- \/ANCHOR:next-focus -->/u.exec(strategy)?.[1] ?? '';
    const nextFocus = anchorBody.split('\n').map((line) => line.trim()).find((line) => line && !line.startsWith('#')) ?? '';
    expect(nextFocus).toMatch(/^Frontier node F-1-001 \(depth 1, scope runtime\/scripts\): /u);

    const block = spawnSync(process.execPath, [
      resolve(RUNTIME_ROOT, 'scripts', 'frontier-admit.cjs'),
      'block',
      '--artifact-dir',
      artifactDir,
      '--focus',
      nextFocus,
    ], { encoding: 'utf8' });
    expect(block.status, String(block.stderr)).toBe(0);
    expect(String(block.stdout)).toContain('Current node: F-1-001 at depth 1');
  });

  // The review loop binds its frontier node and dimension from the findings
  // registry, and the init step that creates that registry runs after the seed
  // and writes no frontier. Only a reduce projects the seeded nodes into it, so
  // without one between the seed and the loop, iteration 1 has no frontier node.
  it('gives review iteration 1 a frontier node and block once the seed is reduced', () => {
    const specFolder = join(makeTempDir('review-frontier-seed-reduce-'), 'spec');
    const artifactDir = join(specFolder, 'review');
    mkdirSync(artifactDir, { recursive: true });
    writeFileSync(join(specFolder, 'spec.md'), '# Review seed reduce\n');
    const config = join(artifactDir, 'deep-review-config.json');
    const stateLog = join(artifactDir, 'deep-review-state.jsonl');
    const registryPath = join(artifactDir, 'deep-review-findings-registry.json');
    writeFileSync(config, JSON.stringify({
      topic: 'Review: frontier admission',
      mode: 'review',
      sessionId: 'review-seed-reduce',
      parentSessionId: null,
      lineageMode: 'new',
      generation: 1,
      reviewTarget: 'runtime',
      reviewTargetType: 'files',
      reviewDimensions: ['correctness', 'security', 'traceability', 'maintainability'],
      maxIterations: 10,
      createdAt: '2026-11-18T00:00:00.000Z',
      status: 'initialized',
      antiConvergence: { convergenceMode: 'default', depthMode: 'expansive', divergent: {}, stopPolicy: 'convergence' },
      expansiveDepth: { maxDepth: 3, maxChildrenPerNode: 6 },
      stopPolicy: 'convergence',
    }));
    const init = runShell(render(stepCommand('deep-review.yaml', 'step_create_state_log'), {
      '{state_paths.config}': config,
      '{state_paths.state_log}': stateLog,
    }));
    expect(init.status, String(init.stdout) + String(init.stderr)).toBe(0);

    writeFileSync(join(artifactDir, 'frontier-seed.json'), JSON.stringify([
      { question: 'Does frontier admission prune out-of-target scopes?', scope: 'runtime/scripts', evidence: 'runtime/scripts/frontier-admit.cjs' },
      { question: 'Does the reducer project the frontier into the registry?', scope: 'runtime/lib', evidence: 'runtime/scripts/reduce-state.cjs' },
    ]));
    const seed = runShell(render(phaseStep(fileText('deep-review.yaml'), 'step_frontier_seed').match(/command: '(.*)'/u)?.[1] ?? '', {
      '{artifact_dir}': artifactDir,
    }));
    expect(seed.status, String(seed.stderr)).toBe(0);
    expect(existsSync(join(artifactDir, 'frontier-nodes.jsonl'))).toBe(true);

    // The registry and strategy the init phase writes after the seed.
    const registryContent = phaseStep(fileText('deep-review.yaml'), 'step_create_findings_registry').match(/content: '(.*)'/u)?.[1] ?? '';
    writeFileSync(registryPath, render(registryContent, {
      '{session_id_init}': 'review-seed-reduce',
      '{generation_init}': '1',
      '{lineage_mode_init}': 'new',
      '{dimension_coverage_custom_seed}': '',
    }));
    expect(readJson(registryPath).frontier).toBeUndefined();
    writeFileSync(
      join(artifactDir, 'deep-review-strategy.md'),
      readFileSync(resolve(SKILLS_ROOT, 'skills', 'system-deep-loop', 'deep-review', 'assets', 'deep-review-strategy.md'), 'utf8'),
    );

    const reduceCommand = render(stepCommand('deep-review.yaml', 'step_frontier_reduce_seed'), {
      '{spec_folder}': specFolder,
      '{reducer_artifact_arg}': '',
    });
    expect(reduceCommand).toContain('reduce-state.cjs');
    const reduce = runShell(reduceCommand);
    expect(reduce.status, String(reduce.stderr)).toBe(0);

    const frontier = readJson<{ frontier?: { activeNodeId?: string; activeNextDimension?: string } }>(registryPath)
      .frontier;
    const activeNodeId = frontier?.activeNodeId ?? '';
    const activeNextDimension = frontier?.activeNextDimension ?? '';
    expect(activeNodeId).toBe('F-1-001');
    expect(typeof frontier?.activeNextDimension).toBe('string');
    expect(activeNextDimension).not.toBe('');

    const block = spawnSync(process.execPath, [
      resolve(RUNTIME_ROOT, 'scripts', 'frontier-admit.cjs'),
      'block',
      '--target',
      'review',
      '--artifact-dir',
      artifactDir,
      '--node-id',
      activeNodeId,
      '--dimension',
      activeNextDimension,
    ], { encoding: 'utf8' });
    expect(block.status, String(block.stderr)).toBe(0);
    expect(String(block.stdout)).toContain('F-1-001');
  });
});
