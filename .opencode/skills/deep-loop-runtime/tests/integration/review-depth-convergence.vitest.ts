import { describe, it } from 'vitest';

describe('review-depth convergence v2 fixtures', () => {
  // TODO(116/008): Convert this to a workflow-runner integration fixture that
  // executes step_check_convergence YAML with reducer registry state. The graph
  // runtime alone must keep graph-empty CONTINUE behavior for Phase F.
  it.todo('blocks graphless standard-scope STOP when fallback ledger rows are missing');
});
