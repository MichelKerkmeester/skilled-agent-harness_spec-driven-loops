// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Graph Upsert Command Tests
// ───────────────────────────────────────────────────────────────────
//
// The graph persistence step must read this iteration's delta file: the
// state log is a gateway-refreshed projection that does not carry the
// iteration's graphEvents, so an upsert driven from the state log never
// sees a node or an edge. These tests render the step command out of both
// research workflows, point it at a scratch artifact directory, and prove
// the coverage database receives exactly what the delta file declared.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import Database from 'better-sqlite3';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const REPO_ROOT = resolve(runtimeRoot, '..', '..', '..', '..');
const DB_FILENAME = 'deep-loop-graph.sqlite';
const LOOP_TYPE = 'research';
const SPEC_FOLDER = 'specs/999-graph-upsert-fixture';
const SESSION_ID = 'session-graph-upsert-fixture';
const ITERATION = '1';

const WORKFLOW_PATHS = [
  resolve(REPO_ROOT, '.skilled', 'commands', 'deep', 'assets', 'deep-research-auto.yaml'),
  resolve(REPO_ROOT, '.skilled', 'commands', 'deep', 'assets', 'deep-research-confirm.yaml'),
] as const;

// QUESTION and FINDING are research node kinds, and ANSWERS is a research
// relation; anything outside those vocabularies is dropped by the upsert
// script and the database assertions below would fail.
const GRAPH_EVENTS = [
  { type: 'node', id: 'q-graph-upsert-1', kind: 'QUESTION', label: 'Question one' },
  { type: 'node', id: 'f-graph-upsert-1', kind: 'FINDING', label: 'Finding one' },
  { type: 'edge', id: 'e-graph-upsert-1', source: 'q-graph-upsert-1', target: 'f-graph-upsert-1', relation: 'ANSWERS' },
];

type Fixture = {
  artifactDir: string;
  deltaDir: string;
  stateLogPath: string;
  coverageDbDir: string;
  dbPath: string;
};

type CommandResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
};

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

const temporaryDirectories: string[] = [];

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const dir = temporaryDirectories.pop();
    if (!dir) continue;
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // A leaked temp directory is cleanup noise, not a test result.
    }
  }
});

function createFixture(prefix: string): Fixture {
  const root = mkdtempSync(join(tmpdir(), `deep-research-graph-upsert-${prefix}-`));
  temporaryDirectories.push(root);

  const artifactDir = join(root, 'research');
  const deltaDir = join(artifactDir, 'deltas');
  const coverageDbDir = join(root, 'coverage-db');
  mkdirSync(deltaDir, { recursive: true });
  mkdirSync(coverageDbDir, { recursive: true });

  return {
    artifactDir,
    deltaDir,
    stateLogPath: join(artifactDir, 'deep-research-state.jsonl'),
    coverageDbDir,
    dbPath: join(coverageDbDir, DB_FILENAME),
  };
}

/**
 * Pulls the `command: |` block out of one step of a workflow asset.
 */
function extractStepCommand(yamlPath: string, stepName: string): string {
  const workflow = readFileSync(yamlPath, 'utf8');
  const marker = `      ${stepName}:\n`;
  const stepStart = workflow.indexOf(marker);
  if (stepStart === -1) throw new Error(`${stepName} missing from ${yamlPath}`);

  const match = workflow
    .slice(stepStart)
    .match(/\n        command: \|\n([\s\S]*?)(?=\n        [a-zA-Z_]+:|\n      [a-zA-Z_]+:|\n  #)/);
  if (!match) throw new Error(`${stepName} command block missing from ${yamlPath}`);

  return match[1].replace(/^ {10}/gm, '').trim();
}

/**
 * Substitutes every `{dotted.token}` placeholder the step declares, failing
 * loudly when the workflow grows a token this fixture does not know. Braces
 * prefixed with `$` are JavaScript template interpolations, not tokens.
 */
function renderStepCommand(command: string, fixture: Fixture): string {
  const values: Record<string, string> = {
    'state_paths.delta_dir': fixture.deltaDir,
    'state_paths.state_log': fixture.stateLogPath,
    'current_iteration': ITERATION,
    'spec_folder': SPEC_FOLDER,
    'config.lineage.sessionId': SESSION_ID,
  };

  const unknown: string[] = [];
  const rendered = command.replace(
    /(?<!\$)\{([a-z][a-z0-9_]*(?:\.[a-zA-Z0-9_]+)*)\}/g,
    (match, token: string) => {
      const value = values[token];
      if (value === undefined) {
        unknown.push(match);
        return match;
      }
      return value;
    },
  );

  if (unknown.length > 0) throw new Error(`Unhandled step placeholders: ${unknown.join(', ')}`);
  return rendered;
}

/**
 * Runs the rendered step from the repository root with the coverage database
 * pinned to the fixture directory so the checked-in database stays untouched.
 */
function runStepCommand(command: string, fixture: Fixture): CommandResult {
  const result = spawnSync('/bin/sh', ['-c', command], {
    cwd: REPO_ROOT,
    env: { ...process.env, DEEP_LOOP_COVERAGE_DB_DIR: fixture.coverageDbDir },
    encoding: 'utf8',
  });

  return { exitCode: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

/**
 * Writes the current iteration's delta file. Omitting graphEvents models an
 * iteration that produced no graph events.
 */
function writeDeltaIteration(fixture: Fixture, graphEvents?: unknown[]): void {
  const record: Record<string, unknown> = {
    type: 'iteration',
    iteration: Number(ITERATION),
    mode: LOOP_TYPE,
    status: 'insight',
    focus: 'fixture focus',
  };
  if (graphEvents !== undefined) record.graphEvents = graphEvents;

  const deltaPath = join(fixture.deltaDir, `iter-${ITERATION.padStart(3, '0')}.jsonl`);
  writeFileSync(deltaPath, `${JSON.stringify(record)}\n`, 'utf8');
}

function openDatabase(dbPath: string) {
  return new Database(dbPath, { readonly: true, fileMustExist: true });
}

function countRows(db: ReturnType<typeof openDatabase>, table: 'coverage_nodes' | 'coverage_edges'): number {
  const row = db
    .prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE spec_folder = ? AND loop_type = ? AND session_id = ?`)
    .get(SPEC_FOLDER, LOOP_TYPE, SESSION_ID) as { count: number };
  return row.count;
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe.each(WORKFLOW_PATHS)('step_graph_upsert in %s', (workflowPath) => {
  const command = extractStepCommand(workflowPath, 'step_graph_upsert');

  it('upserts the delta file graph events into the coverage database', () => {
    const fixture = createFixture('events');
    writeDeltaIteration(fixture, GRAPH_EVENTS);

    const result = runStepCommand(renderStepCommand(command, fixture), fixture);

    expect(result.exitCode, result.stderr).toBe(0);
    const db = openDatabase(fixture.dbPath);
    try {
      expect(countRows(db, 'coverage_nodes')).toBe(2);
      expect(countRows(db, 'coverage_edges')).toBe(1);
    } finally {
      db.close();
    }
  });

  it('skips without graph events and creates no rows', () => {
    const fixture = createFixture('no-events');
    writeDeltaIteration(fixture);

    const result = runStepCommand(renderStepCommand(command, fixture), fixture);

    expect(result.exitCode, result.stderr).toBe(0);
    expect(result.stdout).toContain('skipping');
    expect(existsSync(fixture.dbPath)).toBe(false);
  });
});
