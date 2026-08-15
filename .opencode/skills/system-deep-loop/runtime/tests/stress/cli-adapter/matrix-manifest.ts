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
