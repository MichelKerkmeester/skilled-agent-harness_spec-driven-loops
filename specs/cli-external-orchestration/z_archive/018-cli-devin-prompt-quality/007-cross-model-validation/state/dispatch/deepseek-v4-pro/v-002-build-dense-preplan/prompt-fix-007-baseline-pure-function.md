# BUILD: fix-007-baseline-pure-function

## Bounds (what's in scope, what's not)

**CWD**: `fixtures/fix-007-baseline-pure-function/seed`
**Allowed writes**:
  - src/utils/format.ts
  - src/utils/format.test.ts

Do not modify files outside the allowed-writes list. Do not invent CLI flags or symbols. Allowlist for flags: (none).

## User-need (what's needed)

Add a pure function formatBytes(n: number): string to src/utils/format.ts returning '1.5 MB' style. Include 3 vitest cases: happy path (1500000 → '1.5 MB'), zero (0 → '0 B'), and large (1.5e9 → '1.5 GB').

**Failure cluster**: Baseline diagnostic
**Grounded in**: Optimizer seat O-1 (baseline diagnostic — if a variant fails this, deep problem unrelated to specific failure modes)

## Implementation plan (dense — every step has acceptance + verification)

Begin with `<pre-plan>` block containing AT LEAST 4 ordered steps. Each step MUST include:
- Inputs (state of files at this point)
- Outputs (state after this step)
- Acceptance criterion (specific, checkable)
- Verification command (executable)
- Stop condition (when to halt this step)

Sequential thinking minimum: 8 thoughts before producing any output.

## Limits (what NOT to do)

- Do not write absolute paths outside the fixture CWD
- Do not invent CLI flags; verify against allowlist before use
- Do not touch files outside the allowed-writes list (scope-creep is a hard fail)
- Do not assume libraries exist; if uncertain, smoke-run a 1-line import test first

## Done-when (acceptance)

- [ac-001] deterministic: 3 vitest cases pass
- [ac-002] grep: formatBytes exported
- [ac-003] grep: 3 test cases present

Each criterion above must pass. Emit verification commands inline so they can be re-run.
