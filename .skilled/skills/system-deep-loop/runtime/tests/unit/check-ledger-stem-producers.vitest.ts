// ┌──────────────────────────────────────────────────────────────────────────┐
// │ MODULE: check-ledger-stem-producers conformance                          │
// │ Each case writes a real fixture tree (both ledger schemas plus the        │
// │ producer surface) and asserts the real process exit code of the checker,  │
// │ so a pass is a statement about the census and the emitters, not a mock.   │
// └──────────────────────────────────────────────────────────────────────────┘

import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'check-ledger-stem-producers.cjs');
const REPO_ROOT = resolve(here, '..', '..', '..', '..', '..', '..');
const RUNTIME_REL = join('.skilled', 'skills', 'system-deep-loop', 'runtime');

const REVIEW_TYPES_REL = join(
  RUNTIME_REL, 'lib', 'deep-review-ledger-schema', 'deep-review-ledger-types.ts',
);
const RESEARCH_TYPES_REL = join(
  RUNTIME_REL, 'lib', 'deep-research-ledger-schema', 'deep-research-ledger-types.ts',
);

const PRODUCER_SURFACE = [
  '.skilled/commands/deep/assets/deep-review-auto.yaml',
  '.skilled/commands/deep/assets/deep-review-confirm.yaml',
  '.skilled/commands/deep/assets/deep-research-auto.yaml',
  '.skilled/commands/deep/assets/deep-research-confirm.yaml',
  join(RUNTIME_REL, 'scripts', 'fanout-run.cjs'),
  join(RUNTIME_REL, 'scripts', 'append-mode-event.cjs'),
  join(RUNTIME_REL, 'scripts', 'reduce-state.cjs'),
  join(RUNTIME_REL, 'scripts', 'verify-iteration.cjs'),
  join('.skilled', 'skills', 'system-deep-loop', 'deep-research', 'scripts', 'reduce-state.cjs'),
];

const REVIEW_AUTO = '.skilled/commands/deep/assets/deep-review-auto.yaml';
const REVIEW_CONFIRM = '.skilled/commands/deep/assets/deep-review-confirm.yaml';

const dirs: string[] = [];

afterEach(() => {
  for (const dir of dirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  dirs.length = 0;
});

function schemaFixture(declaration: string, stems: readonly string[], census: readonly string[]): string {
  return [
    `export const ${declaration} = Object.freeze([`,
    ...stems.map((stem) => `  '${stem}',`),
    '] as const);',
    '',
    `export type ${declaration.replace('EventStems', 'EventStem')} = typeof ${declaration}[number];`,
    '',
    `export const ${declaration === 'DeepReviewEventStems' ? 'DEEP_REVIEW_STEM_PRODUCERS' : 'DEEP_RESEARCH_STEM_PRODUCERS'} = Object.freeze({`,
    ...census,
    '} as const satisfies Readonly<Record<string, unknown>>);',
    '',
  ].join('\n');
}

interface FixtureOptions {
  readonly reviewStems?: readonly string[];
  readonly researchStems?: readonly string[];
  readonly reviewCensus?: readonly string[];
  readonly researchCensus?: readonly string[];
  readonly files?: Readonly<Record<string, string>>;
  readonly omitSurface?: readonly string[];
}

function writeFixture(options: FixtureOptions = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'stem-producers-'));
  dirs.push(root);

  const reviewStems = options.reviewStems ?? ['deep_review.alpha', 'deep_review.beta'];
  const researchStems = options.researchStems ?? ['deep_research.gamma'];
  const reviewCensus = options.reviewCensus ?? [
    `  'deep_review.alpha': { status: 'spoken', producers: ['${REVIEW_AUTO}'] },`,
    `  'deep_review.beta': { status: 'reserved', reason: 'No writer emits it today; a future step would speak it.' },`,
  ];
  const researchCensus = options.researchCensus ?? [
    `  'deep_research.gamma': { status: 'reserved', reason: 'No writer emits it today; a future step would speak it.' },`,
  ];

  const contents: Record<string, string> = {
    [REVIEW_TYPES_REL]: schemaFixture('DeepReviewEventStems', reviewStems, reviewCensus),
    [RESEARCH_TYPES_REL]: schemaFixture('DeepResearchEventStems', researchStems, researchCensus),
  };
  for (const file of PRODUCER_SURFACE) {
    if (options.omitSurface?.includes(file)) continue;
    contents[file] = '';
  }
  if (!options.omitSurface?.includes(REVIEW_AUTO)) {
    contents[REVIEW_AUTO] = '{"stem":"deep_review.alpha"}\n';
  }
  Object.assign(contents, options.files ?? {});

  for (const [relativePath, content] of Object.entries(contents)) {
    const absolute = join(root, relativePath);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, content);
  }
  return root;
}

function runChecker(repoRoot?: string): {
  status: number | null;
  stdout: string;
  stderr: string;
  payload: any;
} {
  const args = [CLI_PATH];
  if (repoRoot) args.push('--repo-root', repoRoot);
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
  let payload: any = null;
  try {
    payload = JSON.parse(result.stdout.trim());
  } catch {
    payload = null;
  }
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, payload };
}

describe('check-ledger-stem-producers rule cases', () => {
  it('passes a fixture whose census matches its emitters', () => {
    const r = runChecker(writeFixture());
    expect(r.stderr).toBe('');
    expect(r.status, JSON.stringify(r.payload)).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.registered).toBe(3);
    expect(r.payload.spoken).toBe(1);
    expect(r.payload.reserved).toBe(2);
    expect(r.payload.violations).toEqual([]);
  });

  it('reads an emitter whose JSON record rides inside an escaped YAML command', () => {
    const r = runChecker(writeFixture({
      files: { [REVIEW_AUTO]: 'printf \'%s\\n\' \'{\\"stem\\":\\"deep_review.alpha\\"}\'\n' },
    }));
    expect(r.status, JSON.stringify(r.payload)).toBe(0);
    expect(r.payload.ok).toBe(true);
  });

  it('fails when a registered stem has no census entry', () => {
    const r = runChecker(writeFixture({
      reviewCensus: [
        `  'deep_review.alpha': { status: 'spoken', producers: ['${REVIEW_AUTO}'] },`,
      ],
    }));
    expect(r.status).toBe(2);
    const violation = r.payload.violations.find((v: any) => v.rule === 'UNDECLARED_STEM');
    expect(violation).toBeDefined();
    expect(violation.stem).toBe('deep_review.beta');
  });

  it('fails when a stem declared spoken has no emitter on disk', () => {
    const r = runChecker(writeFixture({ files: { [REVIEW_AUTO]: '' } }));
    expect(r.status).toBe(2);
    const violation = r.payload.violations.find((v: any) => v.rule === 'SPOKEN_WITHOUT_EMITTER');
    expect(violation).toBeDefined();
    expect(violation.stem).toBe('deep_review.alpha');
    expect(violation.file).toBe(REVIEW_AUTO);
  });

  it('fails when a declared producer is missing from the emitter surface', () => {
    const r = runChecker(writeFixture({ omitSurface: [REVIEW_AUTO] }));
    expect(r.status).toBe(2);
    const rules = r.payload.violations.map((v: any) => v.rule);
    expect(rules).toContain('PRODUCER_SURFACE_MISSING');
    expect(rules).toContain('DECLARED_PRODUCER_MISSING');
  });

  it('fails when a reserved stem is emitted', () => {
    const r = runChecker(writeFixture({
      files: { [REVIEW_CONFIRM]: '{"stem":"deep_review.beta"}\n' },
    }));
    expect(r.status).toBe(2);
    const violation = r.payload.violations.find((v: any) => v.rule === 'RESERVED_STEM_EMITTED');
    expect(violation).toBeDefined();
    expect(violation.stem).toBe('deep_review.beta');
    expect(violation.file).toBe(REVIEW_CONFIRM);
  });

  it('fails when a producer emits an unregistered spelling', () => {
    const r = runChecker(writeFixture({
      files: { [REVIEW_AUTO]: '{"stem":"deep_review.alpha"}\n{"stem":"deep_review.not_registered"}\n' },
    }));
    expect(r.status).toBe(2);
    const violation = r.payload.violations.find((v: any) => v.rule === 'UNREGISTERED_EMITTER');
    expect(violation).toBeDefined();
    expect(violation.stem).toBe('deep_review.not_registered');
  });
});

describe('check-ledger-stem-producers against the committed tree', () => {
  it('finds every registered stem declared and every spoken stem emitted', () => {
    const r = runChecker(REPO_ROOT);
    expect(r.stderr).toBe('');
    expect(r.status, JSON.stringify(r.payload)).toBe(0);
    expect(r.payload.ok).toBe(true);
    // The measured vocabulary: 32 review + 36 research registrations. Twelve are
    // spoken: five written as whole dotted literals, and seven more built as a
    // prefix plus an interpolated event name, which an earlier literal-only scan
    // reported as spoken by nobody while passing clean.
    expect(r.payload.registered).toBe(68);
    expect(r.payload.spoken).toBe(12);
    expect(r.payload.reserved).toBe(56);
    expect(r.payload.violations).toEqual([]);
    const stems = new Set(r.payload.emitters.map((entry: any) => entry.stem));
    expect([...stems].sort()).toEqual([
      'deep_research.run_now_accepted',
      'deep_research.run_now_rejected',
      'deep_research.run_now_requested',
      'deep_research.run_now_restored',
      'deep_research.synthesis_complete',
      'deep_research.synthesis_incomplete',
      'deep_review.claim_adjudication',
      'deep_review.iteration_error',
      'deep_review.migration',
      'deep_review.recovery_baseline',
      'deep_review.synthesis_complete',
      'deep_review.synthesis_incomplete',
    ]);
  });
});
