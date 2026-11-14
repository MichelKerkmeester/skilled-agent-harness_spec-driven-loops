// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Restart Lifecycle Contract
// ───────────────────────────────────────────────────────────────────

// The restart path is text in four workflow assets: a prior lineage is read
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
  readonly mode: 'auto' | 'confirm';
}

const FILES: readonly WorkflowFile[] = [
  { label: 'research auto', file: 'deep-research-auto.yaml', kind: 'research', mode: 'auto' },
  { label: 'research confirm', file: 'deep-research-confirm.yaml', kind: 'research', mode: 'confirm' },
  { label: 'review auto', file: 'deep-review-auto.yaml', kind: 'review', mode: 'auto' },
  { label: 'review confirm', file: 'deep-review-confirm.yaml', kind: 'review', mode: 'confirm' },
];
const RESEARCH_FILES = FILES.filter((entry) => entry.kind === 'research');
const AUTO_FILES = FILES.filter((entry) => entry.mode === 'auto');

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

function restartBlock(entry: WorkflowFile, text: string): string {
  return entry.mode === 'auto'
    ? topLevelStep(text, 'step_apply_lifecycle_request')
    : keyBlock(phaseStep(text, 'step_classify_session'), 'on_restart_choice');
}

function autoArchiveCommand(): string {
  return archiveCommand(topLevelStep(fileText('deep-research-auto.yaml'), 'step_apply_lifecycle_request'));
}

function bindCommand(entry: WorkflowFile): string {
  return blockScalar(keyBlock(restartBlock(entry, fileText(entry.file)), 'bind_prior_lineage'), 'command');
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
    it(`research flags: ${label} preflight requires lineage_mode`, () => {
      const preflight = phaseStep(fileText(file), 'step_preflight_contract');
      expect(preflight).not.toBe('');
      const requiredLine = preflight
        .split('\n')
        .find((line) => line.includes('required_values_present:')) ?? '';
      expect(requiredLine).not.toBe('');
      expect(requiredLine).toContain('lineage_mode');
    });
  }

  for (const { label, file } of AUTO_FILES) {
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

      if (entry.mode === 'confirm') {
        const restartChoice = keyBlock(phaseStep(text, 'step_classify_session'), 'on_restart_choice');
        expect(restartChoice).not.toBe('');
        expect(restartChoice).toContain('! -name "$(basename "{state_paths.lock_file}")"');
        expect(restartChoice).toContain(
          'mkdir -p "{state_paths.prompt_dir}" "{state_paths.iteration_dir}" "{state_paths.delta_dir}"',
        );
        expect(restartChoice).toContain('on_fail: "Halt with STATUS=FAIL through step_release_lock');
      }
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
      keyBlock(phaseStep(fileText('deep-research-confirm.yaml'), 'step_classify_session'), 'on_restart_choice'),
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
      const block = restartBlock(entry, fileText(entry.file));
      expect(block).not.toBe('');

      const bindAt = block.indexOf('bind_prior_lineage:');
      expect(bindAt).not.toBe(-1);
      const archiveMarker = entry.mode === 'auto'
        ? 'mv "{state_paths.packet_dir}"'
        : 'find "{state_paths.packet_dir}"';
      const archiveAt = block.indexOf(archiveMarker);
      expect(archiveAt).not.toBe(-1);
      expect(bindAt).toBeLessThan(archiveAt);

      const command = blockScalar(keyBlock(block, 'bind_prior_lineage'), 'command');
      expect(command).not.toBe('');

      const dir = makeTempDir('workflow-restart-');
      const configPath = join(dir, 'deep-research-config.json');
      const stateLogPath = join(dir, 'deep-research-state.jsonl');
      const prior = entry.kind === 'research'
        ? { lineage: { sessionId: 'sess-old', generation: 2 } }
        : { sessionId: 'sess-old', generation: 2 };
      writeFileSync(configPath, JSON.stringify(prior));

      const run = runShell(render(command, {
        '{state_paths.config}': configPath,
        '{state_paths.state_log}': stateLogPath,
      }));
      expect(run.status, String(run.stdout) + String(run.stderr)).toBe(0);
      const binding = lastJsonLine(run.stdout);
      expect(binding).toMatchObject({ priorSessionId: 'sess-old', priorGeneration: 2 });
      expect(binding.priorTailDigest).toMatch(/^[0-9a-f]{64}$/);
    });
  }

  it('restart projection: the gateway records run_restarted after run_initialized', () => {
    const text = fileText('deep-research-auto.yaml');
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

  it('restart projection: the ledger table marks run_restarted spoken by both research workflows', () => {
    expect(DEEP_RESEARCH_STEM_PRODUCERS['deep_research.run_restarted']).toEqual({
      status: 'spoken',
      producers: [
        '.skilled/commands/deep/assets/deep-research-auto.yaml',
        '.skilled/commands/deep/assets/deep-research-confirm.yaml',
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
    const block = restartBlock(entry, fileText(entry.file));
    expect(block).not.toBe('');

    const command = blockScalar(keyBlock(block, 'bind_prior_lineage'), 'command');
    expect(command).not.toBe('');
    expect(command).toContain('error.code !== "ENOENT"');
    expect(keyBlock(block, 'bind_prior_lineage')).toContain(
      'on_fail: "Halt with STATUS=FAIL. The old config is unreadable, so repair or archive the packet by hand."',
    );
  });
});
