// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Graph Upsert Command Tests
// ───────────────────────────────────────────────────────────────────
//
// The graph persistence step must read this iteration's delta file: the
// state log is a gateway-refreshed projection that does not carry the
// iteration's graphEvents, so an upsert driven from the state log never
// sees a node or an edge. These tests render the step command out of both
// research workflow, point it at a scratch artifact directory, and prove
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
  resolve(REPO_ROOT, '.skilled', 'commands', 'deep', 'assets', 'deep-research.yaml'),
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
function writeDeltaIteration(
  fixture: Fixture,
  graphEvents?: unknown[],
  extra: { answeredQuestions?: string[]; rows?: Array<Record<string, unknown>> } = {},
): void {
  const record: Record<string, unknown> = {
    type: 'iteration',
    iteration: Number(ITERATION),
    mode: LOOP_TYPE,
    status: 'insight',
    focus: 'fixture focus',
  };
  if (graphEvents !== undefined) record.graphEvents = graphEvents;
  if (extra.answeredQuestions !== undefined) record.answeredQuestions = extra.answeredQuestions;

  const deltaPath = join(fixture.deltaDir, `iter-${ITERATION.padStart(3, '0')}.jsonl`);
  const lines = [record, ...(extra.rows ?? [])].map((row) => JSON.stringify(row));
  writeFileSync(deltaPath, `${lines.join('\n')}\n`, 'utf8');
}

const FRONTIER_QUESTION = 'Which module owns the stop decision?';

/**
 * Stores a frontier QUESTION node the way the frontier mirror does after an
 * earlier iteration, so this iteration's answers have a node to attach to.
 */
function seedQuestionNode(fixture: Fixture): void {
  const eventsPath = join(fixture.artifactDir, 'frontier-graph-events.json');
  writeFileSync(eventsPath, JSON.stringify([
    { type: 'node', id: 'frontier-F-1-001', kind: 'QUESTION', name: FRONTIER_QUESTION, iteration: 0 },
  ]), 'utf8');
  const result = spawnSync(process.execPath, [
    resolve(runtimeRoot, 'scripts', 'upsert.cjs'),
    '--spec-folder', SPEC_FOLDER, '--loop-type', LOOP_TYPE, '--session-id', SESSION_ID,
    '--events', eventsPath,
  ], { env: { ...process.env, DEEP_LOOP_COVERAGE_DB_DIR: fixture.coverageDbDir }, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
}

// The delta rows the prompt contract makes mandatory: a finding carries its
// text in label and its sources, and none of it is a graph event.
const FINDING_ROWS = [
  {
    type: 'finding', id: 'f-iter001-001', label: 'The stop decision lives in convergence.cjs', iteration: 1,
    sources: ['.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs', 'specs/999-graph-upsert-fixture/spec.md'],
  },
  {
    type: 'finding', id: 'f-iter001-002', label: 'The YAML only branches on the decision', iteration: 1,
    sources: ['.skilled/commands/deep/assets/deep-research.yaml', '.skilled/skills/system-deep-loop/deep-research/references/loop.md'],
  },
];

function graphBlockers(fixture: Fixture): string[] {
  const result = spawnSync(process.execPath, [
    resolve(runtimeRoot, 'scripts', 'convergence.cjs'),
    '--spec-folder', SPEC_FOLDER, '--loop-type', LOOP_TYPE, '--session-id', SESSION_ID, '--read-only',
  ], { env: { ...process.env, DEEP_LOOP_COVERAGE_DB_DIR: fixture.coverageDbDir }, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  const payload = JSON.parse(result.stdout) as { graph_blockers_json: Array<{ type: string }> };
  return payload.graph_blockers_json.map((blocker) => blocker.type);
}

function countEdges(db: ReturnType<typeof openDatabase>, relation: string): number {
  const row = db
    .prepare('SELECT COUNT(*) AS count FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND relation = ?')
    .get(SPEC_FOLDER, LOOP_TYPE, SESSION_ID, relation) as { count: number };
  return row.count;
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

  it('stores the derived quality_class on a SOURCE node and drops the leaf value', () => {
    const fixture = createFixture('source-class');
    writeDeltaIteration(fixture, [
      ...GRAPH_EVENTS,
      {
        type: 'node',
        id: 's-graph-upsert-1',
        kind: 'SOURCE',
        label: 'The upsert script',
        path: '.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs',
        metadata: { quality_class: 'primary' },
      },
    ]);

    const result = runStepCommand(renderStepCommand(command, fixture), fixture);

    expect(result.exitCode, result.stderr).toBe(0);
    const db = openDatabase(fixture.dbPath);
    try {
      const row = db
        .prepare('SELECT metadata FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?')
        .get(SPEC_FOLDER, LOOP_TYPE, SESSION_ID, 's-graph-upsert-1') as { metadata: string | null } | undefined;
      expect(row).toBeDefined();
      expect(JSON.parse(row?.metadata ?? '{}').quality_class).toBe('repo-code');
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

  // A leaf that keeps to the mandatory rows and emits no graph events must still
  // give the stop guards their question -> finding -> source chains.
  it('feeds the stop guards from finding rows and answeredQuestions', () => {
    const fixture = createFixture('finding-rows');
    seedQuestionNode(fixture);
    expect(graphBlockers(fixture)).toEqual(
      expect.arrayContaining(['source_diversity_guard', 'evidence_depth_guard', 'uncovered_questions']),
    );
    writeDeltaIteration(fixture, undefined, { answeredQuestions: [FRONTIER_QUESTION], rows: FINDING_ROWS });

    const result = runStepCommand(renderStepCommand(command, fixture), fixture);

    expect(result.exitCode, result.stderr).toBe(0);
    const db = openDatabase(fixture.dbPath);
    try {
      expect(countEdges(db, 'ANSWERS')).toBe(2);
      expect(countEdges(db, 'CITES')).toBe(4);
    } finally {
      db.close();
    }
    const blockers = graphBlockers(fixture);
    expect(blockers).not.toContain('source_diversity_guard');
    expect(blockers).not.toContain('evidence_depth_guard');
    expect(blockers).not.toContain('uncovered_questions');
  });

  // The frontier mirror runs after this step, so on a lineage's first iteration
  // the answered node is only in the node store beside the state log.
  it('attaches a first-iteration answer to the frontier node the mirror has not stored yet', () => {
    const fixture = createFixture('finding-rows-first-iteration');
    writeFileSync(join(fixture.artifactDir, 'frontier-nodes.jsonl'), `${JSON.stringify({
      nodeId: 'F-1-001', parentId: 'root', depth: 1, question: FRONTIER_QUESTION, status: 'open', iteration: 0,
    })}\n`, 'utf8');
    const rows = [
      FINDING_ROWS[0],
      { ...FINDING_ROWS[1], sources: ['.skilled/commands/deep/assets/deep-research.yaml:10', '.skilled/commands/deep/assets/deep-research.yaml:20'] },
    ];
    writeDeltaIteration(fixture, undefined, { answeredQuestions: [FRONTIER_QUESTION], rows });

    const result = runStepCommand(renderStepCommand(command, fixture), fixture);

    expect(result.exitCode, result.stderr).toBe(0);
    const db = openDatabase(fixture.dbPath);
    try {
      expect(countEdges(db, 'ANSWERS')).toBe(2);
      // Two line refs into one file name one source.
      expect(countEdges(db, 'CITES')).toBe(3);
    } finally {
      db.close();
    }
  });

  // A default run whose leaf declared no QUESTION node has nothing to answer:
  // the graph stays empty, so the stop decision reads it exactly as before.
  it('adds nothing when no QUESTION node matches an answered question', () => {
    const fixture = createFixture('finding-rows-no-question');
    writeDeltaIteration(fixture, undefined, { answeredQuestions: [FRONTIER_QUESTION], rows: FINDING_ROWS });

    const result = runStepCommand(renderStepCommand(command, fixture), fixture);

    expect(result.exitCode, result.stderr).toBe(0);
    if (existsSync(fixture.dbPath)) {
      const db = openDatabase(fixture.dbPath);
      try {
        expect(countRows(db, 'coverage_nodes')).toBe(0);
        expect(countRows(db, 'coverage_edges')).toBe(0);
      } finally {
        db.close();
      }
    }
  });

  // A leaf that declared its own findings already linked them; the same finding
  // through a row must not add a second answering edge to the question.
  it('does not count a finding twice when the leaf also declared graph events', () => {
    const fixture = createFixture('finding-rows-dedupe');
    seedQuestionNode(fixture);
    writeDeltaIteration(fixture, [
      { type: 'node', id: 'leaf-f-stop', kind: 'FINDING', label: 'The stop decision lives in convergence.cjs' },
      { type: 'edge', id: 'leaf-e-stop', source: 'leaf-f-stop', target: 'frontier-F-1-001', relation: 'ANSWERS' },
    ], { answeredQuestions: [FRONTIER_QUESTION], rows: FINDING_ROWS.slice(0, 1) });

    const result = runStepCommand(renderStepCommand(command, fixture), fixture);

    expect(result.exitCode, result.stderr).toBe(0);
    const db = openDatabase(fixture.dbPath);
    try {
      expect(countEdges(db, 'ANSWERS')).toBe(1);
    } finally {
      db.close();
    }
  });
});
