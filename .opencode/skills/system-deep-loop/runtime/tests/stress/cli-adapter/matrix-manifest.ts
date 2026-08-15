// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Adapter Stress Matrix
// ───────────────────────────────────────────────────────────────────

export const CLI_ADAPTER_SUBJECTS = [
  'cli-codex',
  'cli-opencode',
  'cli-pi',
  'cli-claude-code',
  'cli-devin',
  'cli-cursor',
  'fanout-run',
] as const;

export type CliAdapterSubject = typeof CLI_ADAPTER_SUBJECTS[number];

export const EDGE_CASE_ROWS = [
  { id: 'EC-001', slug: 'auth-failure', codexTest: 'passes through authentication stderr and exit status' },
  { id: 'EC-002', slug: 'model-or-balance', codexTest: 'passes through model-or-balance stderr and exit status' },
  { id: 'EC-003', slug: 'rate-limit', codexTest: 'passes through rate-limit stderr and exit status within one second' },
  { id: 'EC-004', slug: 'timeout', codexTest: 'marks a stalled dispatch timed out and invokes captured-pid reaping' },
  { id: 'EC-005', slug: 'stdin-hang', codexTest: 'closes stdin so a headless codex process cannot wait for input' },
  { id: 'EC-006', slug: 'child-spec-gate', codexTest: 'passes the non-interactive child gate environment to codex' },
  { id: 'EC-007', slug: 'sandbox-permission', codexTest: 'keeps the codex default read-only and records explicit workspace-write' },
  { id: 'EC-008', slug: 'transport-missing', codexTest: 'refuses dispatch when command -v codex fails' },
  { id: 'EC-009', slug: 'budget-rejection', codexTest: 'rejects an over-budget codex lineage before spawning a process' },
  { id: 'EC-010', slug: 'partial-lineage-death', codexTest: 'reports a signal-killed codex process as non-success' },
  { id: 'EC-011', slug: 'orphan-cleanup', codexTest: 'invokes captured-pid and direct-child cleanup without a blanket process sweep' },
  { id: 'EC-012', slug: 'worktree-collision', codexTest: 'dispatches from each isolated worktree cwd without crossing boundaries' },
  { id: 'EC-013', slug: 'node-modules-integrity', codexTest: 'preserves independent worktree node_modules boundaries during dispatch' },
  { id: 'EC-014', slug: 'self-invocation', codexTest: 'blocks same-kind recursion before spawning codex' },
] as const;

export type EdgeCaseRow = typeof EDGE_CASE_ROWS[number];

export interface MatrixCell {
  readonly edgeCaseId: EdgeCaseRow['id'];
  readonly subject: CliAdapterSubject;
  readonly testName: string | null;
  readonly testStatus: 'implemented' | 'pending';
  readonly playbookPath: string;
}

function playbookPath(subject: CliAdapterSubject, slug: string): string {
  if (subject === 'fanout-run') {
    return `cli-external-orchestration/manual-testing-playbook/fanout-stress/${slug}.md`;
  }
  return `cli-external-orchestration/${subject}/manual-testing-playbook/stress/${slug}.md`;
}

export const CLI_ADAPTER_STRESS_MATRIX: readonly MatrixCell[] = EDGE_CASE_ROWS.flatMap((row) => (
  CLI_ADAPTER_SUBJECTS.map((subject) => ({
    edgeCaseId: row.id,
    subject,
    testName: subject === 'cli-codex' ? row.codexTest : null,
    testStatus: subject === 'cli-codex' ? 'implemented' : 'pending',
    playbookPath: playbookPath(subject, row.slug),
  }))
));

export const PHASE_TWO_ADAPTER_SUBJECTS = [
  'cli-opencode',
  'cli-pi',
  'cli-claude-code',
  'cli-devin',
  'cli-cursor',
] as const satisfies readonly CliAdapterSubject[];

export type PhaseTwoAdapterSubject = typeof PHASE_TWO_ADAPTER_SUBJECTS[number];

function phaseTwoTestNames(subject: PhaseTwoAdapterSubject): readonly string[] {
  return [
    `retains ${subject} authentication diagnostics in bounded lineage output`,
    `retains ${subject} model-or-balance diagnostics in bounded lineage output`,
    `retains ${subject} rate-limit diagnostics without retry delay`,
    `times out and terminates the captured ${subject} process`,
    `closes stdin for the headless ${subject} process`,
    `passes child gate variables through the full ${subject} runtime`,
    `forwards the asserted ${subject} sandbox and permission flags`,
    `fails before ${subject} execution when its transport is unavailable`,
    `rejects an over-budget ${subject} lineage before process spawn`,
    `reports a signal-killed ${subject} lineage as failed`,
    `terminates the captured detached ${subject} process group after timeout`,
    `runs ${subject} from each isolated worktree cwd`,
    `preserves independent worktree node_modules boundaries during ${subject} dispatch`,
    `blocks recursive ${subject} fan-out before process spawn`,
  ];
}

export const CLI_ADAPTER_PHASE_TWO_ROWS: readonly MatrixCell[] = PHASE_TWO_ADAPTER_SUBJECTS.flatMap(
  (subject) => phaseTwoTestNames(subject).map((testName, index) => ({
    edgeCaseId: EDGE_CASE_ROWS[index].id,
    subject,
    testName,
    testStatus: 'implemented' as const,
    playbookPath: playbookPath(subject, EDGE_CASE_ROWS[index].slug),
  })),
);

const phaseTwoCellsByKey = new Map(
  CLI_ADAPTER_PHASE_TWO_ROWS.map((cell) => [`${cell.subject}:${cell.edgeCaseId}`, cell]),
);

export const CLI_ADAPTER_CURRENT_MATRIX: readonly MatrixCell[] = CLI_ADAPTER_STRESS_MATRIX.map((cell) => (
  phaseTwoCellsByKey.get(`${cell.subject}:${cell.edgeCaseId}`) ?? cell
));

const adapterSubjects = CLI_ADAPTER_SUBJECTS.filter((subject) => subject !== 'fanout-run');
const forbiddenOverclaimPattern = /classif(?:y|ies|ication)|reaps? every descendant|full[- ]tree reap/iu;

export const CLI_ADAPTER_MATRIX_AUDIT = Object.freeze({
  allAdapterBound: adapterSubjects.every((subject) => {
    const cells = CLI_ADAPTER_CURRENT_MATRIX.filter((cell) => cell.subject === subject);
    return cells.length === EDGE_CASE_ROWS.length
      && cells.every((cell) => cell.testStatus === 'implemented' && cell.testName !== null);
  }),
  forbiddenOverclaims: CLI_ADAPTER_CURRENT_MATRIX
    .filter((cell) => cell.testName !== null && forbiddenOverclaimPattern.test(cell.testName))
    .map((cell) => `${cell.subject}:${cell.edgeCaseId}:${cell.testName}`),
});
